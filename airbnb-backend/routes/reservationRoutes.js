const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  addReservation,
  getUserReservations,
  getHomeById
} = require('../data/homeStore');

// @route   GET /api/reservations
// @desc    Get logged-in user's reservations
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const reservations = await getUserReservations(req.user._id);
    const enriched = await Promise.all(
      reservations.map(async (r) => {
        const home = await getHomeById(r.homeId);
        return { ...r, home };
      })
    );
    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/reservations
// @desc    Create a new reservation for the logged-in user
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { homeId, guestName, guestEmail, checkIn, checkOut, guests } = req.body;

    if (!homeId || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const home = await getHomeById(homeId);
    if (!home) {
      return res.status(404).json({ message: 'Home not found' });
    }
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const totalPrice = nights * home.pricePerNight;

    const newReservation = await addReservation({
      user: req.user._id,
      homeId,
      guestName: guestName || 'Guest',
      guestEmail: guestEmail || '',
      checkIn,
      checkOut,
      guests: parseInt(guests) || 1,
      totalPrice,
      status: 'pending'
    });
    res.status(201).json(newReservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
