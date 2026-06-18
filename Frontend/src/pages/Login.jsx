import React, { useState } from 'react';
import { Logo } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';

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



        <p className="text-center text-sm text-gray-400 mt-10">
          Don't have an account yet? <button onClick={() => setCurrentPage('signup')} className="text-gray-200 hover:text-white underline underline-offset-4 decoration-white/30">Sign up</button>
        </p>
      </div>
    </div>
  );
};

export default Login;