const mongoose = require('mongoose');

     //  this is the user schema which collects data from the signup page 
    const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        }, 
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        //  enum  bana dia accountType ko
        accountType: {
            type: String,
            enum: ['Admin', 'Student', 'Instructor'],
            required: true
        },
        active: {
            type: Boolean,
            default: true,
        },
        approved: {
            type: Boolean,
            default: true,
        },
        //  hamaara profile model hoga jisme additional details hogi jisko additionalDetails refer kar rha hoga 
        additionalDetails: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Profile",
        },
       
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            }
        ],
        //  image ka type string hai because wo ek url hoga 
        image: {
            type : String,
            required : true,
        },

        //  token aur resetPasswordexpires ka user model me kya kaam hai??
        // taaki ham jab forget password waale option me jaae tab ham ek token generate 
        // karke verfiy kar sake user ko aur uska expiry time set kar sake 
        token: {
            type : String,
        },
        resetPasswordExpires: {
            type: Date,
        },


        // course progress hamaara yaha par course progress naam ke model ko refer kar rha hai  which is an array
        courseProgress: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CourseProgress",
            }
        ],
    },

    //Add timestamps for when the document is created and last modified
    {timestamps: true}
);

module.exports = mongoose.model("User", userSchema);