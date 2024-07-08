const nodemailer = require("nodemailer");

//  YEH MAIL SENDER HAMNE IS LIE LIKHA HAI TAAKI HAM OTP KO MAIL ME SEND KAR PAAE AND
//  THIS OTP IS USED WHEN A USER TRIES TO SIGN IN ----> OOOOOO NICE SAMJH AA GYA AB YEH 

const mailSender = async (email, title, body) => {
    try { 
        // mail bhejne ke lie .createTransport waala function use karte hai nodemailer ka 
        let transporter = nodemailer.createTransport({
            host : process.env.MAIL_HOST, 
            secure: false,
            auth : {
                user : process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
        //  this sends tha mail using the transporter
        let info = await transporter.sendMail({
            from: 'SkillSavvy - by Amaan',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })
        console.log(info);
        return info;

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = mailSender;