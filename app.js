var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var routes = require('./routes/index');
var users = require('./routes/users');
var babylontest = require('./routes/babylontest');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/babylon', babylontest);

function sendTime() {
  io.emit('time', { time: new Date().toJSON()});
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

console.log("Starting server");
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var players = {};
routes.io = io;

io.sockets.on('connection', function (socket) {
    new createPlayer(socket);
    socket.on('player-position', function(data) {
      var id = data.id;
      if (players[data.id] !== undefined && players[data.id].data !== undefined) {
        //console.log("id: " + players[data.id].data.id + " X: " + players[data.id].data.x + " Y: " + players[data.id].data.y);
        players[data.id].data = data;
      }

    });
    socket.on('drop', function(data) {
      setActive(data);
    });

});

server.listen(3000, "127.0.0.1");

// error handlers

setInterval(ping, 2000);


function createPlayer(socket) {
  var id = guid();
  var color = getRandomColor();
  players[id] = {};
  players[id].active = true;
  players[id].data = {};
  players[id]['active'] = true;
  socket.emit('player-connected', { color: color, id: id});
}

function ping() {
  io.emit('ping', {});
  setAllInactive();
  setTimeout(checkActive, 1000);
}

function setActive(id) {
    if (players[id.id] !== undefined && players[id.id]['active'] !== undefined) players[id.id]['active'] = true;
}

function setAllInactive() {
  for (p in players) {
    if (p != null && players[p] != undefined) {
      if (players[p]['active'] !== undefined) {
          players[p]['active'] = false;
        }
      }
    }
  }

function checkActive() {
  var players_count = 0;
  for (p in players) {
    if (p != null) {
      if (players[p] !== undefined && players[p]['active'] !== undefined) {
        if (!players[p]['active']) {
              delete players[p];
        }
      }
    }
  }
}
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
exports.sendTime = sendTime;
exports.players = players;
exports.io = io;
