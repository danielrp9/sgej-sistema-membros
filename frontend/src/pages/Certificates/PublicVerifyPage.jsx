import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';

import logoImg from '../../assets/nexstep-logo.png';

export default function PublicVerifyPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [certData, setCertData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyDocument = async () => {
      let resolvedCode = code;
      
      if (!resolvedCode) {
        const pathSegments = window.location.pathname.split('/');
        resolvedCode = pathSegments[pathSegments.length - 1];
      }

      if (!resolvedCode || resolvedCode.trim() === '' || resolvedCode === 'verificar') {
        setError('Nenhum código ou hash de autenticidade foi fornecido.');
        setLoading(false);
        return;
      }

      try {
        const cleanCode = resolvedCode.trim();
        
        const response = await api.get(`/public/verify/${cleanCode}/`);
        
        if (response.data && response.data.certificate) {
          setCertData(response.data.certificate);
        } else {
          setError('Documento não encontrado na base oficial SGEJ.');
        }
      } catch (err) {
        console.error("Erro na verificação do certificado:", err);
        if (err.response && err.response.status === 404) {
          setError('Falha na Autenticação: Certificado não encontrado ou código de autenticidade inexistente.');
        } else {
          setError('Erro de conexão ao tentar validar o documento junto à base de dados SGEJ.');
        }
      } finally {
        setLoading(false);
      }
    };

    verifyDocument();
  }, [code]);

  return (
    <div className="min-h-screen w-full bg-[#111315] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos visuais de fundo */}
      <div className="absolute top-[-20%] left-[-15%] w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-[580px] z-10 animate-in fade-in zoom-in duration-500">
        {/* Card Principal */}
        <div className="bg-[#1A1D1F] border border-white/5 rounded-[32px] p-8 shadow-2xl relative backdrop-blur-xl">
          
          {/* Topo da Página Social */}
          <div className="text-center mb-8 select-none">
            <div className="w-14 h-14 mx-auto mb-3 flex items-center justify-center">
              <img 
                src={logoImg} 
                alt="NextStep Logo" 
                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,223,129,0.3)]"
              />
            </div>
            <h1 className="text-lg font-nasa tracking-[0.2em]">NextStep</h1>
            <p className="text-gray-500 text-[8px] mt-1 font-black uppercase tracking-[0.4em] opacity-50">Validador de Autenticidade Digital</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 size={36} className="text-brand-green animate-spin" />
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest animate-pulse">Consultando base SGEJ...</p>
            </div>
          ) : error ? (
            /* Tela de Erro de Autenticação */
            <div className="text-center py-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <XCircle size={32} />
              </div>
              <h2 className="text-md font-bold uppercase tracking-wider text-red-500 mb-2">Falha na Autenticação</h2>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto px-4">{error}</p>
              
              <div className="mt-8">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl border border-white/5 transition-all active:scale-[0.98]"
                >
                  <ArrowLeft size={14} />
                  Ir para Tela Inicial
                </button>
              </div>
            </div>
          ) : (
            /* Tela de Sucesso - Dados do Certificado Aprovado */
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-brand-green/10 border border-brand-green/20 text-brand-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(0,223,129,0.15)]">
                  <ShieldCheck size={36} />
                </div>
                <h2 className="text-md font-bold uppercase tracking-widest text-brand-green">Documento Autêntico</h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Registro verificado com sucesso na UFVJM</p>
              </div>

              {/* Ficha Técnico-Institucional Revestida */}
              <div className="bg-[#111315] border border-white/5 rounded-2xl p-5 space-y-4">
                <div>
                  <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-0.5">Colaborador(a) Beneficiário(a)</label>
                  <p className="text-xs font-bold text-white uppercase tracking-wide">{certData.member_name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Matrícula: {certData.member_registration} • {certData.member_email}</p>
                </div>

                <div className="border-t border-white/5 pt-3">
                  <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-0.5">Especificação da Atividade</label>
                  <p className="text-xs font-bold text-gray-200">{certData.title}</p>
                  <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{certData.description}</p>
                </div>

                <div className="border-t border-white/5 pt-3 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-0.5">Emissão Oficial</label>
                    <p className="text-xs font-bold text-gray-300">{certData.issue_date ? new Date(certData.issue_date).toLocaleDateString('pt-BR') : '---'}</p>
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-0.5">Status do Fluxo</label>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <CheckCircle2 size={12} className="text-brand-green" />
                      <p className="text-[10px] font-black text-brand-green uppercase tracking-wider">{certData.status_display || 'Aprovado'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3">
                  <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-0.5">Corpo de Assinaturas Digitais</label>
                  <p className="text-[9px] text-gray-400 mt-1 leading-normal">
                    ✓ {certData.president_name} (Presidente) <br />
                    ✓ {certData.director_name} (Recursos Humanos) <br />
                    ✓ {certData.orientador_name} (Orientadora PROAAE)
                  </p>
                </div>
              </div>

              {/* Chave Criptográfica hash */}
              <div className="text-center px-2">
                <p className="text-[8px] text-gray-500 font-mono break-all bg-black/20 p-2 rounded-xl border border-white/5">
                  HASH PERMANENTE: {certData.auth_hash}
                </p>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-500 hover:text-brand-green text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  Sair do Verificador
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Assinatura institucional de rodapé */}
        <div className="text-center mt-6">
          <p className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.4em]">SGEJ • Sistema de Gestão de Empresas Juniores</p>
        </div>
      </div>
    </div>
  );
}