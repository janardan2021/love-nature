const Review = require('../models/review.js');
const Place = require('../models/place.js');

module.exports.createReview = async (req, res) => {
    const place = await Place.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash('success', 'Sucessfully created a new review!');
    res.redirect(`/places/${place._id}`);
}

module.exports.deleteReview = async(req,res) => {
    const {id, reviewId} = req.params;
    await Place.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Sucessfully deleted the review!');
    res.redirect(`/places/${id}`);
}