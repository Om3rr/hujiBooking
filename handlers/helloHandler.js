var express = require('express');
var router = express.Router();
var dbAdapter = require('../dbAdapter.js');
var db = dbAdapter.db;

router.get('/',function (req, res) {
    var reg_code = req.cookies.userCode;
    db.all("SELECT * from users WHERE u_reg_code = ?", [reg_code]).then(function(results){
        if(!results){
            res.status(302).header({"Location": "/signup"});
            return;
        }
        var promises = [
            db.all("SELECT u_id, u_mail, u_fullname from collab JOIN users ON c_take = u_id WHERE c_give = ?",[results[0].u_id]),
            db.all("SELECT u_id, u_mail, u_fullname from collab JOIN users ON c_give = u_id WHERE c_take = ?",[results[0].u_id])
        ];
        Promise.all(promises).then(function(rows){
            res.status(200).send({take : rows[0], give : rows[1]});
        })
    })
});

module.exports = router;