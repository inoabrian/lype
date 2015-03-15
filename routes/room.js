var express = require('express');
var router = express.Router();
var cors = require('cors');

/* GET users listing. */

// router.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// router.all('/:roomname', function(req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "X-Requested-With");
//    res.render('room', {
//       room: req.params.roomname
//    });
// });
//
router.get('/:roomname', cors(), function(req, res) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   res.render('room', {
      room: req.params.roomname
   });
});


module.exports = router;
