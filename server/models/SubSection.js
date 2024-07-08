const mongoose = require("mongoose");

// subsection ka kaam bas har course ke video ki info store karna hai , to subsection contains all the info about the course videos!
const subSectionSchema = new mongoose.Schema({
    
    title:{
        type:String,
    },
    timeDuration: {
        type: String,
    },
    description: {
        type:String,
    },
    videoUrl:{
        type:String,
    },


});

module.exports = mongoose.model("SubSection", subSectionSchema);