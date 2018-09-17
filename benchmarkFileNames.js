
var foldername = "C:\\ArchivedData\\ArchivedReports";

const fs = require('fs');


function getDirectories(foldername, callback) {
    fs.readdir(foldername, function (err, content) {
        if (err) return callback(err)
        callback(null, content)
    })
  }
  
  function callback (err, content) {
    return console.log(content);
  }

