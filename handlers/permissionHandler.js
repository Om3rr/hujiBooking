var express = require('express');
var router = express.Router();
var dbAdapter = require('../dbAdapter.js');
var db = dbAdapter.db;

router.use('/', function(req,res,next){
    if(req.userData){
        next();
    } else {
        console.log("Redirect");
        res.status(302).header({"Location" : "/signin"}).send();
    }
});

module.exports = router;