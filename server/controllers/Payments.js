const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/MailSender');
const {courseEnrollmentEmail }= require('../mail/templates/courseEnrollmentEmail');
const mongoose = require("mongoose")
const crypto= require("crypto")
const CourseProgress = require("../models/CourseProgress")


//capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    
    //get courseId and userID
    const {courses} = req.body;
    const userId = req.user.id;
    console.log("user id in capture payment " , userId);
    //validation  
    //Valid CourseId
    if (courses.length === 0) {
        return res.json({ success: false, message: "Please Provide Course ID" })
      }

      console.log("courses in the backend of captire payment " , courses);
    //valid CourseDetail
    let total_amount = 0

    for (const course_id of courses) {
        let course
        try {
          // Find the course by its ID
          console.log("course_id", course_id);
          course = await Course.findById(course_id)
          console.log("course ", course);
    
          // If the course is not found, return an error
          if (!course) {
            return res
              .status(200)
              .json({ success: false, message: "Could not find the Course" })
          }
    
          // Check if the user is already enrolled in the course
           //  user id request se string ki form me aaegi to use object id me convert karna padega 
          const uid = new mongoose.Types.ObjectId(userId)
          if (course.studentsEnrolled.includes(uid)) {
            return res
              .status(200)
              .json({ success: false, message: "Student is already Enrolled" })
          }
    
          // Add the price of the course to the total amount
          total_amount += course.price
        } catch (error) {
          console.log(error)
          return res.status(500).json({ success: false, message: error.message })
        }
      }
    
       //order create
       const currency = 'INR';
   
       const options = {
        //  razorpay me amount ko 100 se multiply karna pdta hai 100.00 display karaane ke lie
           amount: total_amount * 100,
           currency : "INR", 
        //     reciept number ko ranfdom number banaana tha 
           receipt: Math.random(Date.now()).toString(),
        //     notes me user id islie bhej rhe hai taaki authorize karne ke time par userId nikaal paae 
        //    notes: {
        //        courseId: courses[0].course_id,
        //        userId,
        //    }
       };
   
       try {   
   
           //initiate the payment using razorpay
           const paymentResponse = await instance.orders.create(options);
           console.log(paymentResponse);
           //return response
           return res.status(200).json({
               success: true,
               message: paymentResponse
            //    courseName: course.courseName,
            //    courseDescription: course.courseDescription,
            //    thumbnail: course.thumbnail,
            //    orderId: paymentResponse.id,
            //    currency: paymentResponse.currency,
            //    amount: paymentResponse.amount,
           });
   
       } 
       catch (error) {
           console.log(error);
           res.json({
               success: false,
               message: 'Could not initiate order',
           });
       }
};


//verify Signature of Razorpay and Server
exports.verifySignature = async (req, res) => {
    // see notes usme explain kia hai yeh 
    // const webhookSecret = '12345678';
    console.log("req.user in verify signature " , req?.body);
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses
    const userId = req?.body?.user?._id;

    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !courses ||
        !userId
      ) {
        return res.status(200).json({ success: false, message: "Payment Failed" })
      }

      let body = razorpay_order_id + "|" + razorpay_payment_id
      const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex")

      if (expectedSignature === razorpay_signature) {
        await enrollStudents(courses, userId, res)
        return res.status(200).json({ success: true, message: "Payment Verified" })
      }

      return res.status(200).json({ success: false, message: "Payment Failed" })
    

    //  this is how you send signature see documentation
    // const signature = req.headers("x-r azorpay-signature");
    
    // sha- secure hashing algorithm 
    //   Hmac aur sha ka kaam same hai but HmAC TAKES TWO inputs that are 
    //  first -> the hashing algorithm ( which here is sha256) and second-> is the secret key jise aap hash karna  chaahte hai 
    //  shasum is just the name of the Hmac object created
    // const shasum = crypto.createHmac("sha256", webhookSecret);
    //  ab is shasum object ko string me convert karna padega
    // shasum.update(JSON.stringify(req.body));
    //   ab jab bhi ham kisi key par koi hashing algo run karte hai , to uske output ko digest kehte hai which is used in hexadecimal format
    //  islie final output is digest 
    // const digest = shasum.digest("hex");

    // if(signature === digest) {
    //     console.log("Payment is Authorized");
        
        //  ab hame action karna hai that is payment verify hone ke baad student ko course me enrol karnaa hai aur  course ke array me bhi student ko add karna hai
        //  but user ki id to bhai razor pay se aia hai . koi frontend to hai nahi 
        //  tp userid hame razorpay ke request se milegi  .body.payload.payment.entity.notes  karke jab wo hamare backend ke server par hit karega at the api route /verifysignature 
        //  also observe upar hamne jab notes send kia tha tab hamne hi usi me userid send ki thi
        // const {courseId, userId} = req.body.payload.payment.entity.notes;

        // try {
        //     //fulfill the action

        //     //find the course and enroll in it
        //     const enrolledCourse = await Course.findOneAndUpdate(
        //                                 {_id: courseId},
        //                                 {$push: {studentsEnrolled: userId}},
        //                                 {new: true},
        //     );

        //     if(!enrolledCourse) {
        //         return res.status(500).json({
        //             success: false,
        //             message: 'Course not Found',
        //         });
        //     }

        //     console.log(enrolledCourse);

        //     //find the student and add the course to their enrolled courses list
        //     const enrolledStudent = await User.findOneAndUpdate(
        //                                     {_id: userId},
        //                                     {$push: {courses: courseId}},
        //                                     {new: true},
        //     );

        //     console.log(enrolledStudent);

        //     //send mail of confirmation to students
        //     // mail sender me mail , title  , aur body send karni hoti hia 
        //     //  abhi ise mail ke template se attack karna hai 
        //     const emailResponse = await mailSender(
        //                             enrolledStudent.email,
        //                             "Congratulations from CodeHelp",
        //                             "Congratulations, You are onboarded into new Codehelp course",
        //     );

        //     console.log(emailResponse);
        //     return res.status(200).json({
        //         success: true,
        //         message: "Signature Verified and Course added",
        //     });

        // } catch (error) {
        //     console.log(error);
        //     return res.status(500).json({
        //         success: false,
        //         message: error.message,
        //     });
        // }
    // } 
    // else {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Invalid Request',
    //     });
    // }
};




// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Course ID and User ID" })
    }
  
    for (const courseId of courses) {
      try {
        // Find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { studentsEnrolled: userId } },
          { new: true }
        );

        console.log(" this is the enrolled course data when a user purchases a course in payments.js" , enrolledCourse);
  
        if (!enrolledCourse) {
          return res
            .status(500)
            .json({ success: false, error: "Course not found" })
        }
        console.log("Updated course: ", enrolledCourse)
  
        const courseProgress = await CourseProgress.create({
          courseID: courseId,
          userId: userId,
          completedVideos: [],
        })
        // Find the student and add the course to their list of enrolled courses
        const enrolledStudent = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              courses: courseId,
              courseProgress: courseProgress._id,
            },
          },
          { new: true }
        )
  
        console.log("Enrolled student: ", enrolledStudent)
        // Send an email notification to the enrolled student
        const emailResponse = await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
          )
        )
  
        // console.log("Email sent successfully: ", emailResponse.response)
      } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, error: error.message })
      }
    }
  }


  // Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body
  
    const userId = req.user.id
  
    if (!orderId || !paymentId || !amount || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the details" })
    }
  
    try {
      const enrolledStudent = await User.findById(userId)
  
      await mailSender(
        enrolledStudent.email,
        `Payment Received`,
        paymentSuccessEmail(
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
          amount / 100,
          orderId,
          paymentId
        )
      )
    } catch (error) {
      console.log("error in sending mail", error)
      return res
        .status(400)
        .json({ success: false, message: "Could not send email" })
    }
  }  


