var express = require('express');
var router = express.Router();



router.get('/', function(req,res){
    res.render("signup.ejs", {page : 'signupform'})
});

module.exports = router;