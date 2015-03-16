$(document).ready(function(){
   var socket = io.connect();
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
      $('#userNumber').text("People Connected : " + data.numberOfUsers);
   });

   socket.on('room-change-success', function(data) {
      var userName = data.userName;
      $('#title').toggleClass('hidden');
      $('#inputArea').toggleClass('hidden');
      $('#videoArea').toggleClass('hidden');
      $('#chatArea').toggleClass('hidden');
      $('#userNumber').toggleClass('hidden');

      this.emit('updateChatNumber',{'chatPopulation' : userName });
      // We should redraw the page to show chat and video
   });

   socket.on('room-change-error', function(data) {
      var userName = data.userName;
      animateAlert(userName);
      return false;
   });

   socket.on('updateChatPopulation', function(data){
      $('#chat').append('<div>' + data.populationNumber + ' has joined the room.[' + new Date() +']</div>')
   });

   $('#submit').click(function(e) {
         var userName = $('#username').val();
         if(userName != ''){
            $('#username').css('border-color',  '#27ae60').animate({
                 borderWidth: 1
            }, 500);
            socket.emit('enterChat', {'userName' : userName});
         }else{
            $('#username').css('border-color',  '#e74c3c').animate({
                 borderWidth: 4
            }, 500);
         }
   });

});
