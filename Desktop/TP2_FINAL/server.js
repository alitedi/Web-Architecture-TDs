var express = require('express');
var bodyParser = require('body-parser');
var async = require('async');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio'); //working with the elements and classe etc on a given url
var fs = require('fs');
var modules = require('./allModules');
var url = require('url');
var app = express();

app.use(express.static(path.resolve(__dirname)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//all routings
app.post('/', function(req, res) {
        res.sendFile(path.join(__dirname +'/index.html'));
        });

app.post('/parse', function(req, res) {
     //const url = req.body.input_value;
    
     modules.first(req.body.input_value,function() {
           modules.second(function(){
                  modules.third(function(result){
                        console.log("====--------"+result);
                        res.send(result);
                  });
           });
                   
      });
         
      
});

//starting to listen to port 8000
app.listen(8000, function() {
    console.log('Server running at http://127.0.0.1:8000/');
});