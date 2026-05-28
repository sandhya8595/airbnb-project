import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Users, Heart, Share, Check } from 'lucide-react';
import api from '../services/api';
import MapView from '../components/map/MapView';

const HomeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [bookingData, setBookingData] = useState({ checkIn: '', checkOut: '', guests: 1 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeRes, favRes] = await Promise.all([
          api.get(`/homes/${id}`),
          api.get(`/favourites/check/${id}`).catch(() => ({ data: { isFavorite: false } }))
        ]);
        setHome(homeRes.data);
        setIsFav(favRes.data.isFavorite);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleFav = async () => {
    try {
      if (isFav) {
        await api.delete(`/favourites/${id}`);
        setIsFav(false);
      } else {
        await api.post('/favourites', { homeId: id });
        setIsFav(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBooking = (e) => {
    e.preventDefault();
    // In a real app, this would redirect to a checkout page with data
    navigate('/store/booking', { state: { homeId: id, ...bookingData } });
  };

  if (loading) {
    return (
      <div className="animate-pulse max-w-6xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-[400px] bg-gray-200 rounded-2xl mb-8"></div>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-24 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="h-80 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!home) {
    return <div className="text-center py-20"><h2 className="text-2xl font-bold">Home not found</h2></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Title */}
      <h1 className="text-3xl font-extrabold mb-2">{home.houseName}</h1>
      
      <div className="flex justify-between items-center mb-6 text-sm font-medium">
        <div className="flex items-center gap-4 text-[var(--color-text-secondary)]">
          <span className="flex items-center gap-1 text-[var(--color-text-primary)]"><Star size={16} className="fill-current" /> {home.rating.toFixed(1)}</span>
          <span className="flex items-center gap-1"><MapPin size={16} /> {home.location}</span>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-1.5 hover:bg-[var(--color-bg-card)] px-3 py-1.5 rounded-lg transition-colors"><Share size={16}/> Share</button>
          <button onClick={toggleFav} className="flex items-center gap-1.5 hover:bg-[var(--color-bg-card)] px-3 py-1.5 rounded-lg transition-colors">
            <Heart size={16} className={isFav ? "fill-[var(--color-brand)] text-[var(--color-brand)]" : ""} /> 
            {isFav ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[300px] md:h-[450px] w-full rounded-2xl overflow-hidden mb-10 shadow-sm">
        <img src={home.photoUrl} alt={home.houseName} className="w-full h-full object-cover" />
      </div>

      <div className="grid md:grid-cols-3 gap-10 lg:gap-16 relative">
        {/* Left Column */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-start pb-6 border-b border-[var(--color-border)]">
            <div>
              <h2 className="text-2xl font-bold mb-1">Hosted by {home.email.split('@')[0]}</h2>
              <p className="text-[var(--color-text-secondary)] flex items-center gap-2">
                <Users size={16} /> Up to {home.maxGuests} guests
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-brand text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
              {home.email.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="py-8 border-b border-[var(--color-border)]">
            <h3 className="text-xl font-bold mb-4">About this space</h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">{home.description}</p>
          </div>

          <div className="py-8 border-b border-[var(--color-border)]">
            <h3 className="text-xl font-bold mb-4">What this place offers</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              {home.amenities?.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                  <Check size={20} className="text-green-500" />
                  <span className="text-[var(--color-text-primary)]">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map Section */}
          {(home.latitude && home.longitude) && (
            <div className="py-8">
              <h3 className="text-xl font-bold mb-4">Where you'll be</h3>
              <p className="mb-4 text-[var(--color-text-secondary)]">{home.location}</p>
              <MapView 
                center={{ lat: home.latitude, lng: home.longitude }} 
                markers={[{ lat: home.latitude, lng: home.longitude, name: home.houseName, photoUrl: home.photoUrl }]} 
                zoom={14}
              />
            </div>
          )}
        </div>

        {/* Right Column (Sidebar) */}
        <div className="md:col-span-1">
          <div className="sticky top-28 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-card">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span className="text-2xl font-bold">₹{home.pricePerNight.toLocaleString('en-IN')}</span>
                <span className="text-[var(--color-text-secondary)]"> / night</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium">
                <Star size={14} className="fill-[var(--color-text-primary)]" /> {home.rating.toFixed(1)}
              </div>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
                <div className="flex border-b border-[var(--color-border)]">
                  <div className="p-3 w-1/2 border-r border-[var(--color-border)]">
                    <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Check-in</label>
                    <input type="date" required className="w-full text-sm bg-transparent outline-none mt-1" value={bookingData.checkIn} onChange={e => setBookingData({...bookingData, checkIn: e.target.value})} />
                  </div>
                  <div className="p-3 w-1/2">
                    <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Checkout</label>
                    <input type="date" required className="w-full text-sm bg-transparent outline-none mt-1" value={bookingData.checkOut} onChange={e => setBookingData({...bookingData, checkOut: e.target.value})} />
                  </div>
                </div>
                <div className="p-3">
                  <label className="block text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">Guests</label>
                  <select className="w-full text-sm bg-transparent outline-none mt-1" value={bookingData.guests} onChange={e => setBookingData({...bookingData, guests: e.target.value})}>
                    {[...Array(home.maxGuests || 4)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1} guest{i > 0 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button type="submit" className="w-full py-3.5 bg-gradient-brand text-white font-bold rounded-xl shadow-brand hover:shadow-brand-hover transition-shadow text-lg">
                Reserve
              </button>
            </form>

            <p className="text-center text-sm text-[var(--color-text-secondary)] mt-4">You won't be charged yet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDetailPage;
