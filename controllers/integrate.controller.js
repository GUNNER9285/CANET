var fs = require("fs"),
    mongojs = require('../db'),
    db = mongojs.connect,
    csv = require("fast-csv"),
    request = require('request');

exports.getCayenne = function(req, res) {
    var payload = req.body;
    console.log(payload);
};

exports.saveCayenne = function(req, res) {
    var payload = req.body['DevEUI_uplink']['payload_hex'];
    var pt = 0;
    var temp = 0;
    var humi = 0;
    var pIn = 0;
    var pOut = 0;
    while (true){
        if(pt == payload.length-1 || pt == payload.length-2
            || pt == payload.length-3 || pt == payload.length-4
            || pt == payload.length-5){
            break;
        }
        pt = pt + 2;
        if(pt == '6' && pt+1 == '7'){
            var hex = payload[pt+2]+payload[pt+3]+payload[pt+4]+payload[pt+5];
            temp = parseInt(hex, 16)/10;
            pt = pt+6;
        }
        else if(pt == '6' && pt+1 == '8'){
            var hex = payload[pt+2]+payload[pt+3]+payload[pt+4]+payload[pt+5];
            humi = parseInt(hex, 16)/10;
            pt = pt+6;
        }
    }
};

exports.getBeacon = function(req, res) {
    var beacon = req.body;
    console.log(beacon);
};

var p_in = 0;
var p_out = 0;

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
                },async function (err, docs) {
                    if (docs != null) {
                        await getEnter(datetime);
                        await getLeave(datetime);
                        var result = {
                            datetime: beacon['datetime'],
                            enter: p_in,
                            leave: p_out
                        };
                        res.json(result);
                    } else {
                        res.send('Beacon Data Not Found !');
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
                }, async function (err, docs) {
                    if (docs != null) {
                        await getEnter(datetime);
                        await getLeave(datetime);
                        var result = {
                            datetime: beacon['datetime'],
                            enter: p_in,
                            leave: p_out
                        };
                        res.json(result);
                    } else {
                        res.send('Beacon Data Not Found !');
                    }
                });
            }
        });
    } else{
        var datetime = beacon['datetime'].split(" "); // [0] = date, [1] = time
        console.log(datetime);
        db.beaconData2.find({
            date: datetime[0]
        }, function (err, docs) {
            if (docs.length != 0) {
                console.log('found');
                var hours = parseInt(datetime[1][0]+datetime[1][1]);
                console.log(hours);
                var times = docs[0]['time'];
                times[hours] = (parseInt(times[hours]) + 1) + '';
                db.beaconData2.update({
                    date: datetime[0]
                },{
                    $set:{
                        time: times
                    }
                }, async function (err, docs) {
                    if (docs != null) {
                        await getEnter(datetime);
                        await getLeave(datetime);
                        var result = {
                            datetime: beacon['datetime'],
                            enter: p_in,
                            leave: p_out
                        };
                        res.json(result);
                    } else {
                        res.send('Beacon Data Not Found !');
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
                db.beaconData2.insert({
                    date: datetime[0],
                    time: times
                }, async function (err, docs) {
                    if (docs != null) {
                        await getEnter(datetime);
                        await getLeave(datetime);
                        var result = {
                            datetime: beacon['datetime'],
                            enter: p_in,
                            leave: p_out
                        };
                        res.json(result);
                    } else {
                        res.send('Beacon Data Not Found !');
                    }
                });
            }
        });

    }
};

async function getEnter(datetime){
    return new Promise(function (resolve, reject) {
        db.beaconData.find({
            date: datetime[0]
        }, function (err, docs) {
            var hour = parseInt(datetime[1][0]+datetime[1][1]);
            p_in = docs[0]['time'][hour];
            resolve(p_in);
        });
    });
}
async function getLeave(datetime){
    return new Promise(function (resolve, reject) {
        db.beaconData2.find({
            date: datetime[0]
        }, function (err, docs) {
            var hour = parseInt(datetime[1][0]+datetime[1][1]);
            p_out = docs[0]['time'][hour];
            resolve(p_out);
        });
    });
}

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
        var date = present.split(" ");
        var day = 0;
        if(date[0][date[0].length-2] == "-"){
            day = parseInt(date[0][date[0].length-1]);
        }
        else{
            day = parseInt(date[0][date[0].length-2]+date[0][date[0].length-1]);
        }
        var hour = 0;
        if(date[1][0] == "0"){
            hour = parseInt(date[1][1]);
        } else {
            hour = parseInt(date[1][0]+date[1][1]);
        }
        var x = req.params.X;
        res.send(x);

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

exports.initBeacon = function (req, res) {
    console.log("init beacon...");
};

// Test Async
var raw = "";
exports.getRequest = async function (req, res) {
    await readCsv2();
    console.log(raw);
};

async function readCsv2() {
    return new Promise(function (resolve, reject) {
        request({
            headers: {'content-type' : 'application/json'},
            url: 'http://202.139.192.79:3000/show/csv',
            method: 'GET'
        }, function(error, response, body){
            raw = JSON.parse(body);
            resolve(raw);
        });
    });
}