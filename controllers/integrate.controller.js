var fs = require("fs"),
    mongojs = require('../db'),
    db = mongojs.connect;

exports.getCayenne = function(req, res) {
    res.send(req.body);
};