var express = require('express');
var bodyParser = require('body-parser');
var async = require("async");
var app     = express();
var path = require("path");
var modules = require('./allModules');
app.use(express.static(path.resolve(__dirname)));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname +'/index.html'));
});
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/parse', function(req, res) {
  res.send('Watch your terminal for the Prices on lecentrale site, You sent the name "' + req.body.url3 + '".');
  console.log(req.body.url3);
   modules.leboncoinModule(req.body.url3,function() {
      //console.log("here");
      //modules.lacentraleModule();
    });
    modules.lacentraleModule();
});

app.listen(8000, function() {
  console.log('Server running at http://127.0.0.1:8000/');
});
