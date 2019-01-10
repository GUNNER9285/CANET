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

exports.saveBeacon = function(req, res) {
    var beacon = req.body['beacon'];
    console.log(beacon);
    var datetime = beacon['datetime'].split(" "); // [0] = date, [1] = time
    var find = "";
    db.beaconData.find({
        date: datetime[0]
    }, function (err, docs) {
        if (docs.length != 0) {
            console.log('found');
            var hours = parseInt(datetime[1][0]+datetime[1][1]);
            console.log(hours);
            var times = docs[0]['time'];
            times[hours] = (parseInt(times[hours]) + 1) + '';
            db.beaconData.update({
                date: datetime[0]
            },{
                $set:{
                    time: times
                }
            }, function (err, docs) {
                if (docs != null) {
                    console.log('found', JSON.stringify(docs));
                    res.json(docs);
                } else {
                    res.send('User not found');
                }
            });
        } else {
            console.log('beaconData not found');
            var hours = parseInt(datetime[1][0]+datetime[1][1]);
            var times = ["0","0","0","0","0","0",
                        "0","0","0","0","0","0",
                        "0","0","0","0","0","0",
                        "0","0","0","0","0","0"];
            times[hours] = "1";
            db.beaconData.insert({
                date: datetime[0],
                time: times
            }, function (err, docs) {
                console.log(docs);
                res.send(docs);
            });
        }
    });
};

exports.showBeacon = function(req, res) {
    db.beaconData.find(function (err, docs) {
        console.log(docs);
        res.send(docs);
    });
};

exports.deleteBeacon = function(req, res) {
    db.beaconData.remove({}, function (err, docs) {
        console.log(docs);
        res.send(docs);
    });
};