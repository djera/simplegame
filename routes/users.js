var express = require('express');
var router = express.Router();

var http = require('http'),
    fs = require('fs');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
