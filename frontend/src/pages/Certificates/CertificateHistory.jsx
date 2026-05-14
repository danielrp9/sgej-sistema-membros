import React, { useEffect, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { certificateService } from '@/services/certificates';
import { CertificateTemplate } from './components/CertificateTemplate.jsx';
import { History, ExternalLink, Loader2, ArrowLeft } from "lucide-react";
import { Link } from 'react-router-dom';

export default function CertificateHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await certificateService.getHistory();
      // Filtra apenas certificados já assinados
      const approved = response.data.filter(c => c.status === 'APPROVED');
      setHistory(approved);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const handleReconstructPDF = async (certificate) => {
    try {
      const doc = <CertificateTemplate certificate={certificate} />;
      const asPdf = pdf([]);
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (e) {
      alert("Erro ao reconstruir documento.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/audit" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-brand-muted" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-brand-dark uppercase font-nasa tracking-tight">Arquivo de Emissões</h1>
            <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest italic tracking-[0.2em]">Registros oficiais em formato textual</p>
          </div>
        </div>
        <div className="bg-brand-green/10 px-4 py-2 rounded-2xl border border-brand-green/20">
          <p className="text-[10px] font-black text-brand-green uppercase">Total: {history.length} Emitidos</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="animate-spin mx-auto text-brand-green" size={40} />
          </div>
        ) : history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-brand-muted uppercase">Membro</th>
                  <th className="px-8 py-5 text-[10px] font-black text-brand-muted uppercase text-center">Horas</th>
                  <th className="px-8 py-5 text-[10px] font-black text-brand-muted uppercase">Autenticação (Hash)</th>
                  <th className="px-8 py-5 text-[10px] font-black text-brand-muted uppercase text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-brand-dark">
                {history.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <p className="text-sm font-black uppercase leading-tight">{cert.member?.name}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">{cert.member?.registration}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-[10px] font-black bg-brand-green/10 text-brand-green px-3 py-1 rounded-full">
                        {cert.member?.calculated_hours}H
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <code className="text-[8px] text-gray-400 font-mono break-all">{cert.auth_hash}</code>
                        <p className="text-[8px] font-bold text-brand-muted uppercase mt-1">
                          Emitido em: {new Date(cert.approved_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleReconstructPDF(cert)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-brand-dark rounded-xl text-[9px] font-black uppercase hover:bg-brand-green hover:text-white transition-all border border-gray-100"
                      >
                        Gerar PDF <ExternalLink size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-24 text-center">
            <History className="mx-auto text-gray-200 mb-2" size={48} />
            <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">O histórico de assinaturas está vazio</p>
          </div>
        )}
      </div>
    </div>
  );
}