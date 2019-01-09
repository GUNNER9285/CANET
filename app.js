var express = require('express'),
    bodyParser = require('body-parser'),
    mongojs = require('./db'),
    mongoose = require('mongoose');

//var db = mongojs.connect;
var app = express(),
    uri = 'mongodb://localhost/tgrsu13',
    option = {"auth":{"user":"gun", "password":"gun"}},
    db = mongoose.connect(uri, option,  { useNewUrlParser: true });
    //db = mongoose.connect(uri);

app.use(bodyParser.json());

require('./models/temperature.model');
require('./routes/index.route')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

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