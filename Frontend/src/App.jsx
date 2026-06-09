import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Ranking from './pages/Ranking';

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
      default: return <Menu setCurrentPage={setCurrentPage} />;
    }
  };

  // Logika untuk menentukan apakah Navigation (Header publik) harus ditampilkan
  // Kita Sembunyikan jika user ada di halaman: login, signup, dashboard, atau ranking
  const hidePublicNavigation = ['login', 'signup', 'dashboard', 'ranking'].includes(currentPage);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#7FE252]/30">
      
      {!hidePublicNavigation && (
        <Navigation setCurrentPage={setCurrentPage} currentPage={currentPage} />
      )}

      <main className={hidePublicNavigation ? '' : 'pt-20'}>
        {renderPage()}
      </main>

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