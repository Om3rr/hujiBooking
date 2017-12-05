var nodemailer = require('nodemailer');

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 12; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hujirooms@gmail.com',
        pass: 'diklaisgr8'
    }
});

var sendConfirmation = function(mail, confirmCode){
    var mailOptions = {
        from: 'hujirooms@gmail.com',
        to: mail,
        subject: 'Huji Rooms - User confirmation email',
        html: '<h1>Hello world!</h1><h3>Youre more than welcome to join us!</h3><a href="https://hujirooms.herokuapp.com/confirm/'+confirmCode+'">Just click here to confirm.</a>'
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

var sendForgetMyPass = function(mail, confirmCode){
    var mailOptions = {
        from: 'hujirooms@gmail.com',
        to: mail,
        subject: 'Huji Rooms - Forget my password :D',
        html: '<h1>Hello again</h1><h3>Somebody told me that you forgot your password m8.. so here it is</h3><a href="https://hujirooms.herokuapp.com/forget/reset/'+confirmCode+'">Just click here and choose a new one :D</a>'
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = {send : sendConfirmation, getUid : makeid, forget : sendForgetMyPass};