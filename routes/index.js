var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.status(200);
  res.json({ message: "API OK"});
});

module.exports = router;