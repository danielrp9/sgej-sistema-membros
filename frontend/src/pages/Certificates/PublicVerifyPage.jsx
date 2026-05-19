import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, Loader2, ArrowLeft, CheckCircle2, Award } from 'lucide-react';

export default function PublicVerifyPage() {
  const { uuid } = useParams();
  const [certData, setCertData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyCertificate = async () => {
      setLoading(true);
      try {
        // Faz a chamada ao endpoint de verificação pública que mapeamos no Django
        const response = await axios.get(`https://api.sgej.cloud/api/v1/certificates/public/verify/${uuid}/`);
        
        // Se o backend responder com sucesso e o certificado for válido
        if (response.data && response.data.valid) {
          setCertData(response.data.certificate);
        } else {
          setError("Este certificado consta como inválido ou revogado no sistema.");
        }
      } catch (err) {
        console.error("Erro na validação do hash/uuid:", err);
        setError("Certificado não encontrado ou código de autenticidade inexistente.");
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      verifyCertificate();
    }
  }, [uuid]);

  if (loading) return (
    <div className="min-h-screen bg-[#111315] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-brand-green" size={48} />
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Consultando protocolo SGEJ...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111315] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-8 border border-white/5 relative overflow-hidden">
        
        {error ? (

          <div className="text-center py-6 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-red-50 rounded-[28px] flex items-center justify-center text-red-500 mx-auto mb-6 shadow-inner">
              <ShieldAlert size={40} />
            </div>
            <h2 className="text-xl font-black uppercase text-brand-dark tracking-tight">Falha na Autenticação</h2>
            <p className="text-xs text-gray-400 mt-2 font-medium px-4 leading-relaxed">{error}</p>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">NextStep • Segurança Institucional</p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-green/10 rounded-[28px] flex items-center justify-center text-brand-green mx-auto mb-4 shadow-inner">
                <ShieldCheck size={40} />
              </div>
              <span className="text-[9px] bg-brand-green/10 text-brand-green px-3 py-1 rounded-full font-black uppercase tracking-widest">
                Documento Autêntico
              </span>
              <h2 className="text-xl font-black uppercase text-brand-dark tracking-tight mt-4">Verificação Concluída</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Este certificado foi emitido oficialmente pela NextStep</p>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-[24px] space-y-4 border border-gray-100">
              <div>
                <p className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Membro Beneficiário</p>
                <p className="text-sm font-black text-brand-dark uppercase mt-0.5">{certData.member_name}</p>
                <p className="text-[9px] font-bold text-gray-400 mt-0.5">MATRÍCULA: {certData.member_registration}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200/60">
                <div>
                  <p className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Carga Horária</p>
                  <p className="text-base font-black text-brand-green">120 Horas</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Data de Emissão</p>
                  <p className="text-xs font-bold text-brand-dark mt-1">
                    {certData.approved_at ? new Date(certData.approved_at).toLocaleDateString('pt-BR') : certData.issue_date}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200/60">
                <p className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Assinado Digitalmente por</p>
                <p className="text-xs font-bold text-brand-dark uppercase mt-0.5">{certData.approved_by_name || "Orientador(a) UFVJM"}</p>
              </div>
            </div>

            {/* Metadados de segurança permanentes */}
            <div className="mt-6 text-center space-y-1">
              <p className="text-[8px] font-mono text-gray-400 break-all bg-gray-50 p-2 rounded-lg border border-gray-100/50">
                HASH: {certData.auth_hash}
              </p>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] pt-4">
                SGEJ Cloud Protocol • UFVJM
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}