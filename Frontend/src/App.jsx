import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Ranking from './pages/Ranking';

import HowItWorks from './pages/HowItWorks';
import Features from './pages/Features';
import AboutUs from './pages/AboutUs';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('menu');

  // Simple Router
  const renderPage = () => {
    switch (currentPage) {
      case 'menu': return <Menu setCurrentPage={setCurrentPage} />;
      case 'login': return <Login setCurrentPage={setCurrentPage} />;
      case 'signup': return <Signup setCurrentPage={setCurrentPage} />;
      case 'dashboard': return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'ranking': return <Ranking setCurrentPage={setCurrentPage} />;
      case 'how-it-works': return <HowItWorks setCurrentPage={setCurrentPage} />;
      case 'features': return <Features setCurrentPage={setCurrentPage} />;
      case 'about-us': return <AboutUs setCurrentPage={setCurrentPage} />;
      default: return <Menu setCurrentPage={setCurrentPage} />;
    }
  };

  // Logika untuk menentukan apakah Navigation (Header publik) harus ditampilkan
  // Kita Sembunyikan jika user ada di halaman: login, signup, dashboard, atau ranking
  const hidePublicNavigation = ['login', 'signup', 'dashboard', 'ranking'].includes(currentPage);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#7FE252]/30 flex flex-col">
      
      {!hidePublicNavigation && (
        <Navigation setCurrentPage={setCurrentPage} currentPage={currentPage} />
      )}

      <main className={hidePublicNavigation ? 'flex-grow' : 'pt-20 flex-grow'}>
        {renderPage()}
      </main>

      {!hidePublicNavigation && (
        <footer className="w-full border-t border-white/5 bg-[#0a0a0a] py-8 mt-auto flex items-center justify-center">
          <div className="w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <div>
              <span>© {new Date().getFullYear()} QuickHire. All rights reserved.</span>
            </div>
            <div className="flex gap-6 font-medium">
              <button onClick={() => setCurrentPage('how-it-works')} className="hover:text-white transition">How It Works</button>
              <button onClick={() => setCurrentPage('features')} className="hover:text-white transition">Features</button>
              <button onClick={() => setCurrentPage('about-us')} className="hover:text-white transition">About Us</button>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}