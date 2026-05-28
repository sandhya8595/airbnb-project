const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema(
  {
    houseName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    photoUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    },
    amenities: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
    maxGuests: {
      type: Number,
      default: 2,
      min: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'approved'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

homeSchema.virtual('id').get(function () {
  return this._id.toString();
});

const Home = mongoose.model('Home', homeSchema);

module.exports = Home;
