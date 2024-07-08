const mongoose = require('mongoose');

//  profile hamaara extra info store karega about the user which are shown in edit profile section if the UI
const profileSchema = new mongoose.Schema({
    gender : {
        type : String,
    }, 
    dateOfBirth : {
        type : String,
    },
    about : {
        type : String,
        trim : true,
    },
    contactNumber : {
        type : Number,
        trim : true,
    }
});

module.exports = mongoose.model("Profile", profileSchema);