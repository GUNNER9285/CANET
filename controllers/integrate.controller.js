var fs = require("fs"),
    mongojs = require('../db'),
    db = mongojs.connect;

exports.getCayenne = function(req, res) {
    var payload = req.body;
    console.log(payload);
};