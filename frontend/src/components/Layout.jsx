import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Bell, Search } from "lucide-react";

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#111315] overflow-hidden">
      {/* Sidebar com z-index controlado */}
      <div className="relative z-20">
        <Sidebar />
      </div>

      <div className="flex-1 p-3 flex flex-col min-w-0 overflow-hidden">
        <div className="h-full bg-white rounded-[32px] overflow-hidden flex flex-col shadow-2xl relative">
          
          {/* Top Bar Interna */}
          <header className="px-8 py-6 flex items-center justify-between border-b border-gray-50 shrink-0 relative z-10">
            <h2 className="text-xl font-bold text-brand-dark uppercase tracking-tight">NextStep Dashboard</h2>
            <div className="flex items-center gap-4">
              <div className="relative group hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search for..." 
                  className="bg-gray-100 border-none rounded-lg py-2 pl-10 pr-4 text-xs outline-none focus:ring-2 focus:ring-brand-green/20 transition-all" 
                />
              </div>
              <button className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                <Bell size={18} />
              </button>
              
              {/* Perfil Dinâmico (Placeholder corrigido) */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center font-bold border-2 border-white shadow-sm">
                  D
                </div>
              </div>
            </div>
          </header>

          {/* Área de Conteúdo - Onde corrigimos o clique */}
          <main className="flex-1 overflow-y-auto p-10 custom-scrollbar relative z-0">
            <div className="relative pointer-events-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}