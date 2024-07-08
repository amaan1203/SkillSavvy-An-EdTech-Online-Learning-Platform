const Profile = require('../models/Profile');
const User = require('../models/User');
const {uploadImageToCloudinary} = require('../utils/imageUploader');
const CourseProgress =require("../models/CourseProgress")
const Course = require("../models/Course")
const  Mongoose = require("mongoose");

//  hamne already profile create kar li thi jab user create kia tha and saari values ko null kar dia tha 
// / islie hame createProfile  nahi karni padi
//Method for updating a profile
exports.updateProfile = async (req, res) => {
     
    try {   
        //get data
        const {dateOfBirth='', about='', contactNumber, gender=''} = req.body;
        //get userId
        const id = req.user.id;

        //Find the profile by id
        const user = await User.findById(id);
        const profile = await Profile.findById(user.additionalDetails);

        //update profile fields
        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.contactNumber = contactNumber;
        profile.gender = gender;
        
        //Save the updated profile
        await profile.save();

        //return response
    
        return res.status(200).json({
            success: true,
            message: 'Profile Updated Successfully',
            updatedUserDetails: user,
            profile: profile
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error in Updating Profile',
            error: error.message,
        });
    }
};

//delete Account
//Explore -> How can we schedule what is CRONE JOB
exports.deleteAccount = async (req, res) => {
    try {


        //get id
        const id = req.user.id;
        //validation of id
        const user = await User.findById({_id: id})
        //delete profile
        if(!user) {
            return res.status(404).send({
                success: false,
                message: 'User Not Found',
            });
        }
        //delete associated profile with user
        await Profile.findByIdAndDelete({_id: user.additionalDetails});

        //TODO: HW unenroll user from all enrolled courses
        await Promise.all(user.courses.map(async (courseId) => {
            await Course.updateOne(
                { _id: courseId },
                { $pull: { studentsEnrolled: id } }
            );
        }));
        
        //Now delete user
        await User.findByIdAndDelete({_id:id});
        //return response
        return res.status(200).json({
            success: true,
            message: 'User Deleted Successfully',
        });

    } catch(error) {
        return res
            .status(500)
            .json({
            success: false,
            message: 'User Cannot Be Deleted',
            error: error.message,
        });
    }
}

exports.getAllUserDetails = async (req, res) => {
    try {
        //get id
        const id = req.user.id;
        
        //validation and get user details
        const userDetails = await User.findById(id)
            .populate('additionalDetails')
            .exec();
        console.log(userDetails);
        //return response
        return res.status(200).json({
            success: true,
            message: 'User Data Fetched Successfully',
            data: userDetails,
        });
        
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture;
        const userId = req.user.id;
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image);
        const updatedProfile = await User.findByIdAndUpdate(
            {_id: userId},
            {image: image.secure_url},
            {new: true}
        )
        res.send ({
            success: true,
            message: `Image Updated Successfully`,
            data: updatedProfile,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        let userDetails = await User.findOne({ _id: userId })
            .populate({
                path: 'courses',
                populate: {
                    path: 'courseContent',
                    model: 'Section',
                    populate: {
                        path: 'subSection',
                        model: 'SubSection'
                    }
                }
            })
            .exec();
        
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could Not Find User With Id: ${userId}`,
            });
        }

        userDetails = userDetails.toObject();
        console.log("userDetails here in profile.js to get enrolled courses", userDetails);

        for (let i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0;
            let subsectionLength = 0;

            for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce(
                    (acc, curr) => acc + parseInt(curr.timeDuration, 10),
                    0
                );

                subsectionLength += userDetails.courses[i].courseContent[j].subSection.length;
            }

            userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);
            console.log("Subsection length", subsectionLength);

            let courseProgressCount = await CourseProgress.findOne({
                courseID: userDetails.courses[i]._id,
                userId: userId,
            });

            courseProgressCount = courseProgressCount?.completedVideos?.length || 0;

            if (subsectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100;
            } else {
                const multiplier = Math.pow(10, 2);
                userDetails.courses[i].progressPercentage = Math.round(
                    (courseProgressCount / subsectionLength) * 100 * multiplier
                ) / multiplier;
            }
        }

        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Function to convert seconds to a readable duration format
function convertSecondsToDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
}

exports.instructorDashboard = async (req, res) => {
    try {
      const courseDetails = await Course.find({ instructor: req.user.id })

      console.log(" printing the courseDetails in instructorDashboard in Profile.js controller " , courseDetails);
  
      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentsEnrolled.length
        const totalAmountGenerated = totalStudentsEnrolled * course.price
  
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          // Include other course properties as needed
          totalStudentsEnrolled,
          totalAmountGenerated,
        }
  
        return courseDataWithStats
      })
  
      res.status(200).json({ courses: courseData })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }
  
  
