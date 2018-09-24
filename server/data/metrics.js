let jslinq = require("jslinq");
let fs = require('fs')
let metrics_log='C:\\Users\\latti\\AppData\\Local\\Tick42\\GlueDesktop\\assets\\gw\\metrics.json'

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


  console.log(jsonArray)

  console.log( array.length)
  console.log( jsonArray.length)

  //return JSON.parse(file);
  return JSON.stringify(jsonArray);
};