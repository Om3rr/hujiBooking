var express = require('express');
var router = express.Router();
var dbAdapter = require('../dbAdapter.js');
var db = dbAdapter.db;

router.get('/',function (req, res) {
    var userName = req.query['username'];
    db.all("SELECT * from collab WHERE c_give = ? OR c_take = ?", [userName]).then(function (rows) {
        var friends = rows.map(function (row) {
            return row.c_give === userName ? row.c_take : null
        }).filter(function (l) {
            return l !== null
        });
        var collabs = rows.map(function (row) {
            return row.c_take === userName ? row.c_give : null
        }).filter(function (l) {
            return l !== null
        });
        res.send({friends: friends, collabs: collabs});
    }).catch(function (err) {
        console.log(err);
    });
});

module.exports = router;