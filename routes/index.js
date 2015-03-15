var express = require('express');
var router = express.Router();
var app = express();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
      title: 'Lype',
      description : ['A new light weight Internet Calling application.\n', 'Built for gamers by some gamers.\n', 'Streaming data directly to the server for low overhead.', 'Provides a LIGHT WEIGHT calling experience while you game.']
  });
});

router.post('/',function(req,res){
   res('Post to create rooms...');
});

module.exports = router;
