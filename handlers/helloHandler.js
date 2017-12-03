var express = require('express');
var router = express.Router();
var dbAdapter = require('../dbAdapter.js');
var constants = require('../constants');
var db = dbAdapter.db;

router.get('/',function (req, res) {
    var promises = [
        db.all("SELECT u_id, u_mail, u_fullname from collab JOIN users ON c_take = u_id WHERE c_give = ?",[req.userData.u_id]),
        db.all("SELECT u_id, u_mail, u_fullname, ? - cc.c orders from collab JOIN users ON c_give = u_id JOIN userbookingcounts cc ON u_id = id WHERE c_take = ?",[constants.HOURS_LIMIT_PER_USER, req.userData.u_id])
    ];
    Promise.all(promises).then(function(rows){
        res.status(200).send({take : rows[0], give : rows[1]});
    })
});

function redirectToLogin(res){
    res.status(302).header({"Location": "/signup"});
}

module.exports = router;