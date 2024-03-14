const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema ({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
   return this.url.replace('/upload', '/upload/w_200')
})

const opts = {toJSON: {virtuals: true}};

const PlaceSchema = new Schema({
    title: String,
    images: [ImageSchema],
    description: String,
    location: String,
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

PlaceSchema.virtual('properties.popUpMarkUp').get(function() {
    return `<strong><a href='/places/${this._id}'>${this.title}</a></strong><p>${this.description.substring(0, 30)}</p>`
 })

PlaceSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Place', PlaceSchema);