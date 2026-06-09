import React, { useState } from 'react';
import { Logo } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const Login = ({ setCurrentPage }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const result = await login(email, password);
      
      if (result.success) {
        setSuccessMsg("Login Berhasil! Mengarahkan ke Dashboard...");
        setTimeout(() => {
          setCurrentPage('dashboard');
        }, 1500);
      } else {
        if (result.error && result.error.errors) {
          setErrorMsg(result.error.errors.join(', '));
        } else {
          setErrorMsg(result.error?.message || 'Login gagal');
        }
      }
    } catch (error) {
      setErrorMsg("Koneksi ke server gagal. Pastikan backend berjalan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#050505]">
      <div className="w-full max-w-[360px] flex flex-col items-center">
        
        <Logo />
        <h2 className="text-3xl font-medium text-center mt-6 mb-10">Log in to QuickHire</h2>
        
        <form className="w-full space-y-5" onSubmit={handleLogin}>
          
          {/* Menampilkan pesan error dari backend */}
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-2 rounded-lg text-center">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-[#7FE252]/10 border border-[#7FE252]/50 text-[#7FE252] text-sm px-4 py-2 rounded-lg text-center animate-fadeIn">
              {successMsg}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm text-gray-200">Email address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address" 
              required
              className="w-full bg-[#121212] border border-white/10 focus:border-[#7FE252] outline-none rounded-lg px-4 py-3 text-sm transition placeholder-gray-600" 
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm text-gray-200">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password" 
              required
              className="w-full bg-[#121212] border border-white/10 focus:border-[#7FE252] outline-none rounded-lg px-4 py-3 text-sm transition placeholder-gray-600" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-black font-semibold py-3 rounded-full transition mt-2 text-sm ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#7FE252] hover:bg-[#6ed243]'}`}
          >
            {isLoading ? 'Processing...' : 'Continue'}
          </button>
        </form>

        <div className="flex items-center gap-4 w-full my-6">
          <div className="h-px bg-white/10 flex-grow"></div>
          <span className="text-xs text-gray-500">Or</span>
          <div className="h-px bg-white/10 flex-grow"></div>
        </div>

        <button className="w-full bg-transparent border border-white/20 text-white font-medium py-3 rounded-full hover:bg-white/5 transition flex items-center justify-center gap-3 text-sm">
          <GoogleIcon /> Continue with Google
        </button>

        <p className="text-center text-sm text-gray-400 mt-10">
          Don't have an account yet? <button onClick={() => setCurrentPage('signup')} className="text-gray-200 hover:text-white underline underline-offset-4 decoration-white/30">Sign up</button>
        </p>
      </div>
    </div>
  );
};

export default Login;