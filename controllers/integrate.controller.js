var fs = require("fs"),
    mongojs = require('../db'),
    db = mongojs.connect;

exports.getCayenne = function(req, res) {
    var payload = req.body;
    console.log(payload);
};

exports.getBeacon = function(req, res) {
    var beacon = req.body;
    console.log(beacon);
};