const nodemailer = require('nodemailer')
module.exports = {
    sendMail: function(token, mail) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'akimira.node@gmail.com',
                pass: 'tpnode_123'
            }
        });

        const mailOptions = {
            from: 'akimira.node@gmail.com', // sender address
            to: mail, // list of receivers
            subject: 'test nodemailer', // Subject line
            html: `<p><a href="http://localhost:3031/token/${token}">Click here To validate your accoun</a>t</p>`// plain text body
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if(err)
            console.log(err)
            else
            console.log(info);
        });
    },
}