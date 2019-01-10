var fs = require("fs"),
    mongojs = require('../db'),
    db = mongojs.connect,
    csv = require("fast-csv"),
    request = require('request');

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
    if(beacon['status'] == 'enter'){
        var datetime = beacon['datetime'].split(" "); // [0] = date, [1] = time
        console.log(datetime);
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
                if(hours[0] == "0"){
                    times[parseInt(datetime[1][1])] = "1";
                } else {
                    times[hours] = "1";
                }
                db.beaconData.insert({
                    date: datetime[0],
                    time: times
                }, function (err, docs) {
                    console.log(docs);
                    res.send(docs);
                });
            }
        });
    } else{
        res.send('You leave.');
    }
};

exports.showBeacon = function(req, res) {
    db.beaconData.find({}, function (err, docs) {
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

var data = [];
exports.showCsv = async function(req, res){
    data = [];
    await readCSV();
    var times = [];
    for(let i = 0; i < data.length; i++){
        var hours = data[i][0].split(";");
        var time = [];
        for(let j = 0; j < hours.length; j++){
            time.push(hours[j]);
        }
        times.push(time);
    }
    res.json(times);
};

async function readCSV() {
    return new Promise(function (resolve, reject) {
        csv
            .fromPath( __dirname + "/" + 'sanam.csv')
            .on("data", function (str) {
                data.push(str);
            })
            .on("end", function () {
                resolve(data);
            });
    });
}

exports.getHours = function (req, res) {
    db.beaconData.find({}, function (err, docs) {
        var present = getDateTime(Date.now());
        console.log(present);
    });
};

function getDateTime() {
    var date = new Date(Date.now());
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDay();
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = year + '-' + month + '-' + day + ' '
        + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}

var why = "";
exports.getRequest = async function (req, res) {
    await readCsv2();
    console.log(why);
};

async function readCsv2() {
    return new Promise(function (resolve, reject) {
        request({
            headers: {'content-type' : 'application/json'},
            url: 'http://202.139.192.79:3000/show/csv',
            method: 'GET'
        }, function(error, response, body){
            why = JSON.parse(body);
            resolve(why);
        });
    });
}