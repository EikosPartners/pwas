let express = require("express");
let data = require("../data/example.json");
let router = express.Router();

router.get("/", (req, res) => {
  res.send(data);
});

module.exports = router;
