const mongoose = require("mongoose");

// section me multiple sub sections honge and har ek subsection me course ke video ki info hogi!
const sectionSchema = new mongoose.Schema({
    
    sectionName: {
        type:String,
    },

    subSection: [
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"SubSection",    
        }
    ],

});

module.exports = mongoose.model("Section", sectionSchema);