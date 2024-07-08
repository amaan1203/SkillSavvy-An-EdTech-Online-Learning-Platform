const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

//auth
exports.auth = async (req, res, next) => {
    try {
        //extract token
        const token = req.cookies.token 
                        || req.body.token 
                        || req.header('Authorization').replace('Bearer ','');
          
        console.log("token : from auth.js middleware " , token);
        //if token is missing
        if(!token) {
            return res.status(401).json({
                success: false,
                message: 'Token Is Missing'
            });
        }

        //verify token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            // hamne jab JWT token banaaya tha , tab token ke payload me accountType
            // bhi add kia tha aur req.user karke hamne yeh accountType user ki body me daal dia hai
            // so that jab ham isStudent ya isAdmin verify kare to accountType se compare kara paae

            req.user = decode;

        } catch(error) {
            //verification - issue
            return res.status(401).json({
                success: false,
                message: 'Token Is Invalid',
            });   
        }
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Something Went Wrong While Verifying Token',
        });
    }
}

//isStudent
exports.isStudent = async (req, res, next) => {
    try {
        //  request me accountType hamaara kaise aaya?
        //  ans : jab hamne login karne ke lie authorization waale middleware ko call kia 
        //  tab  JWT token ke payload se accountType nikaal kar use req.user=decode waali line se add kar dia 
        if(req.user.accountType !== 'Student') {
            return res.status(401).json({
                success: false,
                message: 'This Is A Protectd Route For Students'
            })
        }
        next();

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'User Role Cannot Be Verified, Please Try Again'
        })
    }
}

//isInstructor
exports.isInstructor = async (req, res, next) => {
    try {

        if(req.user.accountType !== 'Instructor') {
            return res.status(401).json({
                success: false,
                message: 'This Is A Protectd Route For Instructor'
            });
        }
        next();

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'User Role Cannot Be Verified, Please Try Again'
        })
    }
}


//isAdmin
exports.isAdmin = async (req, res, next) => {
    try {

        if(req.user.accountType !== 'Admin') {
            return res.status(401).json({
                success: false,
                message: 'This Is A Protectd Route For Admin'
            })
        }
        next();
        
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'User role Cannot Be Verified, Please Try Again'
        })
    }
}