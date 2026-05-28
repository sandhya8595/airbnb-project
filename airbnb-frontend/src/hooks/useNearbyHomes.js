import { useState, useEffect } from 'react';
import api from '../services/api';

const useNearbyHomes = (lat, lng, radius = 50) => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const fetchNearby = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/homes/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
        setHomes(res.data);
      } catch (err) {
        setError('Failed to fetch nearby homes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNearby();
  }, [lat, lng, radius]);

  return { homes, loading, error };
};

export default useNearbyHomes;
