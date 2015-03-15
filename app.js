var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _Util = require('./lib/util.js');
var routes = require('./routes/index');
var room = require('./routes/room');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Package to enable CORS
var cors = require('cors');

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
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

io.sockets.on('connection', function (socket) {
    var guestName = _Util.generateGuest();
    _Util.registerUser(socket, guestName);
    io.sockets.emit('update-number', {'numberOfUsers' : _Util.namesUsed.length});

    socket.on('disconnect', function() {
      _Util.removeUser(this);
      io.sockets.emit('update-number', {'numberOfUsers' : _Util.namesUsed.length});
   });

   socket.on('roomChange', function(data){
      var roomName = data.roomName;
      var userName = data.userName;
      var socket = this;
      if(_Util.changeRoom(socket, roomName)){
        //Change rooms by emmiting client side event
        this.emit('room-change-success', {'roomName' : roomName, 'userName' : userName});
      }else{
        /// No room change stay in curent room
      }

   });

});

http.listen(process.env.PORT || '8000');
