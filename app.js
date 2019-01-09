var express = require('express'),
    bodyParser = require('body-parser'),
    mongojs = require('./db'),
    mongoose = require('mongoose');

var db = mongojs.connect;
var app = express();
    //uri = 'mongodb://localhost/tgrsu13',
    //option = {"auth":{"user":"gun", "password":"gun"}},
    //db = mongoose.connect(uri, option);
    //db = mongoose.connect(uri);

app.use(bodyParser.json());

require('./models/temperature.model');
require('./routes/index.route')(app);

var port = process.env.PORT||3000;
app.listen(port);
console.log("Server running at ", port);

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