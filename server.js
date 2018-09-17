const express = require('express');
const fs = require('fs');
const dirList = require('./benchmarkFileNames');
const app = express();
const port = process.env.PORT || 5000;
var arrayList = new Array();
var foldername = "C:\\ArchivedData\\ArchivedReports";
var foldernamebenchmark = "C:\\ArchivedData\\ArchivedBenchmarks";
var bodyParser = require('body-parser')
app.use( bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  limit: '50mb',extended: true
})); 
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodie
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});


app.get('/api/check', (req, res) => {
  var response = [];
    fs.readdir(foldername, function (e, content) {
      if (e) {
        res.send(500, 'Something went wrong');
      }
      else {
       response = content;
      res.send({express: response});
      }
  })  
});

app.get('/api/benchmark', (req, res) => {
  var response = [];
    fs.readdir(foldernamebenchmark, function (e, content) {
      if (e) {
        res.send(500, 'Something went wrong');
      }
      else {
       response = content;
      res.send({express: response});
      }
  })
});


app.get('/api/getdata:filename', (req, res) => {
  var name = req.params.filename;
  name= name.replace(":","");
  name = name.replace("\"","");
  name = name.replace("\"","");

    fs.readFile(foldername+'\\'+ name,'utf8', function (e, content) {
      if (e) {
        res.send(500, foldername + '\\' + name);
      }
      else {
        const response = JSON.parse(content);
        


       res.json(response)
      }
  })
});

app.get('/api/getbenchmarkdata:filename', (req, res) => {
  var name = req.params.filename;
  name= name.replace(":","");
  name = name.replace("\"","");
  name = name.replace("\"","");

    fs.readFile(foldernamebenchmark+'\\'+ name,'utf8', function (e, content) {
      if (e) {
        res.send(500, foldernamebenchmark + '\\' + name);
      }
      else {
        const response = JSON.parse(content);
       res.json(response)
      }
  })
});


app.post('/api/updateFile',(req, res) => {
  
// let student = {  
//   name: 'Mike',
//   age: 23, 
//   gender: 'Male',
//   department: 'English',
//   car: 'Honda' 
// }

// let data = JSON.stringify(student);
//let data = JSON.stringify(req.params.filecontent); 
  //console.log(data)
  var name = JSON.stringify(req.body)
  //console.log(name)
  fs.writeFileSync(foldernamebenchmark+'\\benchmark.json',name); 
  res.send({msg: 'Successfull'});
});


app.listen(port, () => console.log(`Listening on port ${port}`));