var express = require('express');
var router = express.Router();
var dbAdapter = require('../dbAdapter.js');
var db = dbAdapter.db;
var mailer = require('../common/mailer');
var hasher = require('../common/passHasher').hash;

router.post('/login', function(req,res){
   var uName = req.body['user'];
   var uPass = hasher(req.body['pass']);
   db.all("SELECT u_reg_code, u_pass FROM users WHERE u_active = 1 AND u_mail LIKE ?", [uName]).then(function(results){
       if(results.length === 0){
           sendError(res, '', 'Cant find this user..');
           return;
       }
       if(results[0].u_pass === uPass){
           insertCookie(results[0].u_reg_code, res);
       } else {
           sendError(res, '', 'Wrong password')
       }
   }).catch(function(err){
       console.log("LOGIN: "+err);
       sendError(res, '', 'Bad login thing, cannot query..');
   })
});

router.get('/:confirmCode', function (req, res) {
    var code = req.params['confirmCode'];
    db.all('SELECT u_id, u_active FROM users where u_reg_code = ?',[code]).then(function(resp){
        if(resp.length === 0){
            redirect(res,'','');
            return;
        } else if(resp[0].u_active === 1){
            insertCookie(code, res);
            return;
        }
        db.run("UPDATE users SET u_active = 1 WHERE u_id = ?",[resp[0].u_id]).then(function(_r){
            insertCookie(code, res);
        })
    });
});

function userValidator(user){
    if(user.name == null){
        return false;
    }
    if(user.user == null){
        return false;
    }
    if(user.pass == null){
        return false;
    }
    if(!new RegExp('^[A-Za-z]+ [A-Za-z]+$').exec(user.name)){
        return false;
    }
    if(!new RegExp('^[A-Za-z0-9_\\-\\.\\,]+$').exec(user.user)){
        return false;
    }
    if(!new RegExp('^[A-Za-z0-9_\\-\\.\\,]{6}[A-Za-z0-9_\\-\\.\\,]*$').exec(user.pass)){
        return false;
    }

    return true;
}

router.post('/register', function(req,res){
    var userDetails = req.body;
    if(!userValidator(userDetails)){
        sendError(res,'', "Bad Params");
        return;
    }
    var confirmCode = mailer.getUid();
    var mail = userDetails.user+"@cs.huji.ac.il"; //only cs users are allowed.
    var hashedPass = hasher(userDetails.pass);
    db.all("SELECT u_id, u_reg_code FROM users WHERE u_mail = ? and u_active = 0",[mail]).then(function(results){
        if(results.length === 0){
            db.run("INSERT INTO users(`u_mail`, `u_reg_code`, `u_fullname`, `u_active`, `u_pass`) VALUES(?, ?, ?, ?, ?)", [userDetails.user, confirmCode, userDetails.name, 0, hashedPass]).then(function(results){
                mailer.send(mail, confirmCode);
                res.header({"Location" : "/"}).status(302).send();
            })
        } else {
            db.run("UPDATE users SET u_fullname = ?, u_pass = ? WHERE u_id = ?", [userDetails.name, hashedPass, results.u_id]);
            mailer.send(mail, results[0].u_reg_code);
            sendError(res, '', 'Confirmation mail sent');
        }
    }).catch(function(err){
        console.log("REGISTER: "+err);
        sendError(res, '', 'Something went wrong.. please tell Omer about this :D');
    });
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

function insertCookie(regCode, res){
    res.cookie("userCode", regCode).status(302).header({'Location' : '/'}).send();
}

function sendError(res,params,text){
    res.status(400).send(text);
}

function redirect(res, params, text){
    res.status(302).header({'Location' : '/signin'}).send();
}


module.exports = router;