var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require("fs");

var app = express();
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send("Team: CANET");
});

// show all users
app.get('/listUsers', function(req, res){
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        console.log( data );
        res.end( data );
    });
});

// show user by id
app.get('/showbyID/:id', function(req, res){
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        var users = JSON.parse( data );
        var user = users["user"+req.params.id]
        console.log( user );
        res.end( JSON.stringify(user));
    });
});

// add one user
/*
{
    "name" : "GUN",
    "password" : "passwordgun",
    "profession" : "student",
    "id": 5
}
*/
app.post('/addUser', function (req, res) {
    var user = req.body;
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        data = JSON.parse( data );
        var size_data = parseInt(Object.keys(data).length)+1;
        data["user"+size_data] = user[0];
        console.log( user );
        res.end( JSON.stringify(data));
    });
});

// add more user
/*
[
    {
        "name" : "GUN",
        "password" : "passwordgun",
        "profession" : "student"
    },
    {
        "name" : "NUG",
        "password" : "passwordnug",
        "profession" : "student"
    }
]
*/
app.post('/addMultiUser', function (req, res) {
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
});

// delete user
app.delete('/deleteUser/:id', function (req, res) {
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        data = JSON.parse( data );
        delete data["user"+req.params.id];
        console.log( data );
        res.end( JSON.stringify(data));
    });
})

var port = process.env.PORT||3000;
app.listen(port);
console.log("Server running at ", port);

module.exports = app;

/*
var http = require("http");

http.createServer(function (req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write("Hello My World!");
    res.end();
}).listen(3000);

console.log("Server running...");
*/