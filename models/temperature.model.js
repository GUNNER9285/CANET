var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TemperatureShema = new Schema({
    latitude: {
        type: Number,
        require: true
    },
    longitude: {
        type: Number,
        require: true
    },
    label: {
        type: Number,
        require: true
    }
});

mongoose.model('Temperature', TemperatureShema);
