import React, { useState, useEffect } from 'react';
import { Settings, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminPage = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomes();
  }, []);

  const fetchHomes = async () => {
    try {
      const res = await api.get('/homes/all');
      setHomes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await api.delete(`/homes/${id}`);
        setHomes(homes.filter(h => h._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleStatus = async (home) => {
    try {
      const newStatus = home.status === 'approved' ? 'pending' : 'approved';
      const res = await api.put(`/homes/${home._id}`, { ...home, status: newStatus });
      setHomes(homes.map(h => h._id === home._id ? res.data : h));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
            <Settings size={32} className="text-gray-700 dark:text-gray-300" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-[var(--color-text-secondary)]">Manage all listings, approvals, and content</p>
        </div>
        <Link to="/host/add-home" className="px-5 py-2.5 bg-gradient-brand text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all hidden sm:block">
          + Add New Listing
        </Link>
      </div>

      <div className="bg-[var(--color-bg-card)] rounded-3xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-[var(--color-border)]">
                <th className="p-4 font-semibold text-[var(--color-text-secondary)]">Listing</th>
                <th className="p-4 font-semibold text-[var(--color-text-secondary)]">Host Email</th>
                <th className="p-4 font-semibold text-[var(--color-text-secondary)]">Price</th>
                <th className="p-4 font-semibold text-[var(--color-text-secondary)] text-center">Status</th>
                <th className="p-4 font-semibold text-[var(--color-text-secondary)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-[var(--color-text-secondary)]">Loading...</td></tr>
              ) : homes.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-[var(--color-text-secondary)]">No properties found.</td></tr>
              ) : (
                homes.map(home => (
                  <tr key={home._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img src={home.photoUrl} alt="Thumbnail" className="w-16 h-12 rounded-lg object-cover bg-gray-200" />
                        <div>
                          <p className="font-bold text-sm truncate">{home.houseName}</p>
                          <p className="text-xs text-[var(--color-text-secondary)] truncate w-48">{home.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{home.email}</td>
                    <td className="p-4 text-sm font-semibold">₹{home.pricePerNight}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleStatus(home)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer hover:opacity-80 transition-opacity ${
                          home.status === 'approved' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        }`}
                      >
                        {home.status === 'approved' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {home.status}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* 
                          Note: In a full app, Edit button would route to an Edit page.
                          For this migration, we're simplifying just showing the action buttons.
                        */}
                        <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit (Coming Soon)">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(home._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
