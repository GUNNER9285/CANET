
var mongojs = require('mongojs');

var databaseUrl = 'mongodb://localhost/tgr2019';
var collections = ['Temperature'];
var option =  {"auth":{"user":"gun", "password":"gun"}};
var connect = mongojs(databaseUrl, collections, option);

module.exports = {
    connect: connect
};
