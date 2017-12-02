var express = require('express');
var constants = require('./constants.js');
var dbAdapter = require('./dbAdapter.js');
var slotsHandler = require('./handlers/slotsHandler');
var helloHandler = require('./handlers/helloHandler');
var roomsHandler = require('./handlers/roomsHandler');
var confirmHandler = require('./handlers/confirmHandler');
var friendsHandler = require('./handlers/friendsHandler');
var signupHandler = require('./handlers/signUpHandler');
var mailer = require('./common/mailer');
var app = express();
var db = dbAdapter.db;
var bodyParser = require('body-parser');
var helmet = require('helmet');
var cookieSession = require('cookie-session');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.set('port', (process.env.PORT || 5000));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');
app.use(helmet());
var expiryDate = new Date(Date.now() + 60 * 60 * 1000*24);
app.use(cookieSession(
    {
        name: 'hujiSession',
        keys: ['key1', 'key2'],
        cookie: {
            secure: true,
            httpOnly: true,
            domain: 'localhost:5000',
            path: '/',
            expires: expiryDate
        }
    }
));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.get('/', function (request, response) {
    response.render("index.ejs")
});
app.use('/friends', friendsHandler);
app.use('/slots', slotsHandler);
app.use('/hello', helloHandler);
app.use('/rooms', roomsHandler);
app.use('/confirm', confirmHandler);
app.use('/signup', signupHandler);
app.get('/reset', function (req, res) {
    db.run('DELETE FROM books');
    res.send("Cool, hack worx");
});


app.listen(app.get('port'), function () {
    console.log("Node app is running at localhost:" + app.get('port'))
});
