import React, { useState, useEffect } from 'react';
import { Calendar, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ReservedPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get('/reservations');
        setReservations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Calendar size={28} className="text-[var(--color-text-primary)]" />
          Your Reservations
        </h1>
        <p className="text-[var(--color-text-secondary)]">{reservations.length} upcoming trip{reservations.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2].map(i => <div key={i} className="skeleton-box h-40 rounded-2xl"></div>)}
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-24 bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)] max-w-2xl mx-auto">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-2xl font-bold mb-2">No reservations yet</h3>
          <p className="text-[var(--color-text-secondary)] mb-6">When you book a stay, it will appear here.</p>
          <Link to="/store/homes" className="px-6 py-3 bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] font-semibold rounded-xl inline-block">
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {reservations.map(res => (
            <div key={res._id} className="flex flex-col md:flex-row bg-[var(--color-bg-card)] rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-full md:w-64 h-48 md:h-auto bg-gray-200 shrink-0 relative">
                {res.home ? (
                  <img src={res.home.photoUrl} alt="Home" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🏠</div>
                )}
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{res.home ? res.home.houseName : `Home #${res.homeId}`}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      res.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      res.status === 'pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {res.status}
                    </span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] mb-1">
                    <span className="font-medium">Dates:</span> {res.checkIn} → {res.checkOut}
                  </p>
                  <p className="text-[var(--color-text-secondary)] mb-4">
                    <span className="font-medium">Guests:</span> {res.guests} guest{res.guests > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex justify-between items-center">
                  <p className="text-sm text-[var(--color-text-secondary)]">Total (INR)</p>
                  <p className="text-xl font-bold">₹{res.totalPrice?.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservedPage;
