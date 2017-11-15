var express = require('express');
var constants = require('./constants.js');
var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('tablesDb');
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.set('port', (process.env.PORT || 5000));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

db.on("error", function(error) {
    console.log("Getting an error : ", error);
});

app.get('/', function (request, response) {
    response.render("index.ejs")
});

app.get('/rooms', function (req, res) {
    db.all("SELECT r_name, r_id, r_slots, r_start, r_end from rooms", function (err, row) {
        if (err) {
            res.send("Hello world");
            return;
        }
        res.send(JSON.stringify(row));
    })
});

app.get('/slots', function(req,res){
    console.log(req.query);
    var date = req.query.date? req.query.date : 'now, local';
    db.all("SELECT * from books JOIN rooms ON b_room_id = r_id " +
        "WHERE " +
        "date(b_date) = date(?)", [date], function (err, rows) {
        if (err) {
            console.error(err);
            res.status(500);
            res.send("Hello world");
            return;
        }
        var groups = {};
        rows.forEach(function(row){
            if(!groups[row.r_name]){
                groups[row.r_name] = [];
            }
            groups[row.r_name][row.b_slot] = row;
        });
        res.send(JSON.stringify(groups));
    })
});


app.post('/slot',function(req,res){
    console.log(req.body);
   var slot = req.body.slot;
   var date = req.body.date;
   var room = req.body.room;
   var user = req.body.user;
   if(slot == null  || date == null || room == null){
       res.status(404);
       res.send("?");
       return;
   }

   db.all("SELECT count(*) c FROM books WHERE b_user = ? AND CAST(b_date AS INT) >= CAST(date(?, 'weekday 0') AS INT) AND CAST(b_date AS INT) <= CAST(date(?, 'weekday 6') AS INT)", [user, date, date], function(err,rows){
       if(err){
           console.log(err);
       }
       if(!rows){
           return;
       }
       console.log(rows);
       if(rows[0].c < constants.HOURS_LIMIT_PER_USER){
           db.run("INSERT INTO books('b_room_id', 'b_user', 'b_date', 'b_slot') VALUES (?, ?, date(?), ?)",[room, user, date, slot], function(){
               res.status(200).send();
           });
       } else {
           res.status(404);
           res.send("?");
       }
   })

});


app.listen(app.get('port'), function () {
    console.log("Node app is running at localhost:" + app.get('port'))
});
