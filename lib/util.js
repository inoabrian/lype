var _Util = {
   roomsUsed : [],
   namesUsed : [],
   users : {
      id : '',
      room : ''
   },
   assignRoom : function(socket, roomName) {
         if(roomName == 'Lobby'){
            socket.join(roomName);
         }else{
            if(this.roomsUsed.indexOf(roomName) != -1){
               // Join the Room
            }else{
               // Create a Room
            }
         }
   }
};

module.exports = _Util;
