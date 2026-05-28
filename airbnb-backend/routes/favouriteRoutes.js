const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth'); // In a real app, require authentication for favorites
const {
  getFavoriteHomes,
  addFavourite,
  deleteFavourite,
  isFavorite
} = require('../data/homeStore');

// @route   GET /api/favourites
// @desc    Get all favourite homes
// @access  Public (for demo purposes)
router.get('/', async (req, res) => {
  try {
    const homes = await getFavoriteHomes();
    res.json(homes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/favourites/check/:homeId
// @desc    Check if a specific home is favourited
// @access  Public
router.get('/check/:homeId', async (req, res) => {
  try {
    const status = await isFavorite(req.params.homeId);
    res.json({ isFavorite: status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/favourites
// @desc    Add a home to favourites
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { homeId } = req.body;
    if (!homeId) {
      return res.status(400).json({ message: 'Home ID is required' });
    }
    
    const fav = await addFavourite(homeId);
    res.status(201).json(fav);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/favourites/:homeId
// @desc    Remove a home from favourites
// @access  Public
router.delete('/:homeId', async (req, res) => {
  try {
    const success = await deleteFavourite(req.params.homeId);
    if (!success) {
      return res.status(404).json({ message: 'Favourite not found' });
    }
    res.json({ message: 'Favourite removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
