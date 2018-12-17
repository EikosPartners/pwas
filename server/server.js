let express = require('express');
let helmet = require('helmet');
let app = express();
let cors = require('cors');
let applications = require('./data/JSC_WS.json')

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
// setInterval(function() {
//   io.emit('refresh');
// }, 20500);

let contexts = []

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


  socket.on('appManager', function(data){
    // parent window getting information about child window and setting up listeners for its context 
    // data should be the name of the child application ala JSCBubble 
    let requestedApp = applications.filter(function(appJson){
      return appJson.name == data.to
    })[0]
    console.log('requested app', requestedApp)
    let context = Date.now() 
        socket.on(context + "dataToServer", function(data2) {
          console.log(context)
          console.log('dataToServer received')
          console.log(context + "dataToChild")
          io.emit(context + "dataToChild", data2)
        })
    
        socket.on(context + "childReady", function(data3) {
          console.log('childReady received manager')
          console.log(data3)
              io.emit(context + "sendData", data3)
        })
    console.log('app manager received')

    if (data.shift) {
      io.emit('getNewChartInfo', {...requestedApp, context, filter: data.from, shift: true})
    } else {
      io.emit('getNewChartInfo', {...requestedApp, context, filter: data.from})
    }
  
    socket.on(context + "parentNameToServer", function(parent) {
      console.log(parent)
      io.emit(context + 'parentNameToChild', parent)
    })


  })

  socket.on('appManaged', function(data) {
    // child window setting up listeners for its context with parent 
    // data will be the context (Date.now) established above
    // console.log
    console.log('context', data)

    socket.on(data + "parentNameToServer", function(parent) {
      console.log(parent)
      io.emit(data + 'parentNameToChild', parent)
    })

    socket.on(data + "dataToServer", function(data2) {
      console.log('dataToServer received')
      console.log(data + "dataToChild")
      io.emit(data + "dataToChild", data2)
    })

    socket.on(data + "childReady", function(data3) {
      console.log('childReady received managed')
      console.log(data3)
      io.emit(data + "sendData", data3)
    })

  })
  
  socket.on('why', function(data) {
    // available to ensure events have been registered - for debugging  
    console.log(socket.eventNames())
    io.emit('why', 'oh')
  })

  socket.on('themeColor', function(data) {
    colorObj.color = data.name;

    console.log('Send to all listeners ' + data.name);
    io.emit('themeColor', data);
  });
  socket.on('themeLighting', function(data) {
    colorObj.lighting = data;
    io.emit('themeLighting', data);
  });
});
module.exports = server;
