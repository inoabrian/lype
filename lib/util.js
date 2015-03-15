var _Util = {
   _guestIndex : 0,
   roomsUsed : [],
   namesUsed : [],
   userIds : {},
   registerUser : function(socket, name) {
      this.userIds[socket.id] = {
         'name' : name,
         'room' : 'Lobby'
      };
      socket.join('Lobby');
      this.namesUsed.push(name);
   },
   generateGuest : function() {
         ++this._guestIndex;
         return 'Guest' + this._guestIndex;
   },
   changeRoom : function(socket, roomName) {
      var roomNameFromId = this.userIds[socket.id].room;
      console.log('roomNameFromId : ' + roomNameFromId);
      if(roomNameFromId != roomName){
         this.userIds[socket.id].room = roomName;
         socket.leave(roomNameFromId);
         if(this.roomsUsed.indexOf(roomName) == -1){
            this.roomsUsed.push(roomName);
         }
         console.log('joining : ' + roomName)
         socket.join(roomName);
      }
   },
   removeUser : function(socket) {
      var userNameFromId = this.userIds[socket.id].name;
      var roomNameFromId = this.userIds[socket.id].roomName;
      var indexToRemoveName = this.namesUsed.indexOf(userNameFromId);
      if(indexToRemoveName != -1){
            socket.leave(roomNameFromId);
            delete this.namesUsed[indexToRemoveName];
            return true
      }else{
         // No name found
         return false;
      }
   }
};

module.exports = _Util;
