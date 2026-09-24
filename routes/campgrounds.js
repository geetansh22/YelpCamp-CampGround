const express = require('express')
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const methodOverride = require('method-override')
const Campground = require('../models/campground')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware.js')

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
    
router.get('/new', isLoggedIn, campgrounds.newForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm))



module.exports = router;