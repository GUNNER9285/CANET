var fs = require("fs"),
    mongoose = require('mongoose'),
    mongojs = require('../db'),
    db = mongojs.connect;

//var db = require('../models/DB');
//var temperature = mongoose.model('Temperature');


exports.getIndex = function(req, res) {
    res.send("Team: CANET");
};

exports.getListUsers = function(req, res) {
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        console.log( data );
        res.end( data );
    });
};

exports.getShowById = function(req, res) {
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        var users = JSON.parse( data );
        var user = users["user"+req.params.id]
        console.log( user );
        res.end( JSON.stringify(user));
    });
};

exports.postAddUser = function(req, res) {
    var user = req.body;
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        data = JSON.parse( data );
        var size_data = parseInt(Object.keys(data).length)+1;
        data["user"+size_data] = user[0];
        console.log( user );
        res.end( JSON.stringify(data));
    });
};

exports.postAddMultiUser = function(req, res) {
    var users = req.body;
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        data = JSON.parse( data );
        var size_data = parseInt(Object.keys(data).length);
        var size_user = parseInt(Object.keys(users).length);
        for(var i=size_data+1; i<=size_data+size_user; i++){
            data["user"+i] = users[i-size_data-1];
        }
        console.log( data );
        res.end( JSON.stringify(data));
    });
};

exports.deleteUser = function(req, res) {
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        data = JSON.parse( data );
        delete data["user"+req.params.id];
        console.log( data );
        res.end( JSON.stringify(data));
    });
};

exports.showData = function (req, res) {
    db.test.find(function (err, docs) {
        console.log(docs);
        res.send(docs);
    });
};

exports.addData = function(req, res) {
    res.send("Team: CANET");
};
exports.editDataById = function(req, res) {
    res.send("Team: CANET");
};
exports.deleteDataById = function(req, res) {
    res.send("Team: CANET");
};
exports.receiveData = function(req, res) {
    res.send("Team: CANET");
};