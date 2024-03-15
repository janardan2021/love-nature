const Place = require('../models/place.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

const {cloudinary} = require('../cloudinary/index.js');



module.exports.index = async (req, res) => {
    const places = await Place.find({});
    res.render('places/index', {places});
}

module.exports.renderNewForm = (req, res) => {
    res.render('places/new');
}

module.exports.createPlace = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.place.location,
        limit: 1
    }).send();
    
    if(!req.body.place) throw new ExpressError('Invalid Place data', 400 )
     const place = new Place(req.body.place);
     place.geometry = geoData.body.features[0].geometry;
     place.images = req.files.map(f => ({url: f.path, filename: f.filename}));
     
     place.author = req.user._id;
     await place.save();
    //  console.log(place);
     req.flash('success', 'Sucessfully added a new place!');
     res.redirect(`/places/${place._id}`)
   }

 module.exports.showPlace = async(req,res) => {
   
    const place = await Place.findById(req.params.id)
    .populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    })
    .populate('author');
    // console.log(place)
    if (!place) {
      req.flash('error', 'Cannot find the requested place!');
      return res.redirect('/places');
 }
    res.render('places/show', {place});
    
   
  
    
}

module.exports.renderEditForm = async(req,res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    if(!place) {
        req.flash('error', 'Cannot find the requested place');
        return res.redirect('/places');
    }
    res.render('places/edit', {place});
}

module.exports.updatePlace = async (req, res) => {
    const { id } = req.params;
    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.place.location,
        limit: 1,
      })
      .send();
    const place = await Place.findByIdAndUpdate(id, {
      ...req.body.place,
    });
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    place.images.push(...imgs);
    place.geometry = geoData.body.features[0].geometry;
    await place.save();
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await place.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }
    // console.log(place);
    req.flash("success", "Successfully update a place");
    res.redirect(`/places/${place._id}`);
};

module.exports.delete = async (req, res) => {
    const {id} = req.params;
    await Place.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deleted the place!');
    res.redirect('/places');
}