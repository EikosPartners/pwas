let jslinq = require("jslinq");
let fs = require('fs')

//let metrics_log='C:\\Users\\latti\\AppData\\Local\\Tick42\\GlueDesktop\\assets\\gw\\metrics.json'
let metrics_log='.\\data\\metrics.json'

function parseDate(date) {
  let dateA = date.split('T')[0].split('-');
  return dateA[1] + '-' + dateA[2] + '-' + dateA[0];
}

exports.aquireMetrics = () => {
  let file = fs.readFileSync(metrics_log)
  
  //console.log (file)

  var buf = new Buffer(file, "utf-8");
  var content = buf.toString()

  //console.log(content)

  let array = content.split('\n')

  //console.log(array)

  let jsonArray = []
  array.forEach( item =>{ 
    try {
      let jsonObject = JSON.parse(item);
      //console.log(jsonObject)
      if ( jsonObject.op === 'publish') {
        jsonArray.push( jsonObject)
      }
    } catch (err) {}
  })

  let result = jslinq(jsonArray).select( i => {
    return {
      user: i.id.user,
      application: i.id.application,
      os:i.id.os,
      start: new Date(i.id["start-time"]),
      timestamp: new Date(i.data[0].timestamp),

      element:i,
    }
  })
  return result.toList();
};