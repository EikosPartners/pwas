var fs = require('fs')

fs.readFile('JSC.json', 'utf-8', function(err, data){
    if (err) throw err;

    var newValue = JSON.parse(data).map(item=>{
        var newSubvalue = {}
        newSubvalue.name = item.name
        newSubvalue.title = item.title
        newSubvalue.url = item.details.url 
        newSubvalue.size = {height: item.details.height, width: item.details.width}
        newSubvalue.allowMultiple = item.allowMultiple
        return newSubvalue
    })

    fs.writeFile('JSC_WS.json', JSON.stringify(newValue), 'utf-8', function (err) {
        if (err) throw err;
        console.log('fileWrite complete');
    });

})