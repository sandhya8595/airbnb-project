import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, MapPin, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import useGeolocation from '../hooks/useGeolocation';
import MapView from '../components/map/MapView';

const AddHomePage = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { location, error: geoError, requestLocation } = useGeolocation();

  const [formData, setFormData] = useState({
    houseName: '',
    email: '',
    pricePerNight: '',
    rating: '',
    location: '',
    photoUrl: '',
    description: '',
    maxGuests: '2',
    amenities: '',
    latitude: '',
    longitude: ''
  });

  // Update form data when geolocation changes
  React.useEffect(() => {
    if (location.lat && location.lng) {
      setFormData(prev => ({
        ...prev,
        latitude: location.lat,
        longitude: location.lng
      }));
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/homes', formData);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to add listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full text-center p-10 bg-[var(--color-bg-card)] rounded-3xl border border-[var(--color-border)] shadow-lg">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">You're all set!</h2>
          <p className="text-[var(--color-text-secondary)] mb-8 text-lg">
            "{formData.houseName}" has been successfully listed and is now live for travelers.
          </p>
          <div className="space-y-3">
            <button onClick={() => navigate('/store/homes')} className="w-full py-3.5 bg-gradient-brand text-white font-bold rounded-xl shadow-brand hover:shadow-brand-hover">
              View All Listings
            </button>
            <button onClick={() => { setSuccess(false); setFormData({...formData, houseName: '', photoUrl: '', description: ''}); }} className="w-full py-3.5 border border-[var(--color-border)] font-bold rounded-xl hover:bg-[var(--color-bg-primary)] transition-colors">
              Add Another Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-6">
          <PlusCircle size={32} className="text-[var(--color-brand)]" />
        </div>
        <h1 className="text-4xl font-extrabold mb-2">List your home</h1>
        <p className="text-[var(--color-text-secondary)] text-lg">Fill in the details below to get your space listed on Airbnb</p>
      </div>

      <div className="bg-[var(--color-bg-card)] rounded-3xl border border-[var(--color-border)] p-6 sm:p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Property Name</label>
              <input type="text" name="houseName" required value={formData.houseName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] focus:outline-none focus:border-[var(--color-brand)]" placeholder="e.g. Cozy Apartment" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Contact Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] focus:outline-none focus:border-[var(--color-brand)]" placeholder="host@example.com" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Price per Night (₹)</label>
              <input type="number" name="pricePerNight" required min="100" value={formData.pricePerNight} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] focus:outline-none focus:border-[var(--color-brand)]" placeholder="2500" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Rating (0-5)</label>
              <input type="number" name="rating" required min="0" max="5" step="0.1" value={formData.rating} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] focus:outline-none focus:border-[var(--color-brand)]" placeholder="4.5" />
            </div>
          </div>

          <div className="pt-4 pb-2 border-t border-[var(--color-border)]">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin size={20}/> Location Details</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Address / City</label>
              <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] focus:outline-none focus:border-[var(--color-brand)]" placeholder="e.g. Mumbai, India" />
            </div>

            <div className="grid sm:grid-cols-2 gap-6 items-end mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Latitude</label>
                <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] focus:outline-none focus:border-[var(--color-brand)]" placeholder="28.6139" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Longitude</label>
                <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] focus:outline-none focus:border-[var(--color-brand)]" placeholder="77.2090" />
              </div>
            </div>

            <button type="button" onClick={requestLocation} className="w-full py-3 mb-4 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl font-medium hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors flex items-center justify-center gap-2">
              📍 Use Current Location
            </button>
            {geoError && <p className="text-red-500 text-sm mb-4">{geoError}</p>}

            {(formData.latitude && formData.longitude) && (
              <div className="h-[200px] rounded-xl overflow-hidden border border-[var(--color-border)]">
                <MapView 
                  center={{ lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) }} 
                  markers={[{ lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude), name: formData.houseName || 'New Property' }]}
                  height="100%"
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[var(--color-border)]">
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Photo URL</label>
              <input type="url" name="photoUrl" value={formData.photoUrl} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] focus:outline-none focus:border-[var(--color-brand)] mb-2" placeholder="https://example.com/photo.jpg" />
              {formData.photoUrl && (
                <div className="h-[200px] rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-primary)]">
                  <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] focus:outline-none focus:border-[var(--color-brand)] resize-y" placeholder="Tell guests about your space..."></textarea>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Max Guests</label>
                <input type="number" name="maxGuests" min="1" value={formData.maxGuests} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] focus:outline-none focus:border-[var(--color-brand)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Amenities</label>
                <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] focus:outline-none focus:border-[var(--color-brand)]" placeholder="WiFi, AC, Pool (comma separated)" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-brand text-white font-bold rounded-xl shadow-brand hover:shadow-brand-hover hover:-translate-y-0.5 transition-all text-lg mt-8 disabled:opacity-70">
            {loading ? 'Submitting...' : 'Submit Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHomePage;
