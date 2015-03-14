var _Util = {
   _guestIndex : 0,
   roomsUsed : [],
   namesUsed : [],
   userIds : {},
   users : {
      id : '',
      room : ''
   },
   registerUser : function(socket, name) {
      console.log('name' + name)
      this.userIds[name] = {
         'id': socket.id
      };
      console.log(this);
         // var tempUser = this.userIds[name];
         // tempUser['id'] = socket.id;
         // console.log(tempUser);
   },
   generateGuest : function() {
         ++this._guestIndex;
         return 'Guest' + this._guestIndex;
   },
   assignRoom : function(socket, roomName) {
      if(roomName == 'Lobby'){
         socket.join(roomName);
      }else{
         if(this.roomsUsed.indexOf(roomName) != -1){
         }else{
            this.roomsUsed.push(roomName);
            socket.join(roomName);
         }
      }
      return true;
   },
   removeUser : function(socket, roomName, namesUsed, roomsUsed) {
      console.log('remove User from room and app.');
   }
};

module.exports = _Util;
