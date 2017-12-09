var express = require('express');
var router = express.Router();
var dbAdapter = require('../dbAdapter.js');
var db = dbAdapter.db;


router.post('/delete/:uid',function (req, res, next) {
    var friendsId = req.params['uid'];
    var me = req.userData;
    db.run('DELETE FROM collab WHERE c_take = ? AND c_give = ?', [friendsId, me.u_id]).then(function (row) {
        res.status(200).send("All good :D");
    }).catch(function(){
        res.status(400).send("Cannot delete friend..");
    });
});

router.post('/',function (req, res, next) {
    var friendsName = req.body.friend;
    db.all("SELECT u_id, u_fullname, u_mail FROM users WHERE u_mail = ? and u_active = 1",[friendsName]).then(function(results){
        if(results.length === 0 || results[0].u_id === req.userData.u_id){
            res.status(400).send("Cannot add new friend..");
            return;
        }
        db.run('INSERT INTO `collab` (c_give, c_take) VALUES(?, ?)', [req.userData.u_id, results[0].u_id]).then(function (row) {
            res.status(200).send(results[0]);
        }).catch(function (err) {
            res.status(400).send("Cannot add new friend..");
        });
    })

});

module.exports = router;