const Section = require('../models/Section');
const Course = require('../models/Course');
const subSection=require('../models/SubSection');

//Create a new section
exports.createSection = async (req, res) => {
    try {
        //data fetch 
        const {sectionName, courseId} = req.body;
        //data validation
        if(!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required properties'
            });
        }
        //create a new section
        const newSection = await Section.create({sectionName});
        //update course with setion objectID
        //  matlab ki course ke model me dekho courseContent karke ek array hai jisme hamaare
        // Course ki id hogi 
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            {new: true},
        )
        //HW: use populate to replace section /sub-section both in the updatedCourseDetails
        //   interview me bataana bhai bahut dikkt hui thi edit section ko ui me dikhaane me 
        //  pehle backend se send hi nahi ka rha tha   
        .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        //return updated course object in response
        return res.status(200).json({
            success: true,
            message: 'Section Created Successfully',
            updatedCourseDetails,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        })
    }
}


//Update a section
exports.updateSection = async (req, res) => {
    try {
        //data input 
        const {sectionName, sectionId , courseId} = req.body;
        //data validation
        if(!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: 'Missing Properties'
            });
        }
        //update data
        const section = await Section.findByIdAndUpdate(
            sectionId, 
            {sectionName},
             {new: true});
        const course = await Course.findById(courseId).populate(
            {
                path:"courseContent",
                populate:{
                    path:"subSection",
                }
            }
        ).exec()

        return res.status(200).json({
            success: true,
            message: section,
            data: course
        })

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to Update Section, please try again',
            error: error.message,
        })
    }
};


//Delete a section
exports.deleteSection = async (req, res) => {
    try {
      const { sectionId, courseId } = req.body
      await Course.findByIdAndUpdate(courseId, {
        $pull: {
          courseContent: sectionId,
        },
      })
      const section = await Section.findById(sectionId)
      console.log(sectionId, courseId)
      if (!section) {
        return res.status(404).json({
          success: false,
          message: "Section not found",
        })
      }
      // Delete the associated subsections
      await subSection.deleteMany({ _id: { $in: section.subSection } })
  
      await Section.findByIdAndDelete(sectionId)
  
      // find the updated course and return it
      const course = await Course.findById(courseId)
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.status(200).json({
        success: true,
        message: "Section deleted",
        data: course,
      })
    } catch (error) {
      console.error("Error deleting section:", error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }
