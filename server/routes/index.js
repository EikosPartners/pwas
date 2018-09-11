let express = require("express");
// let data = require("../data/example.json");
let seed = require("../data/seed.js");
let router = express.Router();

let data = seed.generateDataSet(500);

setInterval(function() {
  data = seed.generateDataSet(100);
}, 3600000);

router.get("/", (req, res) => {
  res.send(data);
});

module.exports = router;
