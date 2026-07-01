import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const BookingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    homeId: state?.homeId || '',
    guestName: '',
    guestEmail: '',
    checkIn: state?.checkIn || '',
    checkOut: state?.checkOut || '',
    guests: state?.guests || 1
  });

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const res = await api.get('/homes');
        setHomes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHomes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/reservations', formData);
      setSuccess(true);
    } catch (err) {
      alert('Failed to complete booking.');
      console.error(err);
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
          <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
          <p className="text-[var(--color-text-secondary)] mb-8 text-lg">
            Your reservation has been received. We'll send a confirmation email shortly.
          </p>
          <button onClick={() => navigate('/store/reserved')} className="w-full py-3.5 bg-gradient-brand text-white font-bold rounded-xl shadow-brand hover:shadow-brand-hover">
            View My Reservations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Confirm Booking</h1>
        <p className="text-[var(--color-text-secondary)]">Review details and complete your reservation</p>
      </div>

      <div className="bg-[var(--color-bg-card)] rounded-3xl border border-[var(--color-border)] p-6 sm:p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 pb-6 border-b border-[var(--color-border)]">
            <h3 className="font-bold text-lg mb-4">Guest Information</h3>
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input type="text" name="guestName" required value={formData.guestName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] focus:outline-none focus:border-[var(--color-brand)]" placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <input type="email" name="guestEmail" required value={formData.guestEmail} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] focus:outline-none focus:border-[var(--color-brand)]" placeholder="you@example.com" />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-lg mb-4">Trip Details</h3>
            <div>
              <label className="block text-sm font-semibold mb-2">Select Home</label>
              <select name="homeId" required value={formData.homeId} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] focus:outline-none focus:border-[var(--color-brand)]">
                <option value="">Choose a listing...</option>
                {homes.map(h => (
                  <option key={h._id} value={h._id}>{h.houseName} — ₹{h.pricePerNight}/night</option>
                ))}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Check-in</label>
                <input type="date" name="checkIn" required value={formData.checkIn} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] focus:outline-none focus:border-[var(--color-brand)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Check-out</label>
                <input type="date" name="checkOut" required value={formData.checkOut} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] focus:outline-none focus:border-[var(--color-brand)]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Number of Guests</label>
              <input type="number" name="guests" required min="1" max="20" value={formData.guests} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] focus:outline-none focus:border-[var(--color-brand)]" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 mt-4 bg-gradient-brand text-white font-bold rounded-xl shadow-brand hover:shadow-brand-hover transition-shadow text-lg">
            {loading ? 'Processing...' : 'Confirm Reservation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
