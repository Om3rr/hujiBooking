var express = require('express');
var router = express.Router();
var dbAdapter = require('../dbAdapter.js');
var db = dbAdapter.db;
var mailer = require('../common/mailer');
var hasher = require('../common/passHasher').hash;


// send mail with forget link
router.post('/:user', function(req,res){
    var user = req.params['user'] ;
    db.all("SELECT u_reg_code FROM users WHERE u_mail = ? AND u_active = 1",[user]).then(function(result){
        if(result.length === 0){
            res.status(400).send();
            return;
        }
        var userMail = user+"@cs.huji.ac.il";
        mailer.forget(userMail, result[0].u_reg_code);
        res.status(200).send();
    })
});

router.get('/reset/:regcode', function(req,res){
    var regCode = req.params["regcode"];
    res.cookie("userCode", regCode);
    res.render('signup.ejs',{page : 'forget.ejs'});
});


function verifyPassword(pass){
    if(pass == null){
        return false;
    }
    if(!new RegExp('^[A-Za-z0-9_\\-\\.\\,]{6}[A-Za-z0-9_\\-\\.\\,]*$').exec(pass)){
        return false;
    }
    return true;
}
// if the user have cookie he would be able to change his password.
router.post('/', function(req,res){
    if(!req.userData){
        redirect(res, '', 'Invalid Page');
        return;
    }
    var pass = req.body.password;
    if(!verifyPassword(pass)){
        redirect(res, '', 'Bad password');
        return;
    }
    var hashedPass = hasher(pass);
    db.all("UPDATE users SET u_pass = ? WHERE u_id = ?", [hashedPass, req.userData.u_id]).then(function(rows){
        res.status(302).header({'Location' : '/'}).send();
    }).catch(function(err){
        console.log("Forget: "+err);
        res.status(400)
    })
});

module.exports = router;