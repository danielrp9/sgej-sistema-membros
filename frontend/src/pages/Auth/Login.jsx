import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api'; 

import logoImg from '../../assets/nexstep-logo.png';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login/', {
        email,
        password
      });

      // Captura o token e o dicionário de dados do usuário enviado pelo Django
      const { access, user } = response.data;
      
      localStorage.setItem("@SGEJ:token", access);
      if (user && user.role) {
        localStorage.setItem("@SGEJ:user_role", user.role);
        localStorage.setItem("@SGEJ:user", JSON.stringify(user));
      }
      
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError('Credenciais inválidas ou erro de conexão.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#111315] p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-brand-green/5 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-[360px] z-10 animate-in fade-in zoom-in duration-700">
        <div className="bg-[#1A1D1F] border border-white/5 p-8 rounded-[32px] shadow-2xl relative backdrop-blur-xl">
          
          <div 
            onClick={() => navigate('/')} 
            className="text-center mb-8 cursor-pointer group select-none"
            title="Voltar para a página inicial"
          >
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img 
                src={logoImg} 
                alt="NextStep Logo" 
                className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(0,135,90,0.4)]"
              />
            </div>
            <h1 className="text-xl font-nasa text-white tracking-[0.2em] group-hover:text-brand-green transition-colors duration-300">NextStep</h1>
            <p className="text-gray-500 text-[9px] mt-2 font-black uppercase tracking-[0.3em] opacity-40 group-hover:opacity-60 transition-opacity duration-300">Management Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="text-red-500 text-center text-[10px] font-bold uppercase tracking-tighter">{error}</div>}
            
            <div className="space-y-1 px-1">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest opacity-60">Corporative ID</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="daniel.pereira@nextstep.com" 
                className="w-full bg-[#111315] border border-white/5 rounded-2xl p-3.5 text-white text-xs outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green/40 transition-all"
                required
              />
            </div>

            <div className="space-y-1 px-1">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest opacity-60">Security Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-[#111315] border border-white/5 rounded-2xl p-3.5 text-white text-xs outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green/40 transition-all"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green hover:bg-brand-green/90 text-white py-3.5 mt-2 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Autorizando...' : 'Autorizar Acesso'}
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="mt-4 px-1">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400 hover:text-white py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft size={12} />
              Voltar para a Página Social
            </button>
          </div>
     
          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-[8px] text-gray-700 font-bold uppercase tracking-[0.4em]">UFVJM • EJ NextStep</p>
          </div>
        </div>
      </div>
    </div>
  );
}