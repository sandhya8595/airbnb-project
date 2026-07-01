const Home = require('../models/Home');
const Favourite = require('../models/Favourite');
const Reservation = require('../models/Reservation');

const seedHomesData = [
  {
    houseName: 'Cozy Apartment in Hauz Khas',
    email: 'host1@example.com',
    pricePerNight: 2500,
    location: 'Delhi, India',
    latitude: 28.5494,
    longitude: 77.2001,
    rating: 4.8,
    photoUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
    amenities: ['WiFi', 'AC', 'Kitchen', 'Parking'],
    description: 'A charming apartment in the heart of Hauz Khas with modern amenities and a cozy vibe. Perfect for solo travelers and couples.',
    maxGuests: 2,
    status: 'approved'
  },
  {
    houseName: 'Beachfront Villa',
    email: 'host2@example.com',
    pricePerNight: 7500,
    location: 'Goa, India',
    latitude: 15.2993,
    longitude: 73.9090,
    rating: 4.9,
    photoUrl: 'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=600&q=80',
    amenities: ['Pool', 'WiFi', 'Beach Access', 'AC'],
    description: 'Luxurious beachfront villa with private pool and direct beach access. Wake up to stunning ocean views every morning.',
    maxGuests: 6,
    status: 'approved'
  },
  {
    houseName: 'Mountain Retreat Cabin',
    email: 'host3@example.com',
    pricePerNight: 3200,
    location: 'Manali, India',
    latitude: 32.2396,
    longitude: 77.1887,
    rating: 4.6,
    photoUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&q=80',
    amenities: ['Fireplace', 'WiFi', 'Mountain View', 'Parking'],
    description: 'Escape to the mountains in this rustic yet comfortable cabin surrounded by pine forests and breathtaking views.',
    maxGuests: 4,
    status: 'approved'
  },
  {
    houseName: 'Heritage Haveli Suite',
    email: 'host4@example.com',
    pricePerNight: 4500,
    location: 'Jaipur, India',
    latitude: 26.9124,
    longitude: 75.7873,
    rating: 4.7,
    photoUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80',
    amenities: ['WiFi', 'AC', 'Heritage Tour', 'Breakfast'],
    description: 'Experience royal Rajasthani hospitality in this beautifully restored heritage haveli with traditional décor.',
    maxGuests: 3,
    status: 'approved'
  },
  {
    houseName: 'Lakeside Houseboat',
    email: 'host5@example.com',
    pricePerNight: 5800,
    location: 'Srinagar, India',
    latitude: 34.0837,
    longitude: 74.7973,
    rating: 4.9,
    photoUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    amenities: ['Lake View', 'WiFi', 'Meals', 'Shikara Ride'],
    description: 'A unique stay on the serene Dal Lake. Enjoy traditional Kashmiri meals and a complimentary Shikara ride.',
    maxGuests: 4,
    status: 'approved'
  },
  {
    houseName: 'Tropical Treehouse',
    email: 'host6@example.com',
    pricePerNight: 4000,
    location: 'Wayanad, India',
    latitude: 11.6854,
    longitude: 76.1320,
    rating: 4.5,
    photoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    amenities: ['Nature Trail', 'WiFi', 'Breakfast', 'Campfire'],
    description: 'Stay amidst the lush greenery of Wayanad in this elevated treehouse with nature trails and evening campfires.',
    maxGuests: 2,
    status: 'pending'
  }
];

async function seedHomes() {
  const count = await Home.countDocuments();
  if (count === 0) {
    await Home.insertMany(seedHomesData);
    console.log('✅ Seeded default homes into MongoDB');
  }
}

async function getAllHomes() {
  return Home.find().lean({ virtuals: true });
}

async function getApprovedHomes() {
  return Home.find({ status: 'approved' }).lean({ virtuals: true });
}

async function getHomeById(id) {
  if (!id) return null;
  return Home.findById(id).lean({ virtuals: true });
}

async function addHome(homeData) {
  const amenities = parseAmenities(homeData.amenities);
  const home = await Home.create({
    houseName: homeData.houseName,
    email: homeData.email,
    pricePerNight: Number(homeData.pricePerNight) || 0,
    location: homeData.location,
    latitude: Number(homeData.latitude) || 20.5937,
    longitude: Number(homeData.longitude) || 78.9629,
    rating: Number(homeData.rating) || 0,
    photoUrl: homeData.photoUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    amenities,
    description: homeData.description || '',
    maxGuests: Number(homeData.maxGuests) || 2,
    status: homeData.status || 'pending',
  });

  return home.toObject({ virtuals: true });
}

async function updateHome(id, updatedData) {
  const existingHome = await Home.findById(id).lean();
  if (!existingHome) return null;

  const updatedFields = {
    houseName: updatedData.houseName ?? existingHome.houseName,
    email: updatedData.email ?? existingHome.email,
    pricePerNight: updatedData.pricePerNight !== undefined ? Number(updatedData.pricePerNight) : existingHome.pricePerNight,
    location: updatedData.location ?? existingHome.location,
    latitude: updatedData.latitude !== undefined ? Number(updatedData.latitude) : existingHome.latitude,
    longitude: updatedData.longitude !== undefined ? Number(updatedData.longitude) : existingHome.longitude,
    rating: updatedData.rating !== undefined ? Number(updatedData.rating) : existingHome.rating,
    photoUrl: updatedData.photoUrl ?? existingHome.photoUrl,
    amenities: updatedData.amenities !== undefined ? parseAmenities(updatedData.amenities) : existingHome.amenities,
    description: updatedData.description ?? existingHome.description,
    maxGuests: updatedData.maxGuests !== undefined ? Number(updatedData.maxGuests) : existingHome.maxGuests,
    status: updatedData.status ?? existingHome.status,
  };

  const updatedHome = await Home.findByIdAndUpdate(
    id,
    updatedFields,
    { new: true, runValidators: true }
  ).lean({ virtuals: true });

  return updatedHome;
}

async function deleteHome(id) {
  const deleted = await Home.findByIdAndDelete(id);
  if (!deleted) return false;
  await Favourite.deleteMany({ homeId: id.toString() });
  await Reservation.deleteMany({ homeId: id.toString() });
  return true;
}

async function getAllFavourites() {
  return Favourite.find().lean();
}

async function getFavoriteHomes() {
  const favs = await Favourite.find().lean();
  const favHomeIds = favs.map((f) => f.homeId);
  return Home.find({ _id: { $in: favHomeIds } }).lean({ virtuals: true });
}

async function addFavourite(homeId) {
  const id = homeId.toString();
  const existing = await Favourite.findOne({ homeId: id });
  if (existing) return existing;
  const fav = new Favourite({ homeId: id });
  await fav.save();
  return fav;
}

async function deleteFavourite(homeId) {
  const id = homeId.toString();
  const result = await Favourite.deleteOne({ homeId: id });
  return result.deletedCount > 0;
}

async function isFavorite(homeId) {
  const fav = await Favourite.findOne({ homeId: homeId.toString() });
  return !!fav;
}

async function getAllReservations() {
  return Reservation.find().lean({ virtuals: true });
}

async function getUserReservations(userId) {
  return Reservation.find({ user: userId }).lean({ virtuals: true });
}

async function addReservation(reservationData) {
  const reservation = await Reservation.create({
    user: reservationData.user,
    homeId: reservationData.homeId,
    guestName: reservationData.guestName || 'Guest',
    guestEmail: reservationData.guestEmail || '',
    checkIn: reservationData.checkIn,
    checkOut: reservationData.checkOut,
    guests: Number(reservationData.guests) || 1,
    totalPrice: Number(reservationData.totalPrice) || 0,
    status: reservationData.status || 'pending',
  });
  return reservation.toObject({ virtuals: true });
}

function parseAmenities(value) {
  if (Array.isArray(value)) return value.map((item) => item.toString().trim()).filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

async function getNearbyHomes(lat, lng, radiusKm = 50) {
  const approvedHomes = await getApprovedHomes();
  return approvedHomes
    .filter((home) => {
      if (!home.latitude || !home.longitude) return false;
      const distance = getDistanceFromLatLonInKm(lat, lng, home.latitude, home.longitude);
      return distance <= radiusKm;
    })
    .map((home) => {
      const distance = getDistanceFromLatLonInKm(lat, lng, home.latitude, home.longitude);
      return { ...home, distance };
    })
    .sort((a, b) => a.distance - b.distance);
}
module.exports = {
  seedHomes,
  getAllHomes,
  getApprovedHomes,
  getHomeById,
  addHome,
  updateHome,
  deleteHome,
  getAllFavourites,
  getFavoriteHomes,
  addFavourite,
  deleteFavourite,
  isFavorite,
  getUserReservations,   // was getAllReservations
  addReservation,
  getNearbyHomes,
};
