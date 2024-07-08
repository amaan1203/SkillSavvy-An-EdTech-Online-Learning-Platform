const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

//create a new sub-section for a given section
exports.createSubSection = async (req, res) => {
    try {
        //fetch data from request of body
        const {sectionId, title, description} = req.body;
        //extract file/video
        // console.log("sectionId , title and description in createSubSection controller" ,sectionId ,title ,description  )
         console.log("req.files" , req.files);
        const video = req.files.video;
        //validation
        if(!sectionId || !title || !description || !video) {
            return res
                .status(400)
                .json({
                success: false,
                message: 'All Fields are Required',
            });
        }
        //upload video file to cloudinary
        const uploadDetails = await uploadImageToCloudinary(
            video, 
            process.env.FOLDER_NAME
        );
        console.log(uploadDetails);

        //create a sub-section with necessary information
        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })
        //update corresponding section with newly created sub-section
        const updatedSection = await Section.findByIdAndUpdate(
            {_id: sectionId},
            {$push:{ subSection: subSectionDetails._id } },
            {new: true}
        ).populate("subSection")
      

        return res.status(200).json({
            success: true,
            data: updatedSection,
        })
        
    } catch (error) {
        //Handle any error that may occur duing the process
        console.error("Error creating a new sub-section: ", error);
        return res.status(500).json({
            succcess: false,
            message: 'Internal Server Error',
            error: error.message,
        })
    }
}



//update the sub-section
exports.updateSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId, title, description} = req.body;
        const subSection = await SubSection.findById(subSectionId);

        if(!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        if(title !== undefined) {
            subSection.title = title;
        }

        if(description !== undefined) {
            subSection.description = description;
        }

        if(req.files && req.files.video !== undefined) {
            const video = req.files.video;
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME,
            )
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save();

        const updatedSection=await Section.findById(sectionId).populate({
            path:"subSection",

         }).exec();

        
        return res.json({
            success: true,
            message: "Section updated Successfully",
            data: updatedSection
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section",
        })
    }
};

exports.deleteSubSection = async (req, res) => {
    try {
        const {subSectionId, sectionId} = req.body;
        console.log("in subSection.js")
        await Section.findByIdAndUpdate(
            {_id: sectionId},
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        )
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId });


        if(!subSection) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "SubSection Not Found",
                    
                })
        }

        const updatedSection=await Section.findById(sectionId).populate({
            path:"subSection",

         }).exec();

        return res.json({
            success: true,
            message: "SubSection Deleted Successfully",
            data:updatedSection
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An Error Occurred While Deleting the SubSection",
        })
    }
}