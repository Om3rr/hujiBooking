var express = require('express');
var router = express.Router();
var dbAdapter = require('../dbAdapter.js');
var dateHelper = require('../common/dateHelper');
var db = dbAdapter.db;
var constants = require('../constants');
module.exports = {};

function checkUserUsage(uId, date){
    return new Promise(function(res,rej){
        db.all("SELECT COUNT(*) FROM books JOIN user_books u ON b_id = u.b_id WHERE u_id = ? AND b", [uId])
    })
}


router.post('/',function post(req,res){
    var slot = req.body.slot;
    var date = req.body.date;
    var room = req.body.room;
    var users = req.body.users;
    if (slot == null || date == null || room == null || users.length < constants.USERS_LIMIT_PER_ROOM) {
        res.status(404);
        res.send("?");
        return;
    }
    slotValidator(date,slot,room,users,req.userData);

});

function slotIsFree(date,slot,room){
    return new Promise(function (res,err) {
        db.all("SELECT 1 FROM books WHERE b_date = ? AND b_room_id = ? AND b_slot = ?", [date, room, slot]).then(function(resp){
            if(resp.length===0){
                res()
            } else{
                err()
            }
        })
    })
}

function isUsersCollab(take, give){
    return new Promise(function (res,err) {
        db.all("SELECT 1 from collab where c_give = ? AND c_take = ?", [give, take]).then(function(resp){
            if(resp.length === 0){
                console.log("Collab reject");
                err()
            } else{
                res()
            }
        })
    })
}

function isUserEligable(userId){
    return new Promise(function (res,err) {
        db.all("SELECT c FROM userbookingcounts WHERE id = ?", [userId]).then(function(resp){
            if(resp.length===0){
                err()
            } else{
                if(resp[0].c >= constants.HOURS_LIMIT_PER_USER){
                    err()
                } else{
                    res()
                }
            }
        })
    })
}

function insertNewSlot(date,slot,room,users,me){
    return new Promise(function(r,s){
        db.all("INSERT INTO books (b_room_id, b_date, b_slot, b_created) VALUES(?, ?, ?, NOW())",[room, date, slot]).then(function(resp){
            var promises = [];
            users.forEach(function(u){
                promises.push(db.all("INSERT INTO user_books (u_id, b_id) VALUES (?, ?)",[u.u_id, resp.insertId]));
            });
            promises.push(db.all("INSERT INTO user_books (u_id, b_id) VALUES (?, ?)",[me.u_id, resp.insertId]));
            Promise.all(promises).then(r).catch(s)
        }).catch(s);
    })
}

function slotValidator(date,slot,room,users,me){
    var promises = [];
    promises.push(slotIsFree(date,slot,room));
    users.forEach(function(u){
        promises.push(isUserEligable(u.u_id));
        promises.push(isUsersCollab(me.u_id, u.u_id));
    });
    Promise.all(promises).then(function(){
        insertNewSlot(date,slot,room,users,me).then(function(resp){
            console.log(resp)
        });
    })
}

function verifyUserAndQuery(u, myParams){
    if(!u){
        return false;
    }
    if(!u.u_id){
        return false;
    }
    return db.all("SELECT 1 from collab where c_give = ? AND c_take = ?", [u.u_id, myParams.u_id]);
}

function getUserOrdersCount(u, date){
    var sunday = dateHelper.getSunday(date);
    return db.all("SELECT count(*) c from books b JOIN user_books u ON b.b_id = u.b_id where u_id = ? and date(b_date) >= date(?)", [u.u_id, sunday]);
}
router.get('/',function (req, res) {
    var date = req.query.date ? req.query.date : 'now, local';
    var q = db.all("SELECT * from orders " +
        "WHERE " +
        "date(b_date) = date(?)", [date]);
    q.then(function (rows) {
        var groups = {};
        rows.forEach(function (row) {
            row.users = row.users.split(",");
            row.users_ids = row.users_ids.split(",");
            if (!groups[row.room_name]) {
                groups[row.room_name] = [];
            }
            groups[row.room_name][row.b_slot] = row;
        });
        res.send(groups);
    });
    q.catch(function (err) {
        res.status(400).send(err);
    });
});

module.exports = router;
