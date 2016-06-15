var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { phoneNumber: '386-267-6604' });
});

module.exports = router;
