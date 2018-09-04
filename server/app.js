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
  // console.log(socket.conn)
  // console.log(socket.handshake)
  let testData = { data: "test object" };
  io.emit("test event", testData);
});
