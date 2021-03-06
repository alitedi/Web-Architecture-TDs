var express = require("express");
var path = require("path");
// Instantiate the express object
var app = express();
// Use the static assets from the same directory as this server.js file
app.use(express.static(path.resolve(__dirname)));
// index.html
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname +'/index.html'));
});
// Start the server *
var port = process.env.PORT || 8000;
var server = app.listen(port, function() {
  console.log('Listening on port:', port);
});
//http://dannydelott.com/creating-and-running-a-simple-node-js-server/
