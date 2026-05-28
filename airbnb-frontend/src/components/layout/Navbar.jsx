import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import { Menu, X, Search, Heart, Calendar, PlusCircle, LogOut, User, Compass, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Explore', path: '/', icon: <Compass size={18} /> },
    { name: 'All Homes', path: '/store/homes', icon: <Search size={18} /> },
    { name: 'Favorites', path: '/store/favorites', icon: <Heart size={18} /> },
    { name: 'Reserved', path: '/store/reserved', icon: <Calendar size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-nav border-b border-[var(--color-border)] px-4 sm:px-10 h-20 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-[var(--color-brand)] group-hover:scale-110 transition-transform">
          <path d="M16 1C7.7 1 1 7.7 1 16s6.7 15 15 15 15-6.7 15-15S24.3 1 16 1zm6.1 22.3c-1.2 1.8-3.1 2.8-5.1 2.8s-3.9-1-5.1-2.8c-2.7-4-4.1-8.3-4.1-12.3 0-2.5 1.1-4.3 2.8-4.3 1.5 0 2.7 1.5 3.2 3.8.4 1.9.7 3.9.7 5.8 0 1.5-.3 3-.9 4.3-.3.7-.2 1.5.4 2 .6.5 1.4.5 2 0 .6-.5.7-1.3.4-2-.6-1.3-.9-2.8-.9-4.3 0-1.9.3-3.9.7-5.8.5-2.3 1.7-3.8 3.2-3.8 1.7 0 2.8 1.8 2.8 4.3 0 4-1.4 8.3-4.1 12.3z"/>
        </svg>
        <span className="text-xl font-extrabold text-gradient hidden sm:block">airbnb</span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-2">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
              ${isActive(link.path) 
                ? 'bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-sm border border-[var(--color-border)]' 
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-text-primary)]'
              }
            `}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/admin/homes" title="Admin Panel" className="p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] transition-colors">
                <Settings size={20} />
              </Link>
              <button onClick={handleLogout} className="p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] transition-colors" title="Logout">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] transition-all">
              <User size={18} />
              Log In
            </Link>
          )}
          
          <Link to="/host/add-home" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-brand shadow-brand hover:shadow-brand-hover hover:-translate-y-[1px] transition-all duration-200">
            <PlusCircle size={18} />
            <span className="hidden lg:inline">Become a Host</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-[var(--color-text-primary)]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 right-0 glass-nav border-b border-[var(--color-border)] shadow-lg flex flex-col p-4 gap-2 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-lg ${isActive(link.path) ? 'bg-red-50 text-[var(--color-brand)] dark:bg-[var(--color-brand-dark)] dark:bg-opacity-20' : 'text-[var(--color-text-primary)]'}`}
            >
              {link.icon}
              <span className="font-medium">{link.name}</span>
            </Link>
          ))}
          <div className="h-[1px] bg-[var(--color-border)] my-2"></div>
          {user ? (
             <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-3 p-3 rounded-lg text-[var(--color-text-primary)]">
               <LogOut size={18} />
               <span className="font-medium">Log Out</span>
             </button>
          ) : (
             <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg text-[var(--color-text-primary)]">
               <User size={18} />
               <span className="font-medium">Log In</span>
             </Link>
          )}
          <Link to="/host/add-home" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 mt-4 p-3 rounded-xl bg-gradient-brand text-white font-semibold shadow-brand">
             <PlusCircle size={18} />
             Become a Host
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
