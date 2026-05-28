import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import HomePage from './pages/HomePage';
import HomeListPage from './pages/HomeListPage';
import HomeDetailPage from './pages/HomeDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AddHomePage from './pages/AddHomePage';
import FavouritesPage from './pages/FavouritesPage';
import ReservedPage from './pages/ReservedPage';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';
// Layout
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-300">
            <Navbar />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/store/homes" element={<HomeListPage />} />
                <Route path="/store/homes/:id" element={<HomeDetailPage />} />
                <Route path="/store/favorites" element={<FavouritesPage />} />
                <Route path="/store/reserved" element={<ReservedPage />} />
                <Route path="/store/booking" element={<BookingPage />} />
                <Route path="/host/add-home" element={<AddHomePage />} />
                <Route path="/admin/homes" element={<AdminPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                {/* 404 Route */}
                <Route path="*" element={<div className="text-center py-20"><h1 className="text-4xl font-bold">404 - Not Found</h1></div>} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
