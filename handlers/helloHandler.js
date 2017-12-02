var express = require('express');
var router = express.Router();
var dbAdapter = require('../dbAdapter.js');
var db = dbAdapter.db;

router.get('/',function (req, res) {
    var promises = [
        db.all("SELECT u_id, u_mail, u_fullname from collab JOIN users ON c_take = u_id WHERE c_give = ?",[req.userData.u_id]),
        db.all("SELECT u_id, u_mail, u_fullname from collab JOIN users ON c_give = u_id WHERE c_take = ?",[req.userData.u_id])
    ];
    Promise.all(promises).then(function(rows){
        res.status(200).send({take : rows[0], give : rows[1]});
    })
});

function redirectToLogin(res){
    res.status(302).header({"Location": "/signup"});
}

module.exports = router;