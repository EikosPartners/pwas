let express = require("express");
let helmet = require("helmet");
let app = express();
let cors = require("cors");

let http = require("http");

let index = require("./routes/");
app.use(cors());
app.use(helmet());

app.use("/", index);

let server = http.createServer(app);

server.listen(9000);

var io = require("socket.io").listen(server);
var connectCount = 0;
io.sockets.on("connection", function(socket) {
  //send data to clienzt
  connectCount++;
  console.log("Connection Established:", connectCount);
  socket.on("filterByDate", function(data) {
    console.log(data);
    io.emit("filterByDate", data);
  });
  socket.on("filterByProject", function(data) {
    console.log(data);
    io.emit("filterByProject", data);
  });
  socket.on("filterBySeverity", function(data) {
    console.log(data);
    io.emit("filterBySeverity", data);
  });
  socket.on("filterByRaisedBy", function(data) {
    console.log(data);
    io.emit("filterByRaisedBy", data);
  });
});
