let express = require("express");
// let data = require("../data/example.json");
let seed = require("../data/seed.js");
let router = express.Router();

let data = seed.generateDataSet(500);
let colorObj = { action: "changeColor", color: "Blue" };
setInterval(function() {
  data = seed.generateDataSet(100);
}, 3600000);

router.get("/", (req, res) => {
  res.send(data);
});

router.get("/color", (req, res) => {
  res.send(colorObj);
});

module.exports = router;
