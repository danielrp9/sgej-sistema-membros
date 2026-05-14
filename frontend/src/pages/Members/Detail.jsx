import React, { useState } from 'react';
import { MoreVertical, UserMinus, Loader2, Eye } from 'lucide-react';
import { memberService } from '../../services/members';
import { useNavigate } from 'react-router-dom';

export default function MembersTable({ members, onRefresh }) {
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState(null);

  const handleTerminate = async (id, name) => {
    if (window.confirm(`Deseja realmente encerrar as atividades de ${name}?`)) {
      setLoadingId(id);
      try {
        await memberService.terminateMember(id);
        onRefresh(); // Atualiza a lista para refletir o status INATIVO
      } catch (error) {
        console.error("Erro ao encerrar:", error);
        alert("Erro ao encerrar membro.");
      } finally {
        setLoadingId(null);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] border-b border-gray-50">
            <th className="py-6 px-4">Avatar</th>
            <th className="py-6 px-4">Identificação</th>
            <th className="py-6 px-4">E-mail Corporativo</th>
            <th className="py-6 px-4">Status</th>
            <th className="py-6 px-4">Ingresso</th>
            <th className="py-6 px-4 text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {members.map((member) => (
            <tr key={member.id} className="group hover:bg-gray-50/50 transition-colors">
              <td className="py-6 px-4">
                <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green font-black text-xs">
                  {member.name.charAt(0)}
                </div>
              </td>
              <td className="py-6 px-4">
                <p className="text-sm font-black text-brand-dark leading-tight">{member.name}</p>
                <p className="text-[10px] font-bold text-brand-muted tracking-tighter">{member.registration}</p>
              </td>
              <td className="py-6 px-4 text-xs font-bold text-gray-500">{member.email}</td>
              <td className="py-6 px-4">
                <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${
                  member.status === 'ACTIVE' ? 'text-brand-green' : 'text-red-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    member.status === 'ACTIVE' ? 'bg-brand-green' : 'bg-red-400'
                  }`} />
                  {member.status_display}
                </span>
              </td>
              <td className="py-6 px-4 text-xs font-bold text-gray-400">
                {new Date(member.entry_date).toLocaleDateString('pt-BR')}
              </td>
              <td className="py-6 px-4 text-center relative">
                <div className="flex justify-center gap-2">
                  {/* Botão de Ver Detalhes */}
                  <button 
                    onClick={() => navigate(`/members/${member.id}`)}
                    className="p-2 hover:bg-brand-green/10 text-brand-muted hover:text-brand-green rounded-lg transition-all"
                  >
                    <Eye size={16} />
                  </button>

                  {/* Botão de Encerramento (Só aparece se Ativo) */}
                  {member.status === 'ACTIVE' && (
                    <button 
                      onClick={() => handleTerminate(member.id, member.name)}
                      disabled={loadingId === member.id}
                      className="p-2 hover:bg-red-50 text-brand-muted hover:text-red-500 rounded-lg transition-all"
                    >
                      {loadingId === member.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <UserMinus size={16} />
                      )}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}