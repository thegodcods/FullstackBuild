import React, { useState } from 'react';
import { ArrowUpRight, ChevronDown, LogOut, Upload, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/Logo.png'; 

const Logo = () => (
  <img src={logoImage} alt="QuickHire Logo" className="w-8 h-8 object-contain rounded-sm" />
);

const Navigation = ({ setCurrentPage, currentPage }) => {
  const { isAuthenticated, user, logout, getUserInitials } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  // Sembunyikan navigasi jika di halaman login atau signup
  if (currentPage === 'login' || currentPage === 'signup') return null;

  const handleLogout = () => {
    logout();
    setCurrentPage('menu');
    setShowDropdown(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/90 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-center px-4 mt-2">
      <div className="w-full max-w-6xl mx-auto bg-[#1a1a1a] rounded-full h-12 flex items-center justify-between px-2 pr-2">
        
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer pl-2" onClick={() => setCurrentPage('menu')}>
          <div className="scale-75"><Logo /></div>
          <span className="text-lg font-semibold tracking-wide">QuickHire</span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-8 text-xs font-medium text-gray-300">
          <button className="hover:text-white transition">How It Works</button>
          <button className="hover:text-white transition">Features</button>
          <button className="hover:text-white transition">Resources</button>
          <button className="hover:text-white transition">About Us</button>
        </nav>

        {/* Auth or Profile Section */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-3 cursor-pointer border-l border-white/10 pl-4 mr-2 group relative">
              <div 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-[#7FE252] flex items-center justify-center text-black font-bold text-sm">
                  {getUserInitials()}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-medium leading-tight text-white">{user?.username || 'User'}</span>
                  <span className="text-[10px] text-gray-500">Recruiter</span>
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </div>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 top-10 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-lg z-50 w-52 py-1">
                  <button 
                    onClick={() => { setCurrentPage('dashboard'); setShowDropdown(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-[#2a2a2a] transition"
                  >
                    <Upload size={14} className="text-[#7FE252]" /> Upload CV
                  </button>
                  <button 
                    onClick={() => { setCurrentPage('ranking'); setShowDropdown(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-[#2a2a2a] transition"
                  >
                    <BarChart2 size={14} className="text-[#7FE252]" /> Dashboard Ranking
                  </button>
                  <div className="h-px bg-white/5 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-[#2a2a2a] transition"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => setCurrentPage('login')} className="text-xs font-medium text-gray-300 hover:text-white transition px-4 py-2">
                Log In
              </button>
              <button onClick={() => setCurrentPage('signup')} className="flex items-center gap-1.5 bg-[#7FE252] text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#6ed243] transition">
                Sign Up <ArrowUpRight size={14} className="text-black" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
export { Logo };