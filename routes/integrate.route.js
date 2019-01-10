module.exports = function(app) {
    var integrate = require('../controllers/integrate.controller');

    // Hardware
    app.route('/get/cayenne')
        .post(integrate.getCayenne);

    // Intelligent Monitoring System
    app.route('/get/beacon')
        .post(integrate.getBeacon);
    app.route('/save/beacon')
        .post(integrate.saveBeacon);
    app.route('/show/beacon')
        .get(integrate.showBeacon);
    app.route('/delete/beacon')
        .delete(integrate.deleteBeacon);

    app.route('/show/csv')
        .get(integrate.showCsv);
    app.route('/show/csv')
        .get(integrate.showCsv);
    app.route('/get/hours/:X')
        .get(integrate.getHours);

};