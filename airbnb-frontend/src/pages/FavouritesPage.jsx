import React, { useState, useEffect } from 'react';
import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import HomeCard from '../components/ui/HomeCard';

const FavouritesPage = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavs = async () => {
      try {
        const res = await api.get('/favourites');
        setHomes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavs();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Heart className="fill-[var(--color-brand)] text-[var(--color-brand)]" size={28} />
          Your Favorites
        </h1>
        <p className="text-[var(--color-text-secondary)]">{homes.length} saved listing{homes.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="skeleton-box h-72 rounded-2xl"></div>)}
        </div>
      ) : homes.length === 0 ? (
        <div className="text-center py-24 bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)] max-w-2xl mx-auto">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-2xl font-bold mb-2">No favorites yet</h3>
          <p className="text-[var(--color-text-secondary)] mb-6">Start exploring and save homes you love!</p>
          <Link to="/store/homes" className="px-6 py-3 bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] font-semibold rounded-xl inline-block">
            Browse Homes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {homes.map(home => (
            <HomeCard key={home._id} home={home} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;
