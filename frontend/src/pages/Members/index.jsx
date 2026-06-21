import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Loader2, Eye, UserMinus, ExternalLink, FileCheck, AlertTriangle } from "lucide-react";
import { memberService } from '../../services/members';
import AddMemberModal from './AddMemberModal';
import { useModal } from '../../components/ModalContext';


export default function Members() {
  const navigate = useNavigate();
  const location = useLocation();
  const { alert, confirm, prompt } = useModal();

  const userJson = localStorage.getItem("@SGEJ:user");
  const user = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    if (user?.role === 'orientador') {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab') || 'active';

  
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ACTIVE');
  
  const [activeMenu, setActiveMenu] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const handleMenuClick = (e, memberId) => {
    e.stopPropagation();
    if (activeMenu === memberId) {
      setActiveMenu(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const dropdownWidth = 208; // w-52 is 208px
      const leftPos = rect.right - dropdownWidth;
      setMenuPosition({
        top: rect.bottom + 4,
        left: Math.max(12, leftPos),
      });
      setActiveMenu(memberId);
    }
  };

  useEffect(() => {
    if (tabParam) {
      const formatted = tabParam.toUpperCase();
      if (['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(formatted)) {
        setActiveTab(formatted);
      } else {
        setActiveTab('ACTIVE');
      }
    }
  }, [tabParam]);

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
    const confirmMessage = `Deseja encerrar as atividades de ${name}?\n\nO sistema calculará automaticamente a carga horária (6h/semanais) e gerará o rascunho do certificado para assinatura do orientador.`;
    
    if (await confirm(confirmMessage, 'Encerrar Atividades')) {
      setLoadingId(id);
      setActiveMenu(null);
      try {
        await memberService.terminateMember(id);
        await alert("Sucesso! Atividades encerradas e certificado enviado para a Central de Assinaturas.", "Encerrar Atividades");
        loadMembers(search); 
      } catch (error) {
        console.error("Erro ao encerrar:", error);
        await alert("Erro ao processar encerramento. Verifique se o membro já possui um certificado pendente.", "Encerrar Atividades");
      } finally {
        setLoadingId(null);
      }
    }
  };

  const handleSuspend = async (id, name) => {
    const reason = await prompt(`Digite o motivo da suspensão para ${name}:`, '', 'Motivo da Suspensão');
    if (reason === null) return;
    if (!reason.trim()) {
      await alert("O motivo da suspensão é obrigatório.", "Erro de Suspensão");
      return;
    }

    if (await confirm(`Deseja realmente suspender o membro ${name} pelo seguinte motivo:\n\n"${reason}"?`, 'Confirmar Suspensão')) {
      setLoadingId(id);
      setActiveMenu(null);
      try {
        await memberService.suspendMember(id, reason);
        await alert("Sucesso! Membro suspenso e movido para a lista de suspensões.", "Suspensão de Membro");
        loadMembers(search);
      } catch (error) {
        console.error("Erro ao suspender:", error);
        await alert(error.response?.data?.detail || "Erro ao suspender membro.", "Erro de Suspensão");
      } finally {
        setLoadingId(null);
      }
    }
  };

  // Separação dos membros por status localmente para máxima performance
  const activeMembers = members.filter(m => m.status === 'ACTIVE');
  const inactiveMembers = members.filter(m => m.status === 'INACTIVE');
  const suspendedMembers = members.filter(m => m.status === 'SUSPENDED');

  // Agrupamento dos inativos por ano de desligamento (exit_date) ou ingresso (entry_date)
  const getInactiveGroups = () => {
    const groups = {};
    inactiveMembers.forEach(m => {
      const dateStr = m.exit_date || m.entry_date;
      const year = dateStr ? new Date(dateStr).getFullYear() : 'Outros';
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(m);
    });
    return Object.keys(groups)
      .sort((a, b) => b - a)
      .map(year => ({
        year,
        members: groups[year]
      }));
  };

  const inactiveGroups = getInactiveGroups();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight uppercase font-nasa">
            Gestão de Membros
          </h1>
          <p className="text-xs text-brand-muted mt-1 font-medium italic">
            Base de dados operacional • NextStep
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
          <button 
            onClick={() => navigate('/audit')}
            className="flex-1 md:flex-initial justify-center bg-white text-brand-dark border border-gray-100 px-4 md:px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
          >
            <FileCheck size={16} className="text-brand-green" /> Ver Auditoria
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-initial justify-center bg-brand-green text-white px-4 md:px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg shadow-brand-green/20 hover:scale-[1.02] transition-all"
          >
            <Plus size={16} /> Novo Membro
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden min-h-[500px] flex flex-col relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-green/5 rounded-full blur-[85px] pointer-events-none"></div>
        {/* Abas Superiores de Categoria com Indicador Ativo */}
        <div className="flex overflow-x-auto whitespace-nowrap border-b border-gray-100 bg-gray-50/50 px-4 md:px-6 relative z-10 custom-scrollbar-horizontal">
          <button
            onClick={() => navigate('/members?tab=active')}
            className={`py-4 md:py-5 px-4 md:px-6 text-[10px] md:text-xs font-black uppercase tracking-widest border-b-2 transition-all relative shrink-0 ${
              activeTab === 'ACTIVE'
                ? 'border-brand-green text-brand-green font-black bg-white/40'
                : 'border-transparent text-brand-muted hover:text-brand-dark'
            }`}
          >
            Ativos ({activeMembers.length})
          </button>
          <button
            onClick={() => navigate('/members?tab=inactive')}
            className={`py-4 md:py-5 px-4 md:px-6 text-[10px] md:text-xs font-black uppercase tracking-widest border-b-2 transition-all relative shrink-0 ${
              activeTab === 'INACTIVE'
                ? 'border-brand-green text-brand-green font-black bg-white/40'
                : 'border-transparent text-brand-muted hover:text-brand-dark'
            }`}
          >
            Desligados ({inactiveMembers.length})
          </button>
          <button
            onClick={() => navigate('/members?tab=suspended')}
            className={`py-4 md:py-5 px-4 md:px-6 text-[10px] md:text-xs font-black uppercase tracking-widest border-b-2 transition-all relative shrink-0 ${
              activeTab === 'SUSPENDED'
                ? 'border-brand-green text-brand-green font-black bg-white/40'
                : 'border-transparent text-brand-muted hover:text-brand-dark'
            }`}
          >
            Suspensos ({suspendedMembers.length})
          </button>
        </div>

        {/* Barra de Pesquisa Incorporada */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center gap-4 bg-white relative z-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-green transition-colors" size={18} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Pesquisar nos membros ${activeTab === 'ACTIVE' ? 'ativos' : activeTab === 'SUSPENDED' ? 'suspensos' : 'desligados'} por nome, matrícula ou e-mail...`} 
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:bg-white focus:border-brand-green/40 focus:ring-4 focus:ring-brand-green/5 transition-all font-bold" 
            />
          </div>
        </div>

        <div className="p-4 md:p-6 flex-1 bg-white relative z-10">
          {loading ? (
            <div className="py-20 text-center text-brand-muted">
              <Loader2 className="animate-spin mx-auto mb-2 text-brand-green" size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">Acessando Base de Dados...</span>
            </div>
          ) : activeTab === 'ACTIVE' ? (
            activeMembers.length > 0 ? (
              <div className="overflow-x-auto animate-in fade-in duration-300 border border-gray-100 rounded-2xl bg-white shadow-[0_8px_30px_-6px_rgba(0,0,0,0.03)]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] border-b border-gray-100">
                      <th className="hidden sm:table-cell px-4 py-3 md:px-6 md:py-4 w-20 text-center">Identidade</th>
                      <th className="px-4 py-3 md:px-6 md:py-4">Colaborador</th>
                      <th className="hidden sm:table-cell px-4 py-3 md:px-6 md:py-4">Cargo / Departamento</th>
                      <th className="hidden md:table-cell px-4 py-3 md:px-6 md:py-4 text-center">Data Ingresso</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {activeMembers.map((m) => (
                      <tr 
                        key={m.id} 
                        className="hover:bg-brand-green/5 transition-all duration-300 group cursor-pointer"
                        onClick={() => navigate(`/members/${m.id}`)}
                      >
                        <td className="hidden sm:table-cell px-4 py-3 md:px-6 md:py-4">
                          <div className="w-10 h-10 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green font-black text-xs mx-auto uppercase animate-in zoom-in duration-300">
                            {m.name ? m.name.charAt(0) : '?'}
                          </div>
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-brand-dark text-sm group-hover:text-brand-green transition-colors">{m.name || 'Sem Nome'}</span>
                            <span className="text-[9px] text-brand-muted font-black uppercase tracking-tighter italic">{m.registration || 'Sem Matrícula'}</span>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-4 py-3 md:px-6 md:py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-brand-dark text-sm">{m.role || 'Colaborador'}</span>
                            <span className="text-[10px] text-brand-muted uppercase font-bold">{m.department || 'Geral'}</span>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 py-3 md:px-6 md:py-4 text-center text-brand-muted text-[10px] font-bold">
                          {m.entry_date ? new Date(m.entry_date).toLocaleDateString('pt-BR') : '---'}
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={(e) => handleMenuClick(e, m.id)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-all relative z-10"
                          >
                            <MoreVertical size={18} className="text-gray-400" />
                          </button>

                          {activeMenu === m.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)}></div>
                              <div 
                                className="fixed bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 py-2 animate-in zoom-in-95 duration-200 w-52"
                                style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                              >
                                <button 
                                  onClick={() => navigate(`/members/${m.id}`)}
                                  className="w-full px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-brand-dark hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <Eye size={14} className="text-brand-green" /> Perfil Detalhado
                                </button>
                                <button 
                                  onClick={() => handleTerminate(m.id, m.name)}
                                  disabled={loadingId === m.id}
                                  className="w-full px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 flex items-center gap-3 border-t border-gray-50 transition-colors"
                                >
                                  {loadingId === m.id ? <Loader2 size={14} className="animate-spin" /> : <UserMinus size={14} />}
                                  Encerrar Atividades
                                </button>
                                <button 
                                  onClick={() => handleSuspend(m.id, m.name)}
                                  disabled={loadingId === m.id}
                                  className="w-full px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-amber-600 hover:bg-amber-50 flex items-center gap-3 border-t border-gray-50 transition-colors"
                                >
                                  {loadingId === m.id ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
                                  Suspender Membro
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-20 text-center text-brand-muted font-bold italic text-sm">
                Nenhum membro ativo encontrado.
              </div>
            )
          ) : activeTab === 'SUSPENDED' ? (
            suspendedMembers.length > 0 ? (
              <div className="overflow-x-auto animate-in fade-in duration-300 border border-gray-100 rounded-2xl bg-white shadow-[0_8px_30px_-6px_rgba(0,0,0,0.03)]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] border-b border-gray-100">
                      <th className="hidden sm:table-cell px-4 py-3 md:px-6 md:py-4 w-20 text-center">Identidade</th>
                      <th className="px-4 py-3 md:px-6 md:py-4">Colaborador</th>
                      <th className="hidden md:table-cell px-4 py-3 md:px-6 md:py-4 text-center">Data Ingresso</th>
                      <th className="px-4 py-3 md:px-6 md:py-4">Motivo da Suspensão</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {suspendedMembers.map((m) => (
                      <tr 
                        key={m.id} 
                        className="hover:bg-brand-green/5 transition-all duration-300 group cursor-pointer"
                        onClick={() => navigate(`/members/${m.id}`)}
                      >
                        <td className="hidden sm:table-cell px-4 py-3 md:px-6 md:py-4">
                          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 font-black text-xs mx-auto uppercase animate-in zoom-in duration-300">
                            {m.name ? m.name.charAt(0) : '?'}
                          </div>
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-brand-dark text-sm group-hover:text-brand-green transition-colors">{m.name || 'Sem Nome'}</span>
                            <span className="text-[9px] text-brand-muted font-black uppercase tracking-tighter italic">{m.registration || 'Sem Matrícula'}</span>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 py-3 md:px-6 md:py-4 text-center text-brand-muted text-[10px] font-bold">
                          {m.entry_date ? new Date(m.entry_date).toLocaleDateString('pt-BR') : '---'}
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-xs text-amber-700 font-bold max-w-xs truncate">
                          {m.suspension_reason || 'Não informado'}
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={(e) => handleMenuClick(e, m.id)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-all relative z-10"
                          >
                            <MoreVertical size={18} className="text-gray-400" />
                          </button>

                          {activeMenu === m.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)}></div>
                              <div 
                                className="fixed bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 py-2 animate-in zoom-in-95 duration-200 w-52"
                                style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                              >
                                <button 
                                  onClick={() => navigate(`/members/${m.id}`)}
                                  className="w-full px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-brand-dark hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <Eye size={14} className="text-brand-green" /> Perfil Detalhado
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-20 text-center text-brand-muted font-bold italic text-sm">
                Nenhum membro suspenso encontrado.
              </div>
            )
          ) : (
            inactiveGroups.length > 0 ? (
              <div className="space-y-8 animate-in fade-in duration-500">
                {inactiveGroups.map((group) => (
                  <div key={group.year} className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-[0_8px_30px_-6px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_35px_-6px_rgba(0,0,0,0.05)] transition-all duration-300">
                    <div className="bg-gray-50/50 px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 flex justify-between items-center">
                      <span className="text-xs font-black text-brand-dark uppercase tracking-wider">
                        Ano: {group.year}
                      </span>
                      <span className="bg-brand-muted/15 text-brand-dark px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                        {group.members.length} {group.members.length === 1 ? 'membro' : 'membros'}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white text-[9px] font-black text-brand-muted uppercase tracking-[0.2em] border-b border-gray-200">
                            <th className="hidden sm:table-cell px-4 py-3 md:px-6 md:py-4 w-20 text-center">Identidade</th>
                            <th className="px-4 py-3 md:px-6 md:py-4">Colaborador</th>
                            <th className="hidden md:table-cell px-4 py-3 md:px-6 md:py-4 text-center">Data Ingresso</th>
                            <th className="hidden sm:table-cell px-4 py-3 md:px-6 md:py-4 text-center">Data Desligamento</th>
                            <th className="px-4 py-3 md:px-6 md:py-4 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {group.members.map((m) => (
                            <tr 
                              key={m.id} 
                              className="hover:bg-brand-green/5 transition-all duration-300 group cursor-pointer"
                              onClick={() => navigate(`/members/${m.id}`)}
                            >
                              <td className="hidden sm:table-cell px-4 py-3 md:px-6 md:py-4">
                                <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 font-black text-xs mx-auto uppercase">
                                  {m.name ? m.name.charAt(0) : '?'}
                                </div>
                              </td>
                              <td className="px-4 py-3 md:px-6 md:py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-brand-dark text-sm group-hover:text-brand-green transition-colors">{m.name || 'Sem Nome'}</span>
                                  <span className="text-[9px] text-brand-muted font-black uppercase tracking-tighter italic">{m.registration || 'Sem Matrícula'}</span>
                                </div>
                              </td>
                              <td className="hidden md:table-cell px-4 py-3 md:px-6 md:py-4 text-center text-brand-muted text-[10px] font-bold">
                                {m.entry_date ? new Date(m.entry_date).toLocaleDateString('pt-BR') : '---'}
                              </td>
                              <td className="hidden sm:table-cell px-4 py-3 md:px-6 md:py-4 text-center text-brand-muted text-[10px] font-bold">
                                {m.exit_date ? new Date(m.exit_date).toLocaleDateString('pt-BR') : '---'}
                              </td>
                              <td className="px-4 py-3 md:px-6 md:py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                                <button 
                                  onClick={(e) => handleMenuClick(e, m.id)}
                                  className="p-2 hover:bg-gray-100 rounded-xl transition-all relative z-10"
                                >
                                  <MoreVertical size={18} className="text-gray-400" />
                                </button>

                                {activeMenu === m.id && (
                                  <>
                                    <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)}></div>
                                    <div 
                                      className="fixed bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 py-2 animate-in zoom-in-95 duration-200 w-52"
                                      style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                                    >
                                      <button 
                                        onClick={() => navigate(`/members/${m.id}`)}
                                        className="w-full px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-brand-dark hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                      >
                                        <Eye size={14} className="text-brand-green" /> Perfil Detalhado
                                      </button>
                                    </div>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-brand-muted font-bold italic text-sm">
                Nenhum membro desligado encontrado.
              </div>
            )
          )}
        </div>
      </div>

      <AddMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={loadMembers} />
    </div>
  );
}