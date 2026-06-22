import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { memberService } from '../../services/members';
import { 
  Loader2, 
  ArrowLeft, 
  Calendar, 
  Mail, 
  Hash, 
  Briefcase, 
  Clock,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  XCircle,
  Lock
} from "lucide-react";
import { useModal } from '../../components/ModalContext';



export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { alert, confirm, prompt } = useModal();
  const [member, setMember] = useState(null);
  const [history, setHistory] = useState([]); 
  const [loading, setLoading] = useState(true);

  const userJson = localStorage.getItem("@SGEJ:user");
  const user = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    if (user?.role === 'orientador') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const calculateHours = () => {
    if (!member || !member.entry_date) return 0;
    const [entryYear, entryMonth, entryDay] = member.entry_date.split('-').map(Number);
    const entryDate = new Date(entryYear, entryMonth - 1, entryDay);
    
    let exitDate;
    if (member.exit_date) {
      const [exitYear, exitMonth, exitDay] = member.exit_date.split('-').map(Number);
      exitDate = new Date(exitYear, exitMonth - 1, exitDay);
    } else {
      const now = new Date();
      exitDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    
    const diffTime = exitDate - entryDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.max(Math.floor(diffDays / 7), 1);
    return weeks * 6;
  };

  const handleApplySanction = async () => {
    const description = await prompt(
      "Descreva detalhadamente o motivo/descrição da advertência que será aplicada ao perfil deste colaborador:",
      "",
      "Aplicar Advertência"
    );
    
    if (description === null) return; // Cancelado
    
    if (!description.trim()) {
      await alert("A descrição do motivo da punição é obrigatória.", "Erro de Punição");
      return;
    }

    try {
      setLoading(true);
      await memberService.addSanction(id, description);
      await alert("Sanção aplicada ao perfil com sucesso!", "Sucesso");
      
      const [memberRes, historyRes] = await Promise.all([
        memberService.getMemberDetail(id),
        memberService.getMemberHistory(id)
      ]);
      setMember(memberRes.data);
      setHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
    } catch (error) {
      console.error("Erro ao aplicar sanção:", error);
      await alert(error.response?.data?.detail || "Erro ao aplicar punição.", "Erro");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    async function loadAllData() {

      setLoading(true);
      try {
        // Busca detalhes e histórico simultaneamente
        const [memberRes, historyRes] = await Promise.all([
          memberService.getMemberDetail(id),
          memberService.getMemberHistory(id)
        ]);
        
        setMember(memberRes.data);
        setHistory(Array.isArray(historyRes.data) ? historyRes.data : []); 
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) loadAllData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-brand-green" size={32} />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-muted">Sincronizando com SGEJ...</span>
      </div>
    );
  }
  
  if (!member) {
    return (
      <div className="p-20 text-center">
        <p className="text-brand-muted font-bold uppercase text-xs">Membro não encontrado.</p>
        <button onClick={() => navigate('/members')} className="mt-4 text-brand-green font-black uppercase text-[10px]">Voltar</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/members')} 
        className="flex items-center gap-2 text-brand-muted hover:text-brand-green transition-colors text-[10px] font-black uppercase tracking-widest"
      >
        <ArrowLeft size={16} /> Voltar para a lista
      </button>

      {member.status === 'SUSPENDED' && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-800 p-6 rounded-[24px] flex items-start gap-4">
          <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <div className="w-full">
            <h4 className="font-black text-xs uppercase tracking-widest text-red-800">Membro Suspenso - Sem Direito a Certificado</h4>
            <p className="text-xs text-red-700 mt-1 leading-relaxed">
              Este membro foi suspenso por descumprir o regulamento da empresa júnior. Por este motivo, a emissão de certificados está bloqueada.
            </p>
            {member.suspension_reason && (
              <div className="mt-3 p-3 bg-white/50 rounded-xl border border-red-100">
                <span className="text-[9px] font-black uppercase tracking-wider text-red-700 block mb-1">Veredito Final:</span>
                <p className="text-xs text-red-950 font-bold italic leading-relaxed">
                  "{member.suspension_reason}"
                </p>
              </div>
            )}
            
            {member.sanctions && member.sanctions.length > 0 && (
              <div className="mt-4">
                <span className="text-[9px] font-black uppercase tracking-wider text-red-700 block mb-2">Sanções Acumuladas no Perfil:</span>
                <div className="space-y-2">
                  {member.sanctions.map((sanction, idx) => (
                    <div key={sanction.id || idx} className="text-xs text-red-900 flex items-start gap-1">
                      <span className="text-red-500 font-bold">•</span>
                      <span>
                        <strong className="text-red-950">{sanction.created_at_display || new Date(sanction.created_at).toLocaleDateString('pt-BR')}:</strong> {sanction.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card de Informações Principais */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 md:p-10 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm">
            <h1 className="text-2xl font-black text-brand-dark uppercase mb-8">{member.name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoItem icon={<Mail size={16}/>} label="E-mail" value={member.email} />
              <InfoItem icon={<Hash size={16}/>} label="CPF" value={member.cpf || "Não informado"} />
              <InfoItem icon={<Briefcase size={16}/>} label="Cargo" value={member.role || "Membro"} />
              <InfoItem icon={<Calendar size={16}/>} label="Ingresso" value={member.entry_date ? new Date(member.entry_date).toLocaleDateString('pt-BR') : '---'} />
            </div>
          </div>

          {/* Linha do Tempo / Histórico */}
          <div className="bg-white p-5 md:p-10 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mb-8">Histórico de Atividades</h3>
            <div className="space-y-6">
              {/* ✅ O uso do Optional Chaining (?.) ou a inicialização [] previne a tela branca */}
              {history.length > 0 ? history.map((item, index) => (
                <div key={index} className="flex gap-4 border-l-2 border-gray-50 pl-6 relative">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-green border-4 border-white shadow-sm" />
                  <div>
                    <p className="text-xs font-black text-brand-dark uppercase">{item.reason_display || item.action_display || "Ciclo de Atividades"}</p>
                    <p className="text-[10px] font-bold text-brand-muted uppercase">
                      {(item.entry_date || item.date) ? new Date(item.entry_date || item.date).toLocaleDateString('pt-BR') : '---'}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-[10px] font-bold text-brand-muted uppercase italic">Nenhum histórico registrado para este membro.</p>
              )}
            </div>
          </div>
        </div>

        {/* Card Lateral Split Layout */}
        <div className="space-y-6 lg:col-span-1">
          {/* Card Resumo Carga Horária */}
          <div className="bg-brand-dark p-6 md:p-8 rounded-[24px] md:rounded-[32px] text-white shadow-lg relative overflow-hidden h-fit transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="text-brand-green" size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Resumo de Carga Horária</span>
            </div>
            
            <div className="mt-4 mb-6">
              <span className="text-4xl font-black text-brand-green tracking-tight">{calculateHours()}h</span>
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block mt-1">Horas Acumuladas</span>
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Cálculo baseado em <strong>6 horas semanais</strong> a partir da data de ingresso.
            </p>
            
            <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Status do Certificado</span>
              <div className="flex items-center gap-2">
                {member.status === 'SUSPENDED' ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Emissão Bloqueada</span>
                  </>
                ) : member.status === 'ACTIVE' ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-green" />
                    <span className="text-xs font-bold text-brand-green uppercase tracking-wider">Elegível para Emissão</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Elegível (Inativo)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Card Sanções Disciplinares */}
          <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-md relative overflow-hidden h-fit transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ShieldAlert className={member.sanctions?.length > 0 ? "text-red-500" : "text-brand-muted"} size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Sanções Disciplinares</span>
              </div>
              <span className="bg-red-50 text-red-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                {member.sanctions?.length || 0}
              </span>
            </div>

            {/* Listagem de Sanções */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {member.sanctions && member.sanctions.length > 0 ? (
                member.sanctions.map((sanction, index) => (
                  <div key={sanction.id || index} className="p-4 bg-red-50/50 border border-red-100 rounded-2xl space-y-1 hover:bg-red-50 transition-colors">
                    <p className="text-xs text-red-950 font-bold leading-relaxed">{sanction.description}</p>
                    <p className="text-[9px] text-red-600/80 font-semibold uppercase tracking-wider flex items-center gap-1">
                      <AlertCircle size={10} />
                      {sanction.created_at_display || new Date(sanction.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border border-dashed border-gray-200 rounded-2xl">
                    <p className="text-[10px] font-bold text-brand-muted uppercase italic">Nenhuma advertência no perfil.</p>
                </div>
              )}
            </div>

            {/* Ações e Alertas */}
            {member.status === 'ACTIVE' ? (
              <button 
                onClick={handleApplySanction}
                className="w-full py-3.5 bg-red-500 hover:bg-red-600 active:scale-95 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all mt-6 shadow-md hover:shadow-lg hover:shadow-red-500/10 flex items-center justify-center gap-2"
              >
                <ShieldAlert size={14} /> Aplicar Advertência
              </button>
            ) : member.status === 'SUSPENDED' ? (
              <div className="mt-6 p-4 bg-red-50 border border-red-200/60 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-red-800">
                  <XCircle className="text-red-500 shrink-0" size={16} />
                  <span className="text-[9px] font-black uppercase tracking-wider">Sem Direito ao Certificado</span>
                </div>
                <p className="text-xs text-red-800 leading-relaxed font-semibold">
                  A suspensão das atividades bloqueia permanentemente a emissão de certificados.
                </p>
                {member.suspension_reason && (
                  <div className="pt-2 border-t border-red-200/40">
                    <span className="text-[8px] font-black uppercase tracking-wider text-red-700 block mb-1">Veredito Final:</span>
                    <p className="text-xs text-red-950 font-bold italic leading-relaxed">
                      "{member.suspension_reason}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-2 text-gray-500">
                <Lock size={14} />
                <span className="text-[9px] font-black uppercase tracking-wider">Perfil Inativo - Ações Bloqueadas</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="p-3 bg-gray-50 rounded-2xl text-brand-muted">{icon}</div>
      <div>
        <p className="text-[9px] font-black text-brand-muted uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-brand-dark">{value}</p>
      </div>
    </div>
  );
}