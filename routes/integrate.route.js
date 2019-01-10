module.exports = function(app) {
    var integrate = require('../controllers/integrate.controller');

    // Hardware
    app.route('/get/cayenne')
        .post(integrate.getCayenne);

    // Intelligent Monitoring System
    app.route('/get/beacon')
        .get(integrate.getBeacon);
    app.route('/save/beacon')
        .post(integrate.saveBeacon);
    app.route('/show/beacon')
        .get(integrate.showBeacon);
    app.route('/delete/beacon')
        .get(integrate.deleteBeaconById);

};