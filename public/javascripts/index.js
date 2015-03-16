$(document).ready(function(){
   var socket = io.connect();
   //
   // function requestListener () {
   //    console.log(this.responseText);
   // }

   function changeView(view){
         window.location.pathname = 'room/' + view;
         // var oReq = new XMLHttpRequest();
         // oReq.onload = requestListener;
         // oReq.open('GET', 'https://whispering-coast-1807.herokuapp.com/room/' + view , true);
         // oReq.send();
   };

   socket.on('update-number', function(data) {
      console.log('data : ' + data);
      $('#userNumber').text("People Connected : " + data.numberOfUsers);
   });

   socket.on('room-change-success', function(data) {
      var userName = data.userName;
      // We should redraw the page to show chat and video
   });

   socket.on('room-change-error', function(data) {
      var userName = data.userName;
      window.alert('Username : ' + userName + ', is already taken');
      return false;
   });

   $('#submit').click(function(e){
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
