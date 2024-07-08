const mongoose = require('mongoose');
const mailSender = require('../utils/MailSender');
const emailTemplate = require('../mail/templates/emailVerificationTemplate');

const OTPSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 60 * 5, //The document will be automatically deleted after 5-minutes of its creation
    },
});



//async function -> to send emails to send the otp
//  yeh function hamaara neeche defined pre middleware me use hoga
async function sendVerificationEMail(email, otp) {
    //Create a transporter to send emails

    //Define the email options

    //send the email
    try {
            const mailResponse = await mailSender(
            email, 
            "Verification Email from SkillSavvy", 
            emailTemplate(otp)
        );
        console.log("Email sent successfully", mailResponse.response);
    } catch (error) {
        console.log("Error occured while sending verification email", error);
        throw error;
    }
}

// ab pre/post waaala middle ware hamaara schema ke baad aur export karne se pehle likha jaata hai  
//  see the flow
// user ne signup ke lie data enter kia -> mail aa gya OTP ka  -> otp verify hua -> if correct to db me entry create ho gyi



OTPSchema.pre("save", async function(next) {

    console.log("New document saved to the database");

    //only send an email when a new document is created 
    if(this.isNew) {
        await sendVerificationEMail(this.email, this.otp);
    }
    next();
}) 

// module.exports = mongoose.model("OTP", OTPSchema);

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;