const mongoose = require('mongoose');

//  jis jis  user ki rating aur review dikhana hai , uska information uis stored like this!
const ratingAndReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    },
    rating: {
        type: Number,
        required: true,
    },
    reviews: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('RatingAndReview', ratingAndReviewSchema);