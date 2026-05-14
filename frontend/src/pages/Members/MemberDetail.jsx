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
  Clock 
} from "lucide-react";

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [history, setHistory] = useState([]); // ✅ Inicializado como array vazio para evitar erro no .map
  const [loading, setLoading] = useState(true);

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
        setHistory(Array.isArray(historyRes.data) ? historyRes.data : []); // ✅ Garante que seja um array
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card de Informações Principais */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm">
            <h1 className="text-2xl font-black text-brand-dark uppercase mb-8">{member.name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoItem icon={<Mail size={16}/>} label="E-mail" value={member.email} />
              <InfoItem icon={<Hash size={16}/>} label="CPF" value={member.cpf || "Não informado"} />
              <InfoItem icon={<Briefcase size={16}/>} label="Cargo" value={member.role || "Membro"} />
              <InfoItem icon={<Calendar size={16}/>} label="Ingresso" value={member.entry_date ? new Date(member.entry_date).toLocaleDateString('pt-BR') : '---'} />
            </div>
          </div>

          {/* Linha do Tempo / Histórico */}
          <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mb-8">Histórico de Atividades</h3>
            <div className="space-y-6">
              {/* ✅ O uso do Optional Chaining (?.) ou a inicialização [] previne a tela branca */}
              {history.length > 0 ? history.map((item, index) => (
                <div key={index} className="flex gap-4 border-l-2 border-gray-50 pl-6 relative">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-green border-4 border-white shadow-sm" />
                  <div>
                    <p className="text-xs font-black text-brand-dark uppercase">{item.action_display || "Alteração de Status"}</p>
                    <p className="text-[10px] font-bold text-brand-muted uppercase">{new Date(item.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              )) : (
                <p className="text-[10px] font-bold text-brand-muted uppercase italic">Nenhum histórico registrado para este membro.</p>
              )}
            </div>
          </div>
        </div>

        {/* Card Lateral */}
        <div className="bg-brand-dark p-8 rounded-[32px] text-white h-fit">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="text-brand-green" size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Resumo de Carga Horária</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Membro vinculado à base SGEJ. O cálculo de horas para certificados segue a norma de <strong>6 horas semanais</strong> desde a data de ingresso.
          </p>
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