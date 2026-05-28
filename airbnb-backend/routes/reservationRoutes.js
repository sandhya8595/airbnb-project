const express = require('express');
const router = express.Router();
const {
  getAllReservations,
  addReservation,
  getHomeById
} = require('../data/homeStore');

// @route   GET /api/reservations
// @desc    Get all reservations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const reservations = await getAllReservations();
    // Attach home details
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
// @desc    Create a new reservation
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { homeId, guestName, guestEmail, checkIn, checkOut, guests } = req.body;
    
    if (!homeId || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const home = await getHomeById(homeId);
    if (!home) {
      return res.status(404).json({ message: 'Home not found' });
    }

    // Calculate total price
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const totalPrice = nights * home.pricePerNight;

    const newReservation = await addReservation({
      homeId: parseInt(homeId) || homeId, // Handle both string and int IDs
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
