var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var _Util = require('./lib/util.js');
var routes = require('./routes/index');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(cookieParser());
app.use('/', routes);
// app.use('/room', room);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
   app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
         message: err.message,
         error: err
      });
   });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
   res.status(err.status || 500);
   res.render('error', {
      message: err.message,
      error: {}
   });
});

//Moved room route here
app.get('/:roomname', function(req, res) {
   res.render('room', {
      room: req.params.roomname
   });
});

// function to initiate a user after they submit their nickname
function initiate(socket) {
   var guestName = _Util.generateGuest();
   _Util.registerUser(socket, guestName);
}

io.sockets.on('connection', function(socket) {
   console.log('User Connected');
   io.sockets.emit('update-number', {
      'numberOfUsers': _Util.namesUsed.length
   });

   socket.emit('check-user', {
      'time': new Date()
   });

   socket.on('duplicate', function(data) {
      var name = data.name;
      var nameAvailable = _Util.checkNameAvailable(name);
      console.log('duplicate - name: ' , name, 'name available : ' ,nameAvailable);
      if (nameAvailable) {

         this.emit('checkDuplicateNameReturn', {
            'status': true
         });

      } else {

         this.emit('checkDuplicateNameReturn', {
            'status': false
         });
      }
   });

   socket.on('enter-chat', function(data) {

      var registered = _Util.registerUser(this, data.userName);
      console.log('registered : ' + registered);

      if (registered) {

         socket.emit('room-change-success', {
            'userName': data.userName
         });

      }

   });

   socket.on('updateChatNumber', function(data) {

      _Util.chatPopulation += 1;
      var population = data.chatPopulation;

      io.sockets.emit('updateChatPopulation', {
         'populationNumber': population
      });

      io.sockets.emit('update-number', {
         'numberOfUsers': _Util.chatPopulation
      });


   });

   socket.on('updateChatText', function(data) {
      io.sockets.emit('updateChatText', {
         'text': data.text
      });
   });

   socket.on('video', function(data) {
      console.log(data.buffer);
   });

   socket.on('disconnect', function() {
      console.log('user left');
      var userNameLeaving = _Util.removeUser(this);
      io.sockets.emit('update-number', {
         'numberOfUsers': _Util.chatPopulation
      });
   });

});

var PORT = '8080';

console.log('Server Started on port ' + PORT);

http.listen(process.env.PORT || PORT);
