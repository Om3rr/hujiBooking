var mysql = require('mysql');
var fs = require('fs');
if(!process.env.PORT) {
    var creds = JSON.parse(fs.readFileSync('keys.json'));
}
var dbConfig = {
    host     : process.env.HOSTNAME || creds.HOSTNAME,
    user     : process.env.DB_KEY || creds.DB_KEY,
    password : process.env.DB_SECRET || creds.DB_SECRET,
    database : process.env.DB_NAME || creds.DB_NAME,
    port     : 3306,
    waitForConnections : true,
    queueLimit : 100,
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    aquireTimeout   : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
};
var pool = mysql.createPool(dbConfig);

dbObject = {};
dbObject.run = function (q, p) {
    return new Promise(function (res, rej) {
            pool.query(mysql.format(q,p), function (err, rows, fields) {
                if(err){
                    rej(err)
                } else{
                    res(rows);
                }
            });
        }
    )
};


dbObject.all = dbObject.run;

exports.db = dbObject;