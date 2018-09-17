var dir = require('node-dir');

var foldername = "C:\\ArchivedData\\ArchivedReports";
var fileName = [];
dir.readFilesStream(foldername,{
    match: /results_20180731.json$/,
    exclude: /^\./,
    },
    function(err, stream, next) {
        if (err) throw err;
        var content = '';
        stream.on('data',function(buffer) {
            content += buffer.toString();
        });
        stream.on('end',function() {
            console.log('content:',JSON.stringify(content));
            next();
        });
    },
    function(err, files){
        if (err) throw err;
        console.log('finished reading files:', files);
    });