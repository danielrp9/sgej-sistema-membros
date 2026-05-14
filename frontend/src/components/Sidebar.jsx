import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, Users, FileCheck, LogOut, Settings, ShieldCheck } from "lucide-react";

// ✅ CORREÇÃO: Importando a logo corretamente do diretório de assets
import logoImg from '../assets/nexstep-logo.png';

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/", icon: LayoutGrid },
    { name: "Membros", path: "/members", icon: Users },
    { name: "Assinaturas", path: "/audit", icon: ShieldCheck },
    // { name: "Certificados", path: "/certificates", icon: FileCheck },
  ];

  return (
    <aside className="w-64 flex flex-col p-6 h-screen bg-[111315] text-white border-r border-white/5">
      {/* Brand - Logo + Fonte NASA */}
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 flex items-center justify-center">
          <img 
            src={logoImg} // ✅ Utilizando a imagem importada
            alt="NextStep Logo" 
            className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(0,135,90,0.3)]"
          />
        </div>
        <span className="text-base font-nasa text-white pt-1 tracking-widest">
          NextStep
        </span>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 space-y-2">
        <p className="text-[10px] font-black text-gray-600 tracking-[0.2em] px-5 mb-4 uppercase opacity-50">
          Main Interface
        </p>
        
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive 
                ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10 font-bold' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon 
                size={20} 
                className={`transition-colors ${isActive ? "text-brand-green" : "group-hover:text-brand-green"}`} 
              />
              <span className="text-sm tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer da Sidebar - Opções de Usuário */}
      <div className="pt-6 border-t border-white/5 space-y-1">
        <Link 
          to="/settings" 
          className="flex items-center gap-3 px-5 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
        >
          <Settings size={20} />
          <span className="text-sm font-medium">Configurações</span>
        </Link>
        
        <button 
          onClick={() => { 
            localStorage.removeItem("@SGEJ:token"); 
            window.location.reload(); 
          }}
          className="w-full flex items-center gap-3 px-5 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Encerrar Sessão</span>
        </button>

        <div className="mt-4 px-5">
          <p className="text-[8px] font-bold text-gray-700 uppercase tracking-[0.3em]">
            SGEJ v1.0 • NextStep Tech
          </p>
        </div>
      </div>
    </aside>
  );
}