let jslinq = require("jslinq");
let fs = require('fs')

let data_file= './data/cached-aggregate.json'


if (process.platform == 'win32') {
  data_file = '.\\data\\cached-aggregate.json'
}

exports.aquirePositions = () => {
  if (fs.existsSync(data_file)) {
    let data = fs.readFileSync(data_file)
    console.log(data)
    return JSON.parse(data).recordset
  } else {
    console.log('File does not exist')
  }

  return undefined
};