var express = require('express');
var router = express.Router();;

/* GET users listing. */
router.get('/:roomname', function(req, res) {
  res.render('room', {
      room: req.params.roomname
   });
});


module.exports = router;
