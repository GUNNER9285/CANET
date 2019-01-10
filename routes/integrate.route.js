module.exports = function(app) {
    var integrate = require('../controllers/integrate.controller');

    app.route('/get/cayenne')
        .post(integrate.getCayenne);
    app.route('/get/beacon')
        .post(integrate.getBeacon);

};