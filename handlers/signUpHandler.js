var express = require('express');
var router = express.Router();



router.get('/', function(req,res, next){
    if(req.userData){
        next();
    }
    res.render("index.ejs", {page : 'signupform', controller : 'loginCtrl'})
});

module.exports = router;