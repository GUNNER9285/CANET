var fs = require("fs"),
    mongojs = require('../db'),
    db = mongojs.connect;

exports.getIndex = function(req, res) {
    var msg = "Team: CANET";
    res.send(msg);
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

exports.receiveData = function(req, res) {
    var payload = req.body['DevEUI_uplink']['payload_hex'];
    console.log(payload);
    var hexTeamID = 0;
    var TeamID = 0;
    var p1 = 2;
    var p2 = 3;
    var value = 0;
    if(payload[2] == '0' && payload[3] == '1'){
        p1 = p1+2;
        p2 = p2+2;
        hexTeamID = parseInt(payload[p1]+payload[p2]);
        TeamID = parseInt(hexTeamID, 16);
        console.log('TeamID: ',TeamID);
        p1 = p1+4;
        p2 = p2+4;
        var sensor = parseInt(payload[p1]+payload[p2]);
        if(sensor == 67){
            var tmp = payload[p1+2]+payload[p2+2]+payload[p1+4]+payload[p2+4];
            value = parseInt(tmp, 16)/10;
            console.log('Value: ',value);

            db.temperatures.insert({
                teamID: TeamID,
                temp: value
            }, function (err, docs) {
                console.log(docs);
                res.send(docs);
            });
        }
    }
};

exports.showData = function (req, res) {
    db.temperatures.find(function (err, docs) {
        console.log(docs);
        res.send(docs);
    });
};

exports.addData = function(req, res) {
    var value = req.body;
    db.temperatures.insert(value, function (err, docs) {
        console.log(docs);
        res.send(docs);
    });
};
exports.editDataById = function(req, res) {
    var id = parseInt(req.params.teamID);
    db.temperatures.update({
        teamID: id
    },{
        $set:{
            temp: req.body['temp']
        }
    }, function (err, docs) {
        if (docs != null) {
            console.log('found', JSON.stringify(docs));
            res.json(docs);
        } else {
            res.send('User not found');
        }
    });
};
exports.deleteDataById = function(req, res) {
    var id = parseInt(req.params.teamID);
    db.temperatures.remove({
        teamID: id
    }, function (err, docs) {
        console.log(docs);
        res.send(docs);
    });
};

exports.getCayenne = function(req, res) {
    var payload = req.body['DevEUI_uplink']['payload_hex'];
    console.log(payload);
};