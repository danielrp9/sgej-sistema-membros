import React, { useState } from 'react';
import { MoreVertical, UserMinus, Loader2, Eye, ExternalLink } from 'lucide-react';
import { memberService } from '../../services/members';
import { useNavigate } from 'react-router-dom';

export default function MembersTable({ members, onRefresh }) {
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleTerminate = async (id, name) => {
    const confirmMessage = `Deseja encerrar as atividades de ${name}?\nIsso calculará o total de horas e gerará o rascunho do certificado.`;
    
    if (window.confirm(confirmMessage)) {
      setLoadingId(id);
      setActiveMenu(null);
      try {
        await memberService.terminateMember(id);
        alert("Atividades encerradas com sucesso.");
        if (onRefresh) onRefresh(); 
      } catch (error) {
        console.error("Erro no encerramento:", error);
        alert("Falha ao processar encerramento.");
      } finally {
        setLoadingId(null);
      }
    }
  };

  return (
    <div className="overflow-x-auto relative min-h-[450px]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] border-b border-gray-50">
            <th className="py-6 px-8">Avatar</th>
            <th className="py-6 px-8">Identificação</th>
            <th className="py-6 px-8">E-mail Corporativo</th>
            <th className="py-6 px-8 text-center">Status</th>
            <th className="py-6 px-8">Ingresso</th>
            <th className="py-6 px-8 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {members.map((member) => (
            <tr 
              key={member.id} 
              className="group hover:bg-gray-50/50 transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/members/${member.id}`)}
            >
              <td className="py-6 px-8">
                <div className="w-10 h-10 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green font-black shadow-sm mx-auto">
                  {member.name?.charAt(0) || '?'}
                </div>
              </td>
              
              <td className="py-6 px-8">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black text-brand-dark group-hover:text-brand-green transition-colors leading-tight">
                    {member.name}
                  </p>
                  <ExternalLink size={12} className="text-gray-300 opacity-0 group-hover:opacity-100" />
                </div>
                <p className="text-[10px] font-bold text-brand-muted tracking-tighter uppercase">
                  {member.registration}
                </p>
              </td>

              <td className="py-6 px-8 text-xs font-bold text-gray-500">{member.email}</td>
              
              <td className="py-6 px-8 text-center">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  member.status === 'ACTIVE' 
                    ? 'bg-brand-green/10 border-brand-green/30 text-brand-green' 
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {member.status_display}
                </span>
              </td>

              <td className="py-6 px-8 text-xs font-bold text-gray-400">
                {member.entry_date ? new Date(member.entry_date).toLocaleDateString('pt-BR') : '---'}
              </td>

              <td className="py-6 px-8 text-right relative" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setActiveMenu(activeMenu === member.id ? null : member.id)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all relative z-20"
                >
                  <MoreVertical size={18} className="text-gray-400" />
                </button>

                {activeMenu === member.id && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setActiveMenu(null)}></div>
                    <div className="absolute right-4 top-14 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-40 py-2 animate-in zoom-in-95 duration-200">
                      <button 
                        onClick={() => navigate(`/members/${member.id}`)}
                        className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-brand-dark hover:bg-gray-50 flex items-center gap-3"
                      >
                        <Eye size={14} className="text-brand-green" /> Ver Perfil Completo
                      </button>
                      
                      {member.status === 'ACTIVE' && (
                        <button 
                          onClick={() => handleTerminate(member.id, member.name)}
                          disabled={loadingId === member.id}
                          className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 flex items-center gap-3 border-t border-gray-50"
                        >
                          {loadingId === member.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <UserMinus size={14} />
                          )}
                          Encerrar Serviço
                        </button>
                      )}
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}