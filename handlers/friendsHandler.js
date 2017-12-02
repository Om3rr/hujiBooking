var express = require('express');
var router = express.Router();
var dbAdapter = require('../dbAdapter.js');
var db = dbAdapter.db;


router.delete('/',function (req, res) {
    var friendsName = req.body.friend;
    var me = req.body.me;
    db.run('DELETE FROM collab WHERE c_take = ? AND c_give = ?', [friendsName, me]).then(function (row) {
        res.status(200).send("All good :D");
    });
});

router.post('/',function (req, res) {
    var friendsName = req.body.friend;
    var me = req.body.me;
    db.run('INSERT INTO `collab` (c_give, c_take) VALUES(?, ?)', [me, friendsName]).then(function (row) {
        res.status(200).send("All good :D");
    }).catch(function (err) {
        res.status(400).send("Cannot add new friend..");
    });
});

module.exports = router;