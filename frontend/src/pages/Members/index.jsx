import React from 'react';
import { Plus, Search, Filter, MoreVertical, UserCheck } from "lucide-react";

export default function Members() {
  const members = [
    { id: 1, name: "Matheus Silva", role: "Gerente de Processos", status: "Ativo", date: "12/06/2026" },
    { id: 2, name: "Carlos Eduardo", role: "Dev Back-end", status: "Ativo", date: "11/06/2026" },
    { id: 3, name: "Leonardo Lima", role: "Intern", status: "Inativo", date: "09/06/2026" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">Gestão de Membros</h1>
          <p className="text-xs text-brand-muted mt-1 font-medium italic">Visualize e gerencie todos os colaboradores da NextStep.</p>
        </div>
        <button className="bg-brand-green text-white px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg shadow-brand-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <Plus size={16} /> Adicionar Membro
        </button>
      </div>

      {/* Tabela Estilo Clean */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-green transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou cargo..." 
              className="w-full bg-gray-50/50 border-none rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-brand-green/5 transition-all" 
            />
          </div>
          <button className="p-3 bg-gray-50 rounded-xl text-gray-500 hover:bg-brand-green-light hover:text-brand-green transition-all">
            <Filter size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] border-b border-gray-50">
                <th className="px-8 py-5 text-center w-20">#</th>
                <th className="px-8 py-5 text-center">NOME</th>
                <th className="px-8 py-5 text-center">CARGO</th>
                <th className="px-8 py-5 text-center">STATUS</th>
                <th className="px-8 py-5 text-center">INGRESSO</th>
                <th className="px-8 py-5 text-center">AÇÃO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="w-10 h-10 rounded-full bg-brand-green-light flex items-center justify-center text-brand-green font-black text-xs">
                      {m.name.charAt(0)}
                    </div>
                  </td>
                  <td className="px-8 py-5 font-bold text-brand-dark text-sm">{m.name}</td>
                  <td className="px-8 py-5 text-brand-muted text-xs font-medium">{m.role}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      m.status === 'Ativo' ? 'bg-brand-green-light text-brand-green' : 'bg-red-50 text-red-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${m.status === 'Ativo' ? 'bg-brand-green' : 'bg-red-500'}`} />
                      {m.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-brand-muted text-xs font-medium">{m.date}</td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-brand-dark transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-gray-50/30 border-t border-gray-50 flex justify-between items-center">
          <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Exibindo {members.length} membros</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-100 rounded-lg text-[10px] font-black hover:bg-gray-50 transition-colors">Anterior</button>
            <button className="px-4 py-2 bg-white border border-gray-100 rounded-lg text-[10px] font-black hover:bg-gray-50 transition-colors">Próximo</button>
          </div>
        </div>
      </div>
    </div>
  );
}