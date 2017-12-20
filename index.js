var express = require('express');
var constants = require('./constants.js');
var dbAdapter = require('./dbAdapter.js');
var slotsHandler = require('./handlers/slotsHandler');
var helloHandler = require('./handlers/helloHandler');
var roomsHandler = require('./handlers/roomsHandler');
var confirmHandler = require('./handlers/confirmHandler');
var friendsHandler = require('./handlers/friendsHandler');
var signupHandler = require('./handlers/signUpHandler');
var userHandler = require('./handlers/userHandler');
var forgetHandler = require('./handlers/forgetHandler');
var permissionHandler = require('./handlers/permissionHandler');
var mailer = require('./common/mailer');
var app = express();
var db = dbAdapter.db;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var helmet = require('helmet');
var cookieSession = require('cookie-session');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(cookieParser());
app.set('port', (process.env.PORT || 5000));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');
app.use(helmet());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.get("/riddle", function(req,res){
    res.send("hello, im your clue.")
});
app.use(userHandler);
app.use('/signin', signupHandler);
app.use('/confirm', confirmHandler);
app.use('/forget', forgetHandler);
app.use(permissionHandler);
app.use('/friends', friendsHandler);
app.use('/slots', slotsHandler);
app.use('/hello', helloHandler);
app.use('/rooms', roomsHandler);
app.get('/', function (request, response) {
    response.render("index.ejs", {page : 'main.ejs', controller : 'tableCtrl'})
});


app.listen(app.get('port'), function () {
    console.log("Node app is running at localhost:" + app.get('port'))
});
