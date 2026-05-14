import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Loader2, Eye, UserMinus, ExternalLink, FileCheck } from "lucide-react";
import { memberService } from '../../services/members';
import AddMemberModal from './AddMemberModal';

export default function Members() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [activeMenu, setActiveMenu] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const loadMembers = async (query = '') => {
    setLoading(true);
    try {
      const response = await memberService.getMembers({ search: query });
      setMembers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar membros:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => loadMembers(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleTerminate = async (id, name) => {
    // Mensagem clara sobre a geração automática baseada em 6h/semanais
    const confirmMessage = `Deseja encerrar as atividades de ${name}?\n\nO sistema calculará automaticamente a carga horária (6h/semanais) e gerará o rascunho do certificado para assinatura do orientador.`;
    
    if (window.confirm(confirmMessage)) {
      setLoadingId(id);
      setActiveMenu(null);
      try {
        // Dispara o POST para o Django realizar o cálculo e criar o registro de certificado
        await memberService.terminateMember(id);
        alert("Sucesso! Atividades encerradas e certificado enviado para a Central de Assinaturas.");
        loadMembers(search); 
      } catch (error) {
        console.error("Erro ao encerrar:", error);
        alert("Erro ao processar encerramento. Verifique se o membro já possui um certificado pendente.");
      } finally {
        setLoadingId(null);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight uppercase font-nasa">
            Gestão de Membros
          </h1>
          <p className="text-xs text-brand-muted mt-1 font-medium italic">
            Base de dados operacional • NextStep Tech
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/audit')}
            className="bg-white text-brand-dark border border-gray-100 px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
          >
            <FileCheck size={16} className="text-brand-green" /> Ver Auditoria
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-green text-white px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg shadow-brand-green/20 hover:scale-[1.02] transition-all"
          >
            <Plus size={16} /> Novo Membro
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-6 border-b border-gray-50 flex items-center gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-green transition-colors" size={18} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome ou matrícula..." 
              className="w-full bg-gray-50/50 border-none rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-brand-green/5 transition-all font-bold" 
            />
          </div>
        </div>

        <div className="overflow-x-auto relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] border-b border-gray-50">
                <th className="px-8 py-5 w-20 text-center">Identidade</th>
                <th className="px-8 py-5">Colaborador</th>
                <th className="px-8 py-5 text-center">Status SGEJ</th>
                <th className="px-8 py-5 text-center">Data Ingresso</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center text-brand-muted">
                    <Loader2 className="animate-spin mx-auto mb-2 text-brand-green" size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Acessando Base de Dados...</span>
                  </td>
                </tr>
              ) : members.length > 0 ? (
                members.map((m) => (
                  <tr 
                    key={m.id} 
                    className="hover:bg-gray-50/50 transition-all duration-300 group cursor-pointer"
                    onClick={() => navigate(`/members/${m.id}`)}
                  >
                    <td className="px-8 py-5">
                      <div className="w-10 h-10 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green font-black text-xs mx-auto uppercase">
                        {m.name.charAt(0)}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-brand-dark text-sm group-hover:text-brand-green transition-colors">{m.name}</span>
                        </div>
                        <span className="text-[9px] text-brand-muted font-black uppercase tracking-tighter italic">{m.registration}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        m.status === 'ACTIVE' 
                          ? 'bg-brand-green/10 border-brand-green/30 text-brand-green' 
                          : 'bg-red-50/10 border-red-500/30 text-red-500'
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${m.status === 'ACTIVE' ? 'bg-brand-green' : 'bg-red-500'}`} />
                        {m.status_display}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center text-brand-muted text-[10px] font-bold">
                      {m.entry_date ? new Date(m.entry_date).toLocaleDateString('pt-BR') : '---'}
                    </td>
                    <td className="px-8 py-5 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => setActiveMenu(activeMenu === m.id ? null : m.id)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all relative z-10"
                      >
                        <MoreVertical size={18} className="text-gray-400" />
                      </button>

                      {activeMenu === m.id && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setActiveMenu(null)}></div>
                          <div className="absolute right-8 top-12 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 z-30 py-2 animate-in zoom-in-95 duration-200">
                            <button 
                              onClick={() => navigate(`/members/${m.id}`)}
                              className="w-full px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-brand-dark hover:bg-gray-50 flex items-center gap-3 transition-colors"
                            >
                              <Eye size={14} className="text-brand-green" /> Perfil Detalhado
                            </button>
                            {m.status === 'ACTIVE' && (
                              <button 
                                onClick={() => handleTerminate(m.id, m.name)}
                                disabled={loadingId === m.id}
                                className="w-full px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 flex items-center gap-3 border-t border-gray-50 transition-colors"
                              >
                                {loadingId === m.id ? <Loader2 size={14} className="animate-spin" /> : <UserMinus size={14} />}
                                Encerrar Atividades
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-20 text-center text-brand-muted font-bold italic text-sm">Nenhum registro encontrado na base.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={loadMembers} />
    </div>
  );
}