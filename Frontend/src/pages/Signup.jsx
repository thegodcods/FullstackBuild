import React, { useState } from 'react';
import { Logo } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';

const Signup = ({ setCurrentPage }) => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg("Password dan Confirm Password tidak cocok!");
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(username, email, password, confirmPassword);

      if (result.success) {
        setSuccessMsg("Registrasi berhasil! Silakan login.");
        setUsername(''); setEmail(''); setPassword(''); setConfirmPassword('');
        setTimeout(() => setCurrentPage('login'), 2000);
      } else {
        if (result.error && result.error.errors) {
          setErrorMsg(result.error.errors.join(' | '));
        } else {
          setErrorMsg(result.error?.message || 'Registrasi gagal');
        }
      }
    } catch (error) {
      setErrorMsg("Koneksi ke server gagal. Pastikan backend berjalan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505]">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 bg-[#1a1a1a]">
        <div className="w-full max-w-[360px] flex flex-col items-center">
          
          <Logo />
          <h2 className="text-3xl font-medium text-center mt-6 mb-10">Sign up for QuickHire</h2>
          
          <form className="w-full space-y-4" onSubmit={handleRegister}>
            
            {errorMsg && <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-lg text-center">{errorMsg}</div>}
            {successMsg && <div className="bg-[#7FE252]/10 text-[#7FE252] text-sm p-3 rounded-lg text-center">{successMsg}</div>}

            <div className="space-y-1">
              <label className="text-sm text-gray-300">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username" 
                required
                className="w-full bg-[#2a2a2a] border border-transparent focus:border-[#7FE252] outline-none rounded-lg px-4 py-3 text-sm transition placeholder-gray-500" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-300">Email address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address" 
                required
                className="w-full bg-[#2a2a2a] border border-transparent focus:border-[#7FE252] outline-none rounded-lg px-4 py-3 text-sm transition placeholder-gray-500" 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm text-gray-300">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars, 1 Uppercase, 1 Number" 
                required
                className="w-full bg-[#2a2a2a] border border-transparent focus:border-[#7FE252] outline-none rounded-lg px-4 py-3 text-sm transition placeholder-gray-500" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-300">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter Password" 
                required
                className="w-full bg-[#2a2a2a] border border-transparent focus:border-[#7FE252] outline-none rounded-lg px-4 py-3 text-sm transition placeholder-gray-500" 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full text-black font-semibold py-3 rounded-full transition mt-4 text-sm ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#7FE252] hover:bg-[#6ed243]'}`}
            >
              {isLoading ? 'Creating account...' : 'Continue'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-10">
            Already have an account? <button onClick={() => setCurrentPage('login')} className="text-gray-200 hover:text-white underline underline-offset-4 decoration-white/30">Log in</button>
          </p>
        </div>
      </div>

      {/* Right Side: Visual Whirlpool */}
      <div className="hidden lg:flex w-1/2 bg-black items-center justify-center relative overflow-hidden border-l border-white/5">
        <style>{`
          @keyframes spiralSink {
            0% {
              transform: rotate(var(--angle)) translate(240px) rotate(calc(-1 * var(--angle))) scale(1.15);
              opacity: 0;
              filter: blur(1.5px);
            }
            15% {
              opacity: 0.95;
              filter: blur(0px);
            }
            70% {
              opacity: 0.6;
              filter: blur(0.5px);
            }
            100% {
              transform: rotate(calc(var(--angle) + 540deg)) translate(0px) rotate(calc(-1 * (var(--angle) + 540deg))) scale(0.1);
              opacity: 0;
              filter: blur(4px);
            }
          }
          @keyframes whirlpoolRotate {
            0% {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            100% {
              transform: translate(-50%, -50%) rotate(-360deg);
            }
          }
          .spiral-text {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -90px;
            margin-top: -12px;
            width: 180px;
            text-align: center;
            font-weight: 300;
            font-size: 1.1rem;
            color: #7FE252;
            text-shadow: 0 0 12px rgba(127, 226, 82, 0.4);
            pointer-events: none;
            transform-origin: center center;
          }
        `}</style>

        <div className="relative w-[550px] h-[550px]">
          {/* Concentric ripples (Drain Grid) */}
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="absolute top-1/2 left-1/2 border border-white/5 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                width: `${(i + 1) * 80}px`,
                height: `${(i + 1) * 80}px`,
                opacity: 0.8 - (i * 0.12),
              }}
            />
          ))}

          {/* Rotating dashed tracks */}
          <div 
            className="absolute top-1/2 left-1/2 w-[480px] h-[480px] border border-dashed border-[#7FE252]/5 rounded-full"
            style={{
              animation: 'whirlpoolRotate 25s linear infinite'
            }}
          />
          <div 
            className="absolute top-1/2 left-1/2 w-[320px] h-[320px] border border-dotted border-white/5 rounded-full"
            style={{
              animation: 'whirlpoolRotate 18s linear infinite reverse'
            }}
          />

          {/* Swirling Job Titles */}
          {[
            'Software Engineer',
            'Data Scientist',
            'ML Engineer',
            'UI/UX Designer',
            'Business Analyst',
            'Product Manager',
            'Digital Marketing',
            'Data Analyst',
            'DevOps Specialist',
            'Frontend Developer'
          ].map((title, i) => (
            <div
              key={i}
              className="spiral-text"
              style={{
                '--angle': `${i * 36}deg`,
                animation: 'spiralSink 12s linear infinite',
                animationDelay: `${i * 1.2}s`,
                opacity: 0
              }}
            >
              {title}
            </div>
          ))}

          {/* Center Black Hole / Drain */}
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-[#7FE252]/10 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#7FE252] rounded-full shadow-[0_0_20px_#7FE252] transform -translate-x-1/2 -translate-y-1/2 z-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;