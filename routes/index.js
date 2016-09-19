var express = require('express');
var gameloop = require('node-gameloop');
var router = express.Router();
var app = require('../app');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var width = 1200;
var height = 800;
var gravity = 0.8;
var friction = 1;
var frameCount = 0;
var id = gameloop.setGameLoop(function(delta) {
    // `delta` is the delta time from the last frame
    //if (io !== null) io.emit('time', { time: 'new Date().toJSON()'});
    //for (u in app.players) {
      //if (u != null && app.players[u] !== undefined && app.players[u].data !== undefined) {
        //var player = app.players[u].data;
        //app.players[u].data = player;
      //}
    //}
    var data = JSON.parse(JSON.stringify(app.players));
    for (p in data) {
      //console.log((p == player.id) + " " + p + " " + player.id + " 22");
      if (p != null) {
        //console.log("p " + data[p]['data']['id'] + " X:" + data[p]['data'].x + " Y:" + data[p]['data'].y);
        //console.log("P: " + JSON.stringify(players[p]));
        //drawPlayer(players[p]['data']);
      }
    }
    app.io.emit('players', data);
    //else console.log(io == null);
}, 1000 / 120);

// stop the loop 2 seconds later
/*setTimeout(function() {
    console.log('2000ms passed, stopping the game loop');
    gameloop.clearGameLoop(id);
}, 2000);*/
module.exports = router;
