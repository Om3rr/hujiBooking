var express = require('express');
var router = express.Router();
var dbAdapter = require('../dbAdapter.js');
var db = dbAdapter.db;

router.get('/',function (req, res) {
    let q = db.all("SELECT r_name, r_id, r_slots, r_start, r_end from rooms").then(function (row) {
        res.send(JSON.stringify(row));
    });
    q.catch(function (err) {
        console.log(err);
        res.status(400).send(err);
    })
});

module.exports = router;