const express = require('express');
const router = express.Router();

const places = require('../controllers/places.js');

const {isLoggedIn, isAuthor, validatePlace} = require('../middleware.js');
const {storage} = require('../cloudinary/index.js')

const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage })

const catchAsync = require('../utils/catchAsync.js');



router.route('/')
    .get(catchAsync (places.index))
    .post(isLoggedIn,  upload.array('image'), validatePlace, catchAsync( places.createPlace ))
   

router.get('/new', isLoggedIn, places.renderNewForm);;

router.route('/:id')
    .get(catchAsync( places.showPlace ))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePlace, catchAsync( places.updatePlace))
    .delete(isLoggedIn, isAuthor, catchAsync( places.delete))


router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync( places.renderEditForm))

module.exports = router;