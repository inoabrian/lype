var userMedia = function() {
   var socket = io.connect();
   this.hasGetUserMedia = function () {
     return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
               navigator.mozGetUserMedia || navigator.msGetUserMedia);
   };

   this.check = function() {
      if (this.hasGetUserMedia()) {
        alert('Good to go!');
        this.getAccesToMedia();
      } else {
        alert('getUserMedia() is not supported in your browser');
      }
   };

   this.getAccesToMedia = function() {
      navigator.getUserMedia  = navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.msGetUserMedia;

      navigator.getUserMedia({video: true, audio: false}, function(localMediaStream) {
          var video = document.querySelector('video');
          var localMediaStream = localMediaStream;
          video.src = window.URL.createObjectURL(localMediaStream);

          // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
          // See crbug.com/110938.
          video.onloadedmetadata = function(e) {
            console.log('hello');
            var x = new XMLHttpRequest();
            var url = window.URL.createObjectURL(localMediaStream);
            url = url.replace(/%3A/g, ':');
            url = url.substr(5);
            var streamBuffer;
            x.onload = function (e){
               console.log(x.response);
               streamBuffer = x.response;
            };
            x.open('get', url, true);
            x.responseType = 'arraybuffer';
            x.send();

            socket.emit('video', {'buffer' : streamBuffer});
          };
     }, function(){
        console.log('error');
     });
   };
};
