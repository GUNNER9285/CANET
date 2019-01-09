var express = require('express'),
    bodyParser = require('body-parser'),
    mongojs = require('./db');

var db = mongojs.connect;
var app = express();

app.use(bodyParser.json());

require('./models/temperature.model');
require('./routes/index.route')(app);
require('./routes/integrate.route')(app);

var port = process.env.PORT||3000;
app.listen(port);
console.log("Server running at port:"+ port);

module.exports = app;

/*
var http = require("http");

http.createServer(function (req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write("Hello My World!");
    res.end();
}).listen(3000);

console.log("Server running...");
*/