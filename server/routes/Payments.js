//Import the required modules
const express = require('express');
const router = express.Router();

const {capturePayment, verifySignature,sendPaymentSuccessEmail} = require('../controllers/Payments');
const {auth, isInstructor, isStudent, isAdmin} = require('../middleware/auth');

router.post('/capturePayment', auth, capturePayment);
router.post('/verifyPayment', verifySignature);
router.post('/sendPaymentSuccessEmail', auth ,sendPaymentSuccessEmail )

module.exports = router;