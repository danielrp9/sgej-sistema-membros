import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import { certificateService } from '@/services/certificates';
import { CertificateTemplate } from './components/CertificateTemplate.jsx';
import { ShieldCheck, PenTool, Loader2, AlertCircle, FileText, History } from "lucide-react";

export default function CertificateAudit() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [signingId, setSigningId] = useState(null);

  const loadPending = async () => {
    setLoading(true);
    try {
      const response = await certificateService.getPendingAudits();
      setPending(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar fila:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPending(); }, []);

  // ✅ Abre o PDF em nova aba sem forçar download para revisão
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
    if (!window.confirm("Confirmar assinatura digital oficial? O certificado será movido para o arquivo permanente.")) return;
    setSigningId(certId);
    try {
      // ✅ Aciona o backend para mudar status para APPROVED e gerar Hash
      await certificateService.signCertificate(certId, { action: 'approve' });
      setPending(prev => prev.filter(c => c.id !== certId));
      alert("Sucesso! Certificado assinado e disponível no histórico.");
    } catch (error) {
      const msg = error.response?.data?.detail || "Verifique suas permissões de Orientadora.";
      alert(`Falha na assinatura: ${msg}`);
    } finally {
      setSigningId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Cabeçalho com Navegação para Histórico */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-dark uppercase font-nasa tracking-tight">
            Central de Assinaturas
          </h1>
          <p className="text-[10px] text-brand-muted mt-1 font-black uppercase tracking-widest italic tracking-[0.2em]">
            Fila de Validação • Next Step Tech
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
          pending.map((cert) => (
            <div key={cert.id} className="bg-white border border-gray-100 p-6 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-brand-green shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green shadow-inner">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 className="font-black text-brand-dark text-sm uppercase leading-tight">
                    {cert.member?.name || "Colaborador"}
                  </h3>
                  <p className="text-[10px] font-bold text-brand-muted uppercase mt-1">
                    Matrícula: {cert.member?.registration} • <span className="text-brand-green">{cert.member?.calculated_hours}H</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button 
                  onClick={() => handlePreview(cert)} 
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-brand-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 border border-gray-100 w-full md:w-auto transition-all"
                >
                  <FileText size={16} /> 
                  Rascunho
                </button>
                
                <button 
                  disabled={signingId === cert.id} 
                  onClick={() => handleSign(cert.id)} 
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-brand-green text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 w-full md:w-auto"
                >
                  {signingId === cert.id ? <Loader2 className="animate-spin" size={16} /> : <PenTool size={16} />} 
                  Assinar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
            <AlertCircle className="mx-auto text-gray-300 mb-2" size={40} />
            <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.3em]">
              Nenhum rascunho aguardando validação
            </p>
          </div>
        )}
      </div>
    </div>
  );
}