import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, MapPin } from 'lucide-react';
import api from '../services/api';
import HomeCard from '../components/ui/HomeCard';
import useGeolocation from '../hooks/useGeolocation';
import useNearbyHomes from '../hooks/useNearbyHomes';
import MapView from '../components/map/MapView';

const HomePage = () => {
  const [featuredHomes, setFeaturedHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { location, error: geoError, loading: geoLoading, requestLocation } = useGeolocation();
  const { homes: nearbyHomes, loading: nearbyLoading } = useNearbyHomes(location.lat, location.lng);

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const res = await api.get('/homes');
        // Show top 6 homes on homepage
        setFeaturedHomes(res.data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomes();
  }, []);

  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 dark:bg-red-900/20 text-[var(--color-brand)] rounded-full text-sm font-semibold mb-6 shadow-sm border border-red-100 dark:border-red-800/30">
          <Sparkles size={16} />
          Discover unique stays
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Find your <span className="text-gradient">perfect stay</span>
        </h1>
        <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
          Book unique homes, apartments, and experiences from local hosts around the world.
        </p>
        <Link to="/store/homes" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-brand text-white font-bold rounded-2xl shadow-brand hover:shadow-brand-hover hover:-translate-y-1 transition-all text-lg w-full sm:w-auto">
          <Compass size={20} />
          Explore Homes
        </Link>
      </section>

      {/* Featured Listings */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Featured Places</h2>
            <p className="text-[var(--color-text-secondary)]">Highly rated stays handpicked for you</p>
          </div>
          <Link to="/store/homes" className="hidden sm:block text-[var(--color-brand)] font-semibold hover:underline">
            View all
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-box h-80 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHomes.map(home => (
              <HomeCard key={home.id} home={home} />
            ))}
          </div>
        )}
      </section>

      {/* Nearby Feature */}
      <section className="bg-[var(--color-bg-card)] rounded-3xl p-6 md:p-10 border border-[var(--color-border)] shadow-sm mt-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Find Stays Near You</h2>
            <p className="text-[var(--color-text-secondary)] mb-8 text-lg">
              Allow location access to instantly discover beautiful properties within driving distance for a quick weekend getaway.
            </p>
            
            {!location.lat ? (
              <button 
                onClick={requestLocation}
                disabled={geoLoading}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                {geoLoading ? 'Detecting...' : '📍 Use My Location'}
              </button>
            ) : nearbyLoading ? (
              <p className="text-[var(--color-brand)] font-medium animate-pulse">Searching for nearby homes...</p>
            ) : nearbyHomes.length > 0 ? (
              <div className="space-y-4">
                <p className="font-semibold text-green-600 dark:text-green-400">Found {nearbyHomes.length} properties nearby!</p>
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                  {nearbyHomes.slice(0, 2).map(home => (
                    <Link key={home.id} to={`/store/homes/${home.id}`} className="min-w-[200px] border border-[var(--color-border)] rounded-lg p-3 hover:border-[var(--color-brand)] transition-colors block">
                      <p className="font-bold truncate">{home.houseName}</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">{home.distance.toFixed(1)} km away</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-orange-500 font-medium">No properties found within 50km of your location.</p>
            )}
            {geoError && <p className="text-red-500 mt-2 text-sm">{geoError}</p>}
          </div>
          
          <div className="h-[300px] md:h-[400px] bg-[var(--color-bg-primary)] rounded-2xl overflow-hidden border border-[var(--color-border)] relative">
            {location.lat ? (
              <MapView 
                center={{ lat: location.lat, lng: location.lng }}
                userLocation={location}
                markers={nearbyHomes.map(h => ({ lat: h.latitude, lng: h.longitude, name: h.houseName, id: h.id, price: h.pricePerNight, photoUrl: h.photoUrl }))}
                height="100%"
                zoom={10}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80" alt="Map preview" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <MapPin size={24} className="text-[var(--color-brand)]" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Map View</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] max-w-xs">Share your location to see a map of nearby properties.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
