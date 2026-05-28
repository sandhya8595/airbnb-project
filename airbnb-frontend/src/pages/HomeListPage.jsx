import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import api from '../services/api';
import HomeCard from '../components/ui/HomeCard';

const HomeListPage = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const res = await api.get('/homes');
        setHomes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomes();
  }, []);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'budget', label: 'Budget (Under ₹3000)' },
    { id: 'mid', label: 'Mid-range' },
    { id: 'luxury', label: 'Luxury (₹5000+)' },
    { id: 'top', label: '⭐ Top Rated' },
  ];

  const filteredHomes = useMemo(() => {
    return homes.filter(home => {
      const matchSearch = home.houseName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          home.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchFilter = true;
      if (activeFilter === 'budget') matchFilter = home.pricePerNight < 3000;
      else if (activeFilter === 'mid') matchFilter = home.pricePerNight >= 3000 && home.pricePerNight < 5000;
      else if (activeFilter === 'luxury') matchFilter = home.pricePerNight >= 5000;
      else if (activeFilter === 'top') matchFilter = home.rating >= 4.8;

      return matchSearch && matchFilter;
    });
  }, [homes, searchQuery, activeFilter]);

  return (
    <div>
      {/* Header & Filters */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Homes</h1>
        <p className="text-[var(--color-text-secondary)] mb-6">Browse {homes.length} listings from hosts around the world</p>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or location..." 
              className="w-full pl-12 pr-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-full focus:outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  activeFilter === filter.id
                    ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] border-[var(--color-text-primary)]'
                    : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-text-primary)]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="skeleton-box h-72 rounded-2xl"></div>)}
        </div>
      ) : filteredHomes.length === 0 ? (
        <div className="text-center py-20 bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)]">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold mb-2">No homes found</h3>
          <p className="text-[var(--color-text-secondary)]">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHomes.map(home => (
            <HomeCard key={home.id} home={home} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeListPage;
