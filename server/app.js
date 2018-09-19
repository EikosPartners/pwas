let express = require('express');
let helmet = require('helmet');
let app = express();
let cors = require('cors');

let http = require('http');

let { router, colorObj } = require('./routes/');
let bodyParser = require('body-parser');
app.use(cors());
app.use(helmet());

app.use('/', router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let server = http.createServer(app);

server.listen(9000);
var io = require('socket.io').listen(server);
setInterval(function() {
  io.emit('refresh');
}, 20500);

var connectCount = 0;
io.sockets.on('connection', function(socket) {
  //send data to clienzt
  console.log(colorObj);
  connectCount++;
  console.log('Connection Established:', connectCount);
  socket.on('filterByDate', function(data) {
    console.log(data);
    io.emit('filterByDate', data);
  });
  socket.on('filterByProject', function(data) {
    console.log(data);
    io.emit('filterByProject', data);
  });
  socket.on('filterBySeverity', function(data) {
    console.log(data);
    io.emit('filterBySeverity', data);
  });
  socket.on('filterByRaisedBy', function(data) {
    console.log(data);
    io.emit('filterByRaisedBy', data);
  });
  socket.on('filterByDateAndSeverity', function(data) {
    console.log(data);
    io.emit('filterByDateAndSeverity', data);
  });
  socket.on('filterByMonth', function(data) {
    console.log(data);
    io.emit('filterByMonth', data);
  });
  socket.on('themeColor', function(data) {
    colorObj.color = data.name;

    console.log('Send to all listeners ' + data.name)
    io.emit('themeColor', data);
  });
});
module.exports = server;
