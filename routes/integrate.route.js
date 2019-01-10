module.exports = function(app) {
    var integrate = require('../controllers/integrate.controller');

    // Hardware
    app.route('/get/cayenne')
        .post(integrate.getCayenne);
    app.route('/save/cayenne')
        .post(integrate.saveCayenne);
    app.route('/show/cayenne')
        .get(integrate.showCayenne);

    // Intelligent Monitoring System
    app.route('/get/beacon')
        .post(integrate.getBeacon);
    app.route('/save/beacon')
        .post(integrate.saveBeacon);
    app.route('/readcount/beacon')
        .post(integrate.readCountBeacon);
    app.route('/show/beacon')
        .get(integrate.showBeacon);
    app.route('/delete/beacon')
        .delete(integrate.deleteBeacon);
    app.route('/count/beacon')
        .get(integrate.countBeacon);
    app.route('/delcount/beacon')
        .delete(integrate.delCountBeacon);
    app.route('/initcount/en')
        .get(integrate.initcountEN);
    app.route('/initcount/le')
        .get(integrate.initcountLE);

    app.route('/read/schedule')
        .get(integrate.readSchedule);
    app.route('/delete/schedule')
        .delete(integrate.deleteSchedule);
    app.route('/create/schedule/:id')
        .get(integrate.createSchedule);

    app.route('/show/csv')
        .get(integrate.showCsv);
    app.route('/get/hours/:X')
        .get(integrate.getHours);
    app.route('/get/request')
        .get(integrate.getRequest);

};

