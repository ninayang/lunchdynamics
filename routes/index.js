var express = require('express');
var router = express.Router();
var path = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html');
});

router.get('/goog', function(req, res, next) {
	res.render('goog.html');
})
module.exports = router;
