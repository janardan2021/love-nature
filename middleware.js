const {placeSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError.js');
const Place = require('./models/place.js');
const Review = require('./models/review.js');


module.exports.isLoggedIn = (req, res, next) => {
     if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validatePlace = (req, res, next) => {
    const result = placeSchema.validate(req.body);
    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
    // console.log(result);
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/places/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        console.log(error);
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
    // console.log(result);
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/places/${id}`);
    }
    next();
}