const express = require('express');
const router = express.Router();
const {
  getAllHomes,
  getApprovedHomes,
  getHomeById,
  addHome,
  updateHome,
  deleteHome,
  getNearbyHomes
} = require('../data/homeStore');

// @route   GET /api/homes
// @desc    Get all approved homes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const homes = await getApprovedHomes();
    res.json(homes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/homes/all
// @desc    Get all homes (including pending) - For admin
// @access  Public (in real app, should be Private/Admin)
router.get('/all', async (req, res) => {
  try {
    const homes = await getAllHomes();
    res.json(homes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/homes/nearby
// @desc    Get nearby homes based on lat/lng
// @access  Public
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const nearbyHomes = await getNearbyHomes(parseFloat(lat), parseFloat(lng), radius ? parseFloat(radius) : 50);
    res.json(nearbyHomes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/homes/:id
// @desc    Get a single home by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const home = await getHomeById(req.params.id);
    if (!home) {
      return res.status(404).json({ message: 'Home not found' });
    }
    res.json(home);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/homes
// @desc    Add a new home
// @access  Public (in real app, should be Private)
router.post('/', async (req, res) => {
  try {
    const newHome = await addHome(req.body);
    res.status(201).json(newHome);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/homes/:id
// @desc    Update a home
// @access  Public (in real app, should be Private/Admin)
router.put('/:id', async (req, res) => {
  try {
    const updatedHome = await updateHome(req.params.id, req.body);

    if (!updatedHome) {
      return res.status(404).json({ message: 'Home not found' });
    }

    res.json(updatedHome);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/homes/:id
// @desc    Delete a home
// @access  Public (in real app, should be Private/Admin)
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteHome(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Home not found' });
    }
    res.json({ message: 'Home removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
