module.exports = function(app) {
    var integrate = require('../controllers/integrate.controller');

    app.route('/get/cayenne')
        .post(integrate.getCayenne);

};