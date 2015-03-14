$(document).ready(function(){
   var socket = io.connect();

   $('#submit').click(function(e){
         var userName = $('#username').val();
         var roomName = $('#roomname').val();

         socket.emit('roomChange', {'data':{'roomName' : roomName,'userName' : userName}});
   });
});
