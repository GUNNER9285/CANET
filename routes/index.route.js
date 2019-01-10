module.exports = function(app) {
    var index = require('../controllers/index.controller');

    app.route('/')
        .get(index.getIndex);

    // show all users
    app.route('/listUsers')
        .get(index.getListUsers);

    // show user by id
    app.route('/showbyID/:id')
        .get(index.getShowById);

    // add one user
    /*
    {
        "name" : "GUN",
        "password" : "passwordgun",
        "profession" : "student",
        "id": 5
    }
    */
    app.route('/addUser')
        .post(index.postAddUser);

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
    app.route('/addMultiUser')
        .post(index.postAddMultiUser);

    // delete user
    app.route('/deleteUser/:id')
        .delete(index.deleteUser);

    app.route('/receiveData')
        .post(index.receiveData);
    app.route('/showData')
        .get(index.showData);
    app.route('/addData')
        .post(index.addData);
    app.route('/editData/:teamID')
        .put(index.editDataById);
    app.route('/deleteData/:teamID')
        .delete(index.deleteDataById);

    app.route('/get/cayenne')
        .get(index.getCayenne);

};