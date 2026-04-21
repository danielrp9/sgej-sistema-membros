import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("@SGEJ:token", "autenticado-experimental-nextstep");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#111315] p-4 relative overflow-hidden">
      {/* Glow Effects de Fundo */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-brand-green/5 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-[420px] z-10 animate-in fade-in zoom-in duration-700">
        <div className="bg-[#1A1D1F] border border-white/5 p-12 rounded-[48px] shadow-2xl relative backdrop-blur-xl">
          
          {/* Logo + Fonte NASA */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center transition-transform hover:scale-110 duration-500">
              <img 
                src="/nexstep-logo.png" 
                alt="NextStep Logo" 
                className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(0,135,90,0.4)]"
              />
            </div>
            <h1 className="text-2xl font-nasa text-white tracking-[0.2em]">
              NextStep
            </h1>
            <p className="text-gray-500 text-[10px] mt-3 font-black uppercase tracking-[0.3em] opacity-40">
              Management Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 px-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-60">Corporative ID</label>
              <input 
                type="text" 
                placeholder="daniel.pereira@nextstep.com" 
                className="w-full bg-[#111315] border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green/40 transition-all placeholder:text-gray-800"
              />
            </div>

            <div className="space-y-2 px-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-60">Security Key</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-[#111315] border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green/40 transition-all placeholder:text-gray-800"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-brand-green hover:bg-brand-green/90 text-white py-4 mt-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-brand-green/10 active:scale-[0.98] transition-all group"
            >
              Authorize Access
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-[9px] text-gray-700 font-bold uppercase tracking-[0.4em]">
              UFVJM • EJ NextStep Tech
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}