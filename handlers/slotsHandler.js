var express = require('express');
var router = express.Router();
var dbAdapter = require('../dbAdapter.js');
var db = dbAdapter.db;
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
});

router.get('/',function (req, res) {
    console.log(req.query);
    var date = req.query.date ? req.query.date : 'now, local';
    var q = db.all("SELECT * from books JOIN rooms ON b_room_id = r_id " +
        "WHERE " +
        "date(b_date) = date(?)", [date]);
    q.then(function (rows) {
        var groups = {};
        rows.forEach(function (row) {
            if (!groups[row.r_name]) {
                groups[row.r_name] = [];
            }
            groups[row.r_name][row.b_slot] = row;
        });
        res.send(JSON.stringify(groups));
    });
    q.catch(function (err) {
        res.status(400).send(err);
    });
});

module.exports = router;
