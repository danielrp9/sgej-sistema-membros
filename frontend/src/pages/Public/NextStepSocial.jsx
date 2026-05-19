import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Code, Sparkles, Cpu, Mail, MapPin, Instagram, Search, HelpCircle } from 'lucide-react';
import logoImg from '../../assets/nexstep-logo.png';

export default function NextStepSocial() {
  const navigate = useNavigate();
  const [hashInput, setHashInput] = useState('');

  const handleManualVerify = (e) => {
    e.preventDefault();
    if (!hashInput.trim()) return;
    navigate(`/verificar/${hashInput.trim()}`);
  };

  return (
    <div className="min-h-screen bg-[#111315] text-white font-sans selection:bg-brand-green selection:text-black overflow-x-hidden relative">
      
      {/* BACKGROUND ORBS */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-green/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* HEADER / NAVBAR */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="NextStep Logo" className="w-9 h-9 object-contain drop-shadow-[0_0_8px_rgba(0,135,90,0.3)]" />
          <span className="text-sm font-nasa tracking-widest pt-1">NextStep</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-brand-green hover:text-black hover:border-brand-green rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          Acesso Restrito
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-green/10 border border-brand-green/20 rounded-full text-brand-green text-[9px] font-black uppercase tracking-widest mb-6">
          <Sparkles size={12} /> Soluções Digitais UFVJM
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight font-nasa mb-6 leading-tight">
          Qual o <span className="text-brand-green">Próximo Passo</span> <br /> da sua Empresa?
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
          Transformamos ideias em realidade através de tecnologia, design moderno e engenharia de software de alto nível. Conheça o ecossistema NextStep.
        </p>
      </section>

      {/* CENTRAL DE VERIFICAÇÃO MANUAL */}
      <section className="max-w-xl mx-auto px-6 pb-24 relative z-10">
        <div className="bg-[#1A1D1F] border border-white/5 p-8 rounded-[32px] shadow-2xl relative backdrop-blur-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider">Verificador de Certificados</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Validação Manual por UUID / Hash</p>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Recebeu um certificado impresso ou digital emitido pela NextStep? Insira o código identificador contido no rodapé do documento para atestar sua veracidade textual imediatamente.
          </p>

          <form onSubmit={handleManualVerify} className="space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="Insira o código UUID (Ex: 81492013...)"
                className="w-full bg-[#111315] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-xs outline-none focus:ring-2 focus:ring-brand-green/20 transition-all font-mono"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-brand-green hover:bg-brand-green/90 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all"
            >
              Autenticar Documento <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </section>

      {/* GRID DE SERVIÇOS INSTITUCIONAIS */}
      <section className="max-w-6xl mx-auto px-6 pb-28 relative z-10">
        <p className="text-[10px] font-black text-center text-gray-600 tracking-[0.3em] uppercase mb-12">Nossas Soluções Digitais</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white/3 border border-white/5 rounded-3xl p-8 hover:border-brand-green/20 transition-all group">
            <Code className="text-brand-green mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h4 className="font-black uppercase tracking-wider text-sm mb-3">Dev Web & Mobile</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Sistemas integrados, plataformas em nuvem escaláveis e aplicações móveis sob medida com arquitetura de software limpa.</p>
          </div>

          <div className="bg-white/3 border border-white/5 rounded-3xl p-8 hover:border-brand-green/20 transition-all group">
            <Sparkles className="text-brand-green mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h4 className="font-black uppercase tracking-wider text-sm mb-3">UI/UX & Branding</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Design de interfaces modernas com foco extremo na experiência do usuário, além de construção de identidade de marca robusta.</p>
          </div>

          <div className="bg-white/3 border border-white/5 rounded-3xl p-8 hover:border-brand-green/20 transition-all group">
            <Cpu className="text-brand-green mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h4 className="font-black uppercase tracking-wider text-sm mb-3">Infraestrutura & Cloud</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Configuração de servidores seguros, bancos de dados corporativos protegidos e pipelines de entrega automatizados.</p>
          </div>

        </div>
      </section>

      {/* CONTATO / FOOTER SOCIAL */}
      <section className="bg-[#1A1D1F] border-t border-white/5 py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-nasa text-lg tracking-wider mb-2">Fale Conosco</h3>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm mb-8">Desenvolva seu projeto com uma equipe qualificada sob a tutela institucional e técnica da UFVJM.</p>
            
            <div className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <div className="flex items-center gap-3"><Mail size={16} className="text-brand-green" /> next.step@ufvjm.edu.br</div>
              <div className="flex items-center gap-3"><MapPin size={16} className="text-brand-green" /> Campus JK • Diamantina, MG</div>
              <div className="flex items-center gap-3"><Instagram size={16} className="text-brand-green" /> @nextstep.ufvjm</div>
            </div>
          </div>

          <div className="bg-[#111315] border border-white/5 p-8 rounded-3xl border-dashed border-brand-green/20 text-center">
            <HelpCircle size={32} className="text-brand-green mx-auto mb-4" />
            <h4 className="font-black text-xs uppercase tracking-wider mb-2">Precisa de Suporte Acadêmico?</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed px-4">Coordenadores de curso e secretarias podem contactar nossa equipe para validações de lotes ou esclarecimentos sobre as horas complementares.</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">SGEJ Cloud Protocol v1.0 • NextStep</p>
          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">© 2026 Todos os direitos reservados</p>
        </div>
      </section>

    </div>
  );
}