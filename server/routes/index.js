let express = require("express");
// let data = require("../data/example.json");
let seed = require("../data/seed.js");
let router = express.Router();

let colorObj = { action: "changeColor", color: "Blue" };

let data = seed.generateDataSet(500);
let refreshTime = 20000;
setInterval(function() {
  data = seed.updateDataSet(data);
}, refreshTime);

router.get("/", (req, res) => {
  res.send(data);
});

router.get("/update", (req, res) => {
  let update = data.slice(400, data.length);
  res.send(update);
});

router.get("/color", (req, res) => {
  res.send(colorObj);
});

module.exports = router;
