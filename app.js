var express = require('express'),
    bodyParser = require('body-parser'),
    mongojs = require('./db');

var db = mongojs.connect;
var app = express();

app.use(bodyParser.json());

require('./models/temperature.model');
require('./routes/index.route')(app);
require('./routes/integrate.route')(app);

var port = process.env.PORT||3000;
app.listen(port);

setInterval(function(){
    var datetime = getDateTime().split(" ");
    var time = datetime[1].split(":");
    var min = time[1];
    var sec = time[2];
    var hr = time[0];
    if(hr == '00' && min=='00' && sec=='00'){ // Midnight hr == '00' && min=='00' && sec=='00'
        db.schedule.insert({
            date: datetime[0],
            times: ["0"]
        });
    }
    else if(min=='00' && sec=='00'){ // min=='00' && sec=='00'
        db.beaconData.find({
            "P-IN": 1
        }, function (err, docs) {
            var size = docs.length;
            db.schedule.find({
                date: datetime[0]
            }, function (err, docs) {
                var len_times = docs[0]['times'].length;
                var new_times = [size+""]; // [4]
                console.log(docs[0]['times']); // [4, 0]
                docs[0]['times'][len_times-1] = size+''; // [4, 4]
                docs[0]['times'].push(0+""); // [4, 4, 0]
                console.log(docs[0]['times']);

                db.schedule.update({
                    date: datetime[0]
                }, {
                    $set: {
                        times: docs[0]['times']
                    }
                }, function (err, docs) {

                    db.beaconData.remove({
                        "P-IN": 1
                    }, function (err, docs) {
                        console.log("Schedule Success !!");
                    })
                });
            });
        });
    }
}, 1000);


console.log("Server running at port:"+ port);

module.exports = app;

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


/*
var http = require("http");

http.createServer(function (req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write("Hello My World!");
    res.end();
}).listen(3000);

console.log("Server running...");
*/