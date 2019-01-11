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
    var Timestamp = getDateTime();
    console.log("Timestamp: ", Timestamp);
    console.log("Payload_Hex: ", payload);
    var next = 0;
    while (true){
        if(pt == payload.length-1 || pt == payload.length-2
            || pt == payload.length-3 || pt == payload.length-4
            || pt >= payload.length){
            break;
        }
        pt = pt + 2;
        if(payload[pt] == '6' && payload[pt+1] == '7'){
            var hex = payload[pt+2]+payload[pt+3]+payload[pt+4]+payload[pt+5];
            console.log('temp: ',hex);
            temp = parseInt(hex, 16)/10;
            pt = pt+6;
        }
        else if(payload[pt] == '6' && payload[pt+1] == '8'){
            var hex = payload[pt+2]+payload[pt+3];
            console.log('humi: ',hex);
            humi = parseInt(hex, 16)/2;
            pt = pt+4;
        }
        else if(payload[pt] == '0' && payload[pt+1 == '1'] && next == 0){
            var hex = payload[pt+2]+payload[pt+3];
            console.log('pIn: ',hex);
            pIn = parseInt(hex, 16);
            pt = pt+2;
            next = 1;
        }
        else if(payload[pt] == '0' && payload[pt+1 == '1']){
            var hex = payload[pt+2]+payload[pt+3];
            console.log('pOut: ',hex);
            pOut = parseInt(hex, 16);
            pt = pt+2;
        }
    }
    var json = {
        "Temperature": temp,
        "Humidity": humi,
        "P-IN": pIn,
        "P-OUT": pOut,
        "Timestamp": Timestamp
    };
    console.log(json);

    db.sensorData.insert(json, function (err, docs) {
        res.send(docs)
    })
};
exports.showCayenne = function(req, res){
    db.sensorData.find({},  function (err, docs) {
        res.json(docs);
    });
};

exports.getBeacon = function(req, res) {
    var beacon = req.body;
    console.log(beacon);
};
exports.saveBeacon = function(req, res) {
    var beacon = req.body['beacon'];
    var datetime = beacon['datetime'];
    console.log(beacon);
    if(beacon['status'] == 'enter'){
        db.beaconData.insert({
            "P-IN": 1,
            "P-OUT": 0,
            Timestamp: datetime
        }, function (err, docs) {
            db.beaconCount.find({"status": "enter"}, function (err, docs) {
                var count = parseInt(docs[0]["COUNT-IN"]);
                count++;
                db.beaconCount.update({
                    "status": "enter"
                },{
                    $set: {
                        "COUNT-IN": count
                    }
                }, async function (err, docs) {
                    await getEnter();
                    await getLeave();
                    var json = {
                        "enter": p_in,
                        "leave": p_out
                    };
                    res.json(json);
                });
            })
        });
    }
    else{
        db.beaconData.insert({
            "P-IN": 0,
            "P-OUT": 1,
            Timestamp: datetime
        }, function (err, docs) {
            db.beaconCount.find({"status": "leave"}, function (err, docs) {
                var count = parseInt(docs[1]["COUNT-OUT"]);
                count++;
                db.beaconCount.update({
                    "status": "leave"
                },{
                    $set: {
                        "COUNT-OUT": count
                    }
                }, async function (err, docs) {
                    await getEnter();
                    await getLeave();
                    var json = {
                        "enter": p_in,
                        "leave": p_out
                    };
                    res.json(json);
                });
            })
        });
    }
};
exports.initcountEN = function(req, res){
    db.beaconCount.insert({
        "COUNT-IN": 0,
        "status": "enter"
    }, function (err, docs) {
        res.send(docs);
    });
};
exports.initcountLE = function(req, res){
    db.beaconCount.insert({
        "COUNT-OUT": 0,
        "status": "leave"
    }, function (err, docs) {
        res.send(docs);
    });
};

exports.countBeacon = function(req, res){
    db.beaconCount.find({}, function (err, docs) {
        res.send(docs);
    });
};
exports.delCountBeacon = function(req, res){
    db.beaconData.remove({"date": "2019-1-4"}, function (err, docs) {
        res.send(docs);
    });
};

exports.getHours = function (req, res) {
    db.schedule.find({}, function (err, docs) {
        var times = [];
        for (var i in docs){
            for (let j=0; j<docs[i]['times'].length; j++){
                times.push(docs[i]['times'][j]);
            }
        }
        var tourist = [];
        var len_times = times.length;
        var len = req.params.X;
        if(len <= 0 || len > len_times){
            res.send("Error");
        }
        else{
            for (let i=0; i<len; i++){
                tourist.push(times.pop())
            }
            var json = {
                "number_of_tourist": tourist.reverse()
            }
            res.json(json);
        }
    });
};

function getDateTime() {
    var date = new Date(Date.now());
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = year + '-' + month + '-' + day + ' '
        + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}

var p_in = 0;
var p_out = 0;
exports.readCountBeacon = async function(req, res) {
    db.beaconData.find({}, function (err, docs) {
        res.send(docs);
    })
};
async function getEnter(){
    return new Promise(function (resolve, reject) {
        db.beaconCount.find({
            "status": "enter"
        }, function (err, docs) {
            p_in = docs[0]['COUNT-IN'];
            resolve(p_in);
        });
    });
}
async function getLeave(){
    return new Promise(function (resolve, reject) {
        db.beaconCount.find({
            "status": "leave"
        }, function (err, docs) {
            p_out = docs[0]['COUNT-OUT'];
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

exports.readSchedule = function (req, res) {
    db.schedule.find({}, function (err, docs) {
        res.send(docs);
    });
};
exports.deleteSchedule = function (req, res) {
    db.schedule.remove({}, function (err, docs) {
        res.send(docs);
    });
};
exports.createSchedule = function (req, res) {
    var tmp = ["0"];
    var id = req.params.id;
    for(let i=1; i<id-1; i++){
        tmp.push("0");
    }
    db.schedule.insert({
        date: '2019-1-11',
        times: tmp
    }, function (err, docs) {
        res.send(docs);
    });
};
exports.addSchedule = function (req, res) {
    db.schedule.find({
        date: '2019-1-11'
    }, function (err, docs) {
        var times = docs[0]['times'];
        times.push("0");
        db.schedule.update({
            date: '2019-1-11'
        },{
            $set: {
                times: times
            }
        }, function (err, docs) {
            res.send(docs);
        });
    });
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