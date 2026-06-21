import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, ArrowUpRight, Clock, ShieldCheck, AlertCircle, FileText } from "lucide-react";
import { api } from '../services/api';
import { certificateService } from '../services/certificates';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, suspended: 0 });
  const [certStats, setCertStats] = useState({ total: 0, pending: 0, partial: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [membersRes, certsRes] = await Promise.all([
          api.get('/members/stats/'),
          certificateService.getStats()
        ]);
        setStats(membersRes.data);
        setCertStats(certsRes.data);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-2xl font-black text-brand-dark">Resumo Geral</h2>
        <div className="text-xs font-bold text-brand-muted uppercase tracking-widest italic opacity-50">
          Dados em tempo real • SGEJ
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card: Membros Ativos */}
        <div className="bg-brand-dark p-6 rounded-[24px] text-white shadow-xl relative overflow-hidden ring-1 ring-white/5">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-widest">Membros Ativos</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-black">{loading ? '...' : stats.active}</h3>
              <span className="text-[10px] text-brand-green font-bold mb-1">Em atividade</span>
            </div>
          </div>
          <div className="absolute right-[-10%] top-[-20%] w-40 h-40 bg-brand-green/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Card: Total na Base */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_45px_-5px_rgba(0,0,0,0.08)] flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-all duration-300">
          <div className="flex justify-between text-brand-muted">
            <p className="text-[10px] font-bold uppercase tracking-widest">Total na Base</p>
            <Users size={16} className="text-brand-dark/60 group-hover:text-brand-dark transition-colors" />
          </div>
          <h3 className="text-3xl font-black text-brand-dark mt-2">{loading ? '...' : stats.total}</h3>
        </div>

        {/* Card: Membros Suspensos */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_45px_-5px_rgba(0,0,0,0.08)] flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-all duration-300">
          <div className="flex justify-between text-brand-muted">
            <p className="text-[10px] font-bold uppercase tracking-widest">Membros Suspensos</p>
            <ArrowUpRight size={16} className="text-red-500/70 group-hover:text-red-500 transition-colors" />
          </div>
          <h3 className="text-3xl font-black text-brand-dark mt-2">{loading ? '...' : stats.suspended}</h3>
        </div>
      </div>

      {/* Seção: Fluxo de Evolução Documental */}
      <div className="bg-white rounded-[32px] p-8 border border-gray-100/90 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] space-y-6 relative overflow-hidden">
        {/* Glow corner decorativo */}
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-brand-green/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5 relative z-10">
          <div>
            <h3 className="text-lg font-black text-brand-dark uppercase tracking-tight flex items-center gap-2">
              <FileText className="text-brand-green" size={20} />
              Fluxo de Evolução Documental • {loading ? '...' : certStats.year}
            </h3>
            <p className="text-xs text-brand-muted mt-1 font-bold">
              Acompanhamento de emissões de certificados oficiais gerados no ano de {loading ? '...' : certStats.year}.
            </p>
          </div>
          <div className="bg-brand-bg rounded-2xl px-4 py-2 border border-gray-200/60 text-left md:text-right">
            <span className="text-[10px] font-black text-brand-muted uppercase tracking-wider block">
              Total Gerado no Ano
            </span>
            <span className="text-xl font-black text-brand-dark">
              {loading ? '...' : certStats.total}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Gráfico Radial de Conclusão */}
          <div className="flex flex-col items-center justify-center bg-gray-50/50 rounded-3xl p-6 border border-gray-100/80 shadow-inner relative overflow-hidden">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* SVG Radial Progress */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="56"
                  className="text-gray-200"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="56"
                  className="text-brand-green transition-all duration-1000 ease-out"
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 56}
                  strokeDashoffset={
                    2 * Math.PI * 56 * (1 - (certStats.total > 0 ? certStats.approved / certStats.total : 0))
                  }
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-brand-dark">
                  {certStats.total > 0
                    ? `${Math.round((certStats.approved / certStats.total) * 100)}%`
                    : '0%'}
                </span>
                <span className="text-[9px] font-black text-brand-muted uppercase tracking-widest leading-none mt-1">
                  Emitidos
                </span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className="text-[10px] font-black text-brand-muted uppercase tracking-wider">
                Índice de Conclusão ({loading ? '...' : certStats.year})
              </span>
              <p className="text-[11px] font-bold text-gray-500 mt-1 max-w-[200px] leading-relaxed">
                Porcentagem de certificados deste ano que foram totalmente assinados e emitidos oficialmente.
              </p>
            </div>
          </div>

          {/* Cards de Métricas Detalhadas */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Parcial */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_35px_-6px_rgba(0,0,0,0.06)] hover:border-blue-200 transition-all flex flex-col justify-between group">
              <div className="flex justify-between items-start">
                <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <FileText size={20} />
                </div>
                <span className="text-2xl font-black text-brand-dark">
                  {loading ? '...' : certStats.partial}
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-black text-brand-dark uppercase tracking-wide">Assinados Parcialmente</h4>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed font-bold">
                  Documentos que estão no fluxo de validação (possuem 1 ou 2 assinaturas coletadas).
                </p>
              </div>
            </div>

            {/* Aprovado */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_35px_-6px_rgba(0,0,0,0.06)] hover:border-brand-green/20 transition-all flex flex-col justify-between group">
              <div className="flex justify-between items-start">
                <div className="bg-brand-green/10 text-brand-green p-2.5 rounded-xl group-hover:bg-brand-green/20 transition-colors">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-2xl font-black text-brand-dark">
                  {loading ? '...' : certStats.approved}
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-black text-brand-dark uppercase tracking-wide">Emitidos & Válidos</h4>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed font-bold">
                  Documentos com as 3 assinaturas coletadas. Possuem selo de autenticidade ativo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}