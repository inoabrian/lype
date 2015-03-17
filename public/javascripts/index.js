$(document).ready(function(){
   var socket = io.connect();
   var userNameForIcon = '';
   function animateAlert(userName){
      $('#alert').slideDown('slow', function(){
            $(this).toggleClass('hidden');
            $(this).css('border-color',  '#e74c3c').animate({
                 borderWidth: 4
            }, 500);
            $('#alert-text').text('Username : ' + userName + ' is already taken');
            // animate div like glow or bounce...etc...
            setTimeout(function(){
               $(this).toggleClass('hidden');
            }.bind(this), 3000);
      });
   };

   socket.on('update-number', function(data) {
      $('#userNumber').text(": " + data.numberOfUsers);
      var message = data.userLeaving + ' has left the room.';
      var newElement = $('<div></div>').text(message);
      $('#chat').append(newElement);
   });

   socket.on('updateChatText', function(data){
      var message = data.text;
      var newElement = $('<div></div>').text(message);
      $('#chat').append(newElement);
   });

   socket.on('room-change-success', function(data) {
      $('#chat').text('');
      var userName = data.userName;
      var socket = this;
      $('#title').toggleClass('hidden');
      $('#inputArea').toggleClass('hidden');
      $('#videoArea').toggleClass('hidden');
      $('#chatArea').toggleClass('hidden');
      $('#chatInput').toggleClass('hidden');
      $('#close').toggleClass('hidden');
      $('#chattext').on('keypress', function(event) {
               if(event.which == 13){
                  var text = userName + ' : ' + $(this).val() + '\t[' + new Date() + ']\r\n';
                  socket.emit('updateChatText', {'text' : text});
                  $('#chattext').val('');
               }
      });
      this.emit('updateChatNumber',{'chatPopulation' : userName });
   });

   socket.on('room-change-error', function(data) {
      var userName = data.userName;
      animateAlert(userName);
      return false;
   });

   socket.on('updateChatPopulation', function(data){
      var message = data.populationNumber + ' has joined the room \t[' + new Date() +']';
      var newElement = $('<div></div>').text(message);
      $('#chat').append(newElement);
   });

   $('#submit').click(function(e) {
         var userName = $('#username').val();
         if(userName != ''){
            $('#username').css('border-color',  '#27ae60').animate({
                 borderWidth: 1
            }, 500);
            $('#userNameText').text(' : ' + userName);
            socket.emit('enterChat', {'userName' : userName});
         }else{
            $('#username').css('border-color',  '#e74c3c').animate({
                 borderWidth: 4
            }, 500);
         }
   });

});
