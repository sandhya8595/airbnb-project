import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin } from 'lucide-react';
import api from '../../services/api';

const HomeCard = ({ home }) => {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    // Check if favorited (if backend supports check without auth)
    const checkFav = async () => {
      try {
        const res = await api.get(`/favourites/check/${home._id}`);
        setIsFav(res.data.isFavorite);
      } catch (err) {
        // ignore
      }
    };
    checkFav();
  }, [home._id]);

  const toggleFav = async (e) => {
    e.preventDefault(); // prevent link navigation
    try {
      if (isFav) {
        await api.delete(`/favourites/${home._id}`);
        setIsFav(false);
      } else {
        await api.post('/favourites', { homeId: home._id });
        setIsFav(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="group relative bg-[var(--color-bg-card)] rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 border border-[var(--color-border)] cursor-pointer flex flex-col h-full">
      <Link to={`/store/homes/${home._id}`} className="flex flex-col grow">
        {/* Image */}
        <div className="relative w-full pt-[66%] overflow-hidden">
          <img 
            src={home.photoUrl} 
            alt={home.houseName} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          {home.rating >= 4.8 && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold text-gray-900 shadow-sm z-10">
              ⭐ Guest favourite
            </span>
          )}
          <button 
            onClick={toggleFav}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors z-10"
          >
            <Heart size={18} className={isFav ? "text-[var(--color-brand)]" : "text-white"} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col grow">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-[var(--color-text-primary)] text-lg truncate">{home.houseName}</h3>
            <div className="flex items-center gap-1 text-sm font-medium whitespace-nowrap">
              <Star size={14} className="fill-[var(--color-text-primary)] text-[var(--color-text-primary)]" />
              <span>{home.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] mb-3">
            <MapPin size={14} />
            <span className="truncate">{home.location}</span>
          </div>

          <div className="h-[1px] w-full bg-[var(--color-border)] my-3"></div>

          <div className="mt-auto flex items-end justify-between">
            <div>
              <span className="font-bold text-lg">₹{home.pricePerNight.toLocaleString('en-IN')}</span>
              <span className="text-[var(--color-text-secondary)] text-sm"> / night</span>
            </div>
            {home.distance !== undefined && (
              <span className="text-xs font-medium px-2 py-1 bg-[var(--color-bg-primary)] rounded-md text-[var(--color-text-secondary)]">
                {home.distance.toFixed(1)} km away
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HomeCard;
