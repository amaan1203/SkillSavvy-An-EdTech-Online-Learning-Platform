const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');
const mongoose= require("mongoose")

//createRating
exports.createRating = async (req, res) => {
    try {
      const userId = req.user._id
      const { rating, review, courseId } = req.body
  
      // Check if the user is enrolled in the course
  
      const courseDetails = await Course.findOne({
        _id: courseId,
        studentsEnroled: { $elemMatch: { $eq: userId } },
      })
  
      if (!courseDetails) {
        return res.status(404).json({
          success: false,
          message: "Student is not enrolled in this course",
        })
      }
  
      // Check if the user has already reviewed the course
      const alreadyReviewed = await RatingAndReview.findOne({
        user: userId,
        course: courseId,
      })
  
      if (alreadyReviewed) {
        return res.status(403).json({
          success: false,
          message: "Course already reviewed by user",
        })
      }
  
      // Create a new rating and review
      const ratingReview = await RatingAndReview.create({
        rating,
        review,
        course: courseId,
        user: userId,
      })
  
      // Add the rating and review to the course
      await Course.findByIdAndUpdate(courseId, {
        $push: {
          ratingAndReviews: ratingReview,
        },
      })
      await courseDetails.save()
  
      return res.status(201).json({
        success: true,
        message: "Rating and review created successfully",
        ratingReview,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }
//getAverageRating
//  ab ham aggregate ka use karna seekhenge  new and interesting 
exports.getAverageRating = async (req, res) => {
    try {
        //get course ID
        const courseId = req.body.courseId;
        //calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    //  course id string thi to use object me convert kar lia 
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                //  ab ham group karna hai 
                $group: {
                    _id: null,
                    //  $avg hame rating paramter par rating ki average value return kar dega  
                    averageRating: { $avg: "$rating"},
                }
            }
        ])
        //return rating
        if(result.length > 0) {
            return res.status(200).json({
                success: true,
                // result array of object hai hai jiske   averagerating waale key me  rating stored hai 
                averageRating: result[0].averageRating,
            });
        }

        // if no rating/review exists
        return res.status(200).json({
            success: true, 
            message: 'Average Rating is 0, no rating given till now',
            averageRating: 0,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//getAllRatingAndReviews
//  yeh function irrespective of the courses saare rating search karke laana hai 
exports.getAllRatingAndReviews = async (req, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
                            //  desc karne se decreasing order me rating aaegi
                            .sort({rating: "desc"})
                            .populate({
                                path: "user",
                                //  sirf yahi field laake dena 
                                select: "firstName lastName email image",
                            })
                            .populate({
                                path: "course",
                                //  sirf yahi fields ko populate karna 
                                select: "courseName",
                            })
                            .exec();
        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}