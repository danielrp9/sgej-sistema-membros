import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import { certificateService } from '@/services/certificates';
import { CertificateTemplate } from './components/CertificateTemplate.jsx';
import { ShieldCheck, PenTool, Loader2, AlertCircle, FileText, History, Clock, CheckCircle2 } from "lucide-react";

export default function CertificateAudit() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [signingId, setSigningId] = useState(null);

  const getUserRoleSafe = () => {
    const directRole = localStorage.getItem("@SGEJ:user_role") || localStorage.getItem("user_role");
    if (directRole) return directRole;

    const userJson = localStorage.getItem("@SGEJ:user") || localStorage.getItem("user");
    if (userJson) {
      try {
        const parsedUser = JSON.parse(userJson);
        return parsedUser.role || parsedUser.user?.role || '';
      } catch (e) {
        console.error("Erro ao analisar dados do usuário logado", e);
      }
    }
    return '';
  };

  const userRole = getUserRoleSafe();

  const loadPending = async () => {
    setLoading(true);
    try {
      const response = await certificateService.getPendingAudits();
      setPending(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar fila de auditoria:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPending(); }, []);

  const handlePreview = async (certificate) => {
    try {
      const doc = <CertificateTemplate certificate={certificate} />;
      const asPdf = pdf([]);
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (e) {
      alert("Erro ao gerar visualização do rascunho.");
    }
  };

  const handleSign = async (certId) => {
    if (!userRole) {
      alert("Erro de sessão: Cargo do usuário não localizado. Por favor, faça logout e entre novamente.");
      return;
    }
    
    const roleLabel = userRole === 'president' ? 'Presidência' : userRole === 'director' ? 'Recursos Humanos - RH' : 'Coordenação';
    if (!window.confirm(`Confirmar assinatura digital oficial no canal da ${roleLabel}?`)) return;
    
    setSigningId(certId);
    try {
      await certificateService.signCertificate(certId, { role: userRole, action: 'approve' });
      alert("Sucesso! Sua assinatura digital foi registrada neste documento.");
      await loadPending(); 
    } catch (error) {
      const msg = error.response?.data?.detail || "Verifique suas credenciais de acesso corporativo.";
      alert(`Falha na assinatura: ${msg}`);
    } finally {
      setSigningId(null);
    }
  };

  // Renderiza o círculo indicador de status na linha do tempo individual
  const renderMiniStep = (isSigned, label, signerName) => {
    return (
      <div className="flex flex-col items-center flex-1 relative">
        <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all z-10 ${
          isSigned 
            ? 'bg-brand-green/10 text-brand-green border border-brand-green/20 shadow-sm' 
            : 'bg-gray-50 text-gray-300 border border-gray-100'
        }`}>
          {isSigned ? <CheckCircle2 size={14} /> : <Clock size={14} />}
        </div>
        <p className={`text-[8px] font-black uppercase tracking-wider mt-1.5 ${isSigned ? 'text-brand-dark' : 'text-gray-400'}`}>
          {label}
        </p>
        {isSigned && signerName ? (
          <p className="text-[7px] font-bold text-gray-400 max-w-[80px] truncate text-center mt-0.5">
            {signerName.split(' ')[0]}
          </p>
        ) : isSigned ? (
          <p className="text-[7px] font-bold text-brand-green text-center mt-0.5">OK</p>
        ) : (
          <p className="text-[7px] font-medium text-gray-300 text-center mt-0.5">Pendente</p>
        )}
      </div>
    );
  };

  const getButtonLabel = () => {
    if (userRole === 'president') return "Assinar como Pres.";
    if (userRole === 'director') return "Assinar como RH";
    if (userRole === 'orientador') return "Assinar como Coord.";
    return "Assinar Documento";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-dark uppercase font-nasa tracking-tight">
            Central de Assinaturas
          </h1>
          <p className="text-[10px] text-brand-muted mt-1 font-black uppercase tracking-widest italic tracking-[0.2em]">
            Fila de Validação Coletiva • Next Step
          </p>
        </div>

        <Link 
          to="/history-certificates" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-brand-green/20 text-brand-green rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-green hover:text-white transition-all shadow-sm"
        >
          <History size={16} />
          Ver Histórico de Emitidos
        </Link>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="animate-spin mx-auto text-brand-green" size={40} />
            <p className="text-[10px] font-black uppercase mt-4 text-brand-muted tracking-[0.3em]">Sincronizando Fila...</p>
          </div>
        ) : pending.length > 0 ? (
          pending.map((cert) => {
          
            const isPresSigned = !!cert.president_name || !!cert.signed_by_president;
            const isDirSigned = !!cert.director_name || !!cert.signed_by_director;
            const isOrientSigned = !!cert.orientador_name || !!cert.signed_by_orientador;

            const alreadySigned = 
              (userRole === 'president' && isPresSigned) ||
              (userRole === 'director' && isDirSigned) ||
              (userRole === 'orientador' && isOrientSigned);

            return (
              <div key={cert.id} className="bg-white border border-gray-100 p-6 rounded-[32px] flex flex-col lg:flex-row items-center justify-between gap-6 border-l-4 border-l-brand-green shadow-sm hover:shadow-md transition-all">
                
                {/* Dados Principais do Membro */}
                <div className="flex items-center gap-5 w-full lg:w-auto">
                  <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green shadow-inner shrink-0">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] bg-gray-100 text-gray-500 font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                        Lote ID: #{cert.id}
                      </span>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        cert.status === 'PARTIAL' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {cert.status_display}
                      </span>
                    </div>
                    <h3 className="font-black text-brand-dark text-sm uppercase leading-tight mt-1.5">
                      {cert.member?.name || "Colaborador"}
                    </h3>
                    <p className="text-[10px] font-bold text-brand-muted uppercase mt-0.5">
                      Matrícula: {cert.member?.registration} • <span className="text-brand-green">{cert.member?.calculated_hours || 0}H Calculadas</span>
                    </p>
                  </div>
                </div>

                {/* Linha do Tempo Interna (Stepper do Fluxo Cumulativo) */}
                <div className="bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-2xl flex justify-between items-center w-full lg:w-[280px] relative">
                  <div className="absolute left-[15%] right-[15%] top-[20px] h-[1px] bg-gray-200/60 z-0"></div>
                  {renderMiniStep(isPresSigned, "Pres.", cert.president_name)}
                  {renderMiniStep(isDirSigned, "RH", cert.director_name)}
                  {renderMiniStep(isOrientSigned, "Coord.", cert.orientador_name)}
                </div>

                {/* Botões Operacionais baseados na pendência do usuário atual */}
                <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                  <button 
                    onClick={() => handlePreview(cert)} 
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-brand-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 border border-gray-100 w-full lg:w-auto transition-all"
                  >
                    <FileText size={16} /> 
                    Rascunho
                  </button>
                  
                  {alreadySigned ? (
                    <div className="flex items-center justify-center gap-2 px-6 py-3 border border-brand-green/10 bg-brand-green/5 text-brand-green rounded-2xl text-[10px] font-black uppercase tracking-widest w-full lg:w-auto select-none">
                      <CheckCircle2 size={14} /> Assinado
                    </div>
                  ) : (
                    <button 
                      disabled={signingId === cert.id} 
                      onClick={() => handleSign(cert.id)} 
                      className="flex items-center justify-center gap-2 px-8 py-3 bg-brand-green text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 w-full lg:w-auto"
                    >
                      {signingId === cert.id ? <Loader2 className="animate-spin" size={16} /> : <PenTool size={16} />} 
                      {getButtonLabel()}
                    </button>
                  )}
                </div>

              </div>
            );
          })
        ) : (
          <div className="py-24 text-center bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
            <AlertCircle className="mx-auto text-gray-300 mb-2" size={40} />
            <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.3em]">
              Nenhum rascunho aguardando sua validação
            </p>
          </div>
        )}
      </div>
    </div>
  );
}