const express = require('express')
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync')
const reviews = require('../controllers/reviews.js')
const ExpressError = require('../utils/ExpressError')
const {reviewSchema} = require('../schemas.js')
const Review = require('../models/review')
const Campground = require('../models/campground')
const {validateReview, isReviewAuthor, isLoggedIn} = require('../middleware.js')

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;
