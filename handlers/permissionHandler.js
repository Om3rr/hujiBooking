var express = require('express');
var router = express.Router();
var dbAdapter = require('../dbAdapter.js');
var db = dbAdapter.db;

router.use('/', function(req,res,next){
    if(req.userData && req.userData.u_active === 1){
        next();
    } else {
        res.status(302).header({"Location" : "/signin"}).send();
    }
});

module.exports = router;