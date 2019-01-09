var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TemperatureShema = new Schema({
    teapID: {
        type: Number
    },
    temp: {
        type: Number
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Temperature', TemperatureShema);
