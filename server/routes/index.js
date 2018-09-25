let express = require('express');
// let data = require("../data/example.json");
let bodyParser = require('body-parser');
let seed = require('../data/seed.js');
let metrics = require('../data/metrics.js');
let router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

let colorObj = { action: 'changeColor', color: 'blue', lighting: 'light' };

let data = seed.generateDataSet(500);
let refreshTime = 20000;
setInterval(function() {
  data = seed.updateDataSet(data);
}, refreshTime);

router.get('/', (req, res) => {
  res.send(data);
});

router.get('/update', (req, res) => {
  let update = data.slice(400, data.length);
  res.send(update);
});

router.get('/color', (req, res) => {
  res.send(colorObj);
});

router.get('/metrics', (req, res) => {
  res.send(metrics.aquireMetrics());
});

router.post('/color', (req, res) => {
  colorObj.color = req.body.color;
  res.send('Complete');
});

module.exports = {
  colorObj,
  router
};
