var _Util = {

   _guestIndex : 0,
   roomsUsed : [],
   namesUsed : [],
   userIds : {},
   chatPopulation : 0,

   registerUser : function(socket, name) {
      this.userIds[socket.id] = {
         'name' : name,
         'room' : 'Lobby'
      };
      socket.join('Lobby');
      this.namesUsed.push(name);
      return true;
   },

   checkNameAvailable : function(name) {
      if(this.namesUsed.indexOf(name) == -1){
         return true;
      }else{
         return false;
      }
   },

   generateGuest : function() {
         ++this._guestIndex;
         return 'Guest' + this._guestIndex;
   },

   changeName : function(socket, userName) {
      var userNameFromId = this.userIds[socket.id].name;
      var nameIndex = this.namesUsed.indexOf(userName);
      var removeNameIndex = this.namesUsed.indexOf(userNameFromId);

      if(userNameFromId != userName && nameIndex  == -1){
         this.namesUsed[removeNameIndex] = userName;
         this.userIds[socket.id].name = userName;
         return 1;
      }
      return 0;
   },

   removeUser : function(socket) {
      var userNameFromId = this.getUserName(socket);
      var roomNameFromId = this.getRoomName(socket);
      var indexToRemoveName = this.namesUsed.indexOf(userNameFromId);
      if(indexToRemoveName != -1){
            socket.leave(roomNameFromId);
            delete this.namesUsed[indexToRemoveName];
            this.userIds[socket.id] = {};
            delete this.userIds[socket.id];
            this.namesUsed.length -= 1;
            this.chatPopulation -= 1;
            return true
      }else{
         // No name found
         return false;
      }
   },

   getUserName : function(socket) {
      console.log('getUserName' + this.userIds[socket.id].name);
      return this.userIds[socket.id].name;
   },

   getRoomName : function(socket) {
      return this.userIds[socket.id].roomName;
   }

};

module.exports = _Util;
