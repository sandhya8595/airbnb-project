const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    homeId: {
      type: String,
      required: true,
      trim: true,
    },
    guestName: {
      type: String,
      required: true,
      trim: true,
    },
    guestEmail: {
      type: String,
      required: true,
      trim: true,
    },
    checkIn: {
      type: String,
      required: true,
    },
    checkOut: {
      type: String,
      required: true,
    },
    guests: {
      type: Number,
      default: 1,
      min: 1,
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reservationSchema.virtual('id').get(function () {
  return this._id.toString();
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
