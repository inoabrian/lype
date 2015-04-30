var userMedia = function () {
   this.localMediaStream = new Object();
   this.peerConn = new Object();
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
          video.src = window.URL.createObjectURL(localMediaStream);
          this.localMediaStream = localMediaStream;
          // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
          // See crbug.com/110938.
          video.onloadedmetadata = function(e) {
            console.log('hello');
            console.log(arguments);
          };

          this.createPeerConnection();
     }.bind(this), function(){
        console.log('error');
     });
   };

   this.createPeerConnection = function () {

      var connectionConfig = {'iceServers' : []};

      this.peerConn = new webkitRTCPeerConnection(connectionConfig) || new mozRTCPeerConnection(connectionConfig);

      this.peerConn.onicecandidate = function(e){
            socket.json.send({'type' : 'connection', 'data' : e.candidate});
      };

      this.peerConn.onaddstream = function(evt){
         document.getElementById('otherVideo').src = window.URL.createObjectURL(evt.stream);
      };

      this.mediaConstraints = {
         'mandatory' : {
            'OfferToReceiceAudio' : true,
            'OfferToReceiceVideo' : true
         }
      };

      this.setLocalAndSendMessage = function (sessionDescription){
            this.peerConn.setLocalDescription(sessionDescription);
            socket.json.send(sessionDescription);
      };

      this.peerConn.addStream(this.localMediaStream);

      this.peerConn.createOffer(this.setLocalAndSendMessage, function(e){
         console.log(e.toString());
      }, this.mediaConstraints);

      socket.on('message', onMessage);

      function onMessage(evt) {
        if (evt.type === 'offer') {
          if (!started) {
             this.createPeerConnection();
             this.started = true;
          }
          this.peerConn.setRemoteDescription(new RTCSessionDescription(evt));
          this.peerConn.createAnswer(setLocalAndSendMessage,
                                errorCallback,
                                media.mediaConstraints);

        } else if (evt.type === 'answer' && started) {
          peerConn.setRemoteDescription(new RTCSessionDescription(evt));

        } else if (evt.type === 'candidate' && started) {
          var candidate = new RTCIceCandidate(evt.candidate);
          peerConn.addIceCandidate(candidate);
        }
      }

   };

};
