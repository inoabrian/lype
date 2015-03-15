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
      var hash = data.roomName;
      var userName = data.userName;
      changeView(hash);
   });

   $('#submit').click(function(e){
         var userName = $('#username').val();
         var roomName = $('#roomname').val();
         console.log(userName);
         console.log(roomName);
         socket.emit('roomChange', {'roomName' : roomName,'userName' : userName});
   });

});
