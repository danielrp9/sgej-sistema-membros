import { Users, FileCheck, TrendingUp, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-brand-dark">Resumo Geral</h2>
        <button className="bg-brand-dark text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90">
          Add Custom Widget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Estilo Dark da Referência */}
        <div className="bg-brand-dark p-6 rounded-[24px] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-widest">Membros Online</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-black">12</h3>
              <span className="text-[10px] text-brand-green font-bold mb-1">+2.3% vs last month</span>
            </div>
            <div className="mt-4 flex gap-1">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 w-1 bg-brand-green rounded-full opacity-40"></div>)}
              <div className="h-8 w-1 bg-brand-green rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Card Light */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between text-brand-muted">
            <p className="text-[10px] font-bold uppercase tracking-widest">Qualidade Documental</p>
            <ArrowUpRight size={16} />
          </div>
          <h3 className="text-3xl font-black text-brand-dark mt-2">98.2%</h3>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4">
            <div className="bg-brand-green h-full w-[98%] rounded-full"></div>
          </div>
        </div>

        {/* Card Light 2 */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
          <div className="flex justify-between text-brand-muted">
            <p className="text-[10px] font-bold uppercase tracking-widest">Total de Certificados</p>
            <FileCheck size={16} className="text-brand-green" />
          </div>
          <h3 className="text-3xl font-black text-brand-dark mt-2">1,240</h3>
          <p className="text-[10px] text-brand-green font-bold mt-2">↑ 5.1% than last year</p>
        </div>
      </div>

      {/* Seção de baixo (Tabela/Gráfico placeholder) */}
      <div className="bg-gray-50 rounded-[32px] p-8 min-h-[300px] border border-dashed border-gray-200 flex items-center justify-center">
        <p className="text-brand-muted font-bold italic">Gráficos de evolução serão renderizados aqui...</p>
      </div>
    </div>
  );
}