var express = require('express');
var router = express.Router();



router.get('/', function(req,res, next){
    if(req.userData){
        next();
    }
    res.render("signup.ejs", {page : 'signupform'})
});

module.exports = router;