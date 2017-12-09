var express = require('express');
var router = express.Router();
var dbAdapter = require('../dbAdapter.js');
var db = dbAdapter.db;

router.use('/', function(req,res,next){
    if(!req.cookies){
        next();
    }
    if(!req.cookies.userCode){
        next();
    }
    db.all("SELECT u_id, u_fullname, u_mail from users where u_reg_code = ?", [req.cookies.userCode]).then(function(results){
        req.userData = {};
        if(results.length > 0){
            req.userData = results[0];
            next();
        } else {
            next();
        }
    })
});

module.exports = router;