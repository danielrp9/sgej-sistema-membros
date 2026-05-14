import React, { useEffect, useState } from 'react';
import { Users, FileCheck, TrendingUp, ArrowUpRight } from "lucide-react";
import { api } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, suspended: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await api.get('/members/stats/');
        setStats(response.data);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-brand-dark">Resumo Geral</h2>
        <div className="text-xs font-bold text-brand-muted uppercase tracking-widest italic opacity-50">
          Dados em tempo real • SGEJ
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-dark p-6 rounded-[24px] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-widest">Membros Ativos</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-black">{loading ? '...' : stats.active}</h3>
              <span className="text-[10px] text-brand-green font-bold mb-1">Online</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between text-brand-muted">
            <p className="text-[10px] font-bold uppercase tracking-widest">Total na Base</p>
            <Users size={16} />
          </div>
          <h3 className="text-3xl font-black text-brand-dark mt-2">{loading ? '...' : stats.total}</h3>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
          <div className="flex justify-between text-brand-muted">
            <p className="text-[10px] font-bold uppercase tracking-widest">Membros Suspensos</p>
            <ArrowUpRight size={16} className="text-red-500" />
          </div>
          <h3 className="text-3xl font-black text-brand-dark mt-2">{loading ? '...' : stats.suspended}</h3>
        </div>
      </div>

      <div className="bg-gray-50 rounded-[32px] p-8 min-h-[300px] border border-dashed border-gray-200 flex flex-col items-center justify-center">
        <FileCheck className="text-gray-300 mb-4" size={48} />
        <p className="text-brand-muted font-bold italic">Gráficos de evolução documental em desenvolvimento...</p>
      </div>
    </div>
  );
}