import React, { useState, useEffect } from 'react';
import { Upload, FileText, Send, Loader2, CheckCircle, Search, User } from "lucide-react";
import { certificateService } from '../../services/certificates';
import { api } from '../../services/api';

export default function CertificateSubmit() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    member: '',      // ID do membro para o banco
    memberName: '',  // Nome para exibição no campo
    title: '',
    hours: '',
    file: null
  });

  useEffect(() => {
    async function loadMembers() {
      try {
        const response = await api.get('/members/');
        setMembers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erro ao carregar membros:", error);
      }
    }
    loadMembers();
  }, []);

  // Filtra membros por nome ou matrícula conforme a digitação
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.registration.includes(searchTerm)
  );

  const selectMember = (member) => {
    setFormData({ 
      ...formData, 
      member: member.id, 
      memberName: `${member.registration} - ${member.name}` 
    });
    setSearchTerm(`${member.registration} - ${member.name}`);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.member) return alert("Selecione um membro válido da lista.");
    if (!formData.file) return alert("Selecione o arquivo PDF.");

    setLoading(true);
    const data = new FormData();
    data.append('member', formData.member);
    data.append('title', formData.title);
    data.append('hours', formData.hours);
    data.append('file', formData.file);

    try {
      await certificateService.upload(data);
      setSuccess(true);
      setFormData({ member: '', memberName: '', title: '', hours: '', file: null });
      setSearchTerm("");
    } catch (error) {
      // ✅ CORREÇÃO AQUI: Tratamento robusto para evitar "undefined"
      const errorDetail = error.response?.data;
      const message = errorDetail 
        ? (typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail))
        : "Erro de conexão com o servidor SGEJ.";
      
      alert("Erro no cadastro: " + message);
      console.error("Erro na submissão:", error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[40px] shadow-sm animate-in zoom-in-95">
        <CheckCircle size={60} className="text-brand-green mb-4" />
        <h2 className="text-xl font-black text-brand-dark uppercase">Documento Associado!</h2>
        <button onClick={() => setSuccess(false)} className="mt-6 bg-brand-dark text-white px-8 py-3 rounded-2xl font-bold uppercase text-[10px]">Novo Lançamento</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
      <h1 className="text-2xl font-black text-brand-dark uppercase font-nasa tracking-tight">Registro de Certificado</h1>

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
        
        {/* Busca Dinâmica de Membro */}
        <div className="space-y-2 relative">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            <User size={12} /> Identificar Membro (Matrícula ou Nome)
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Digite para pesquisar..."
              className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm outline-none focus:ring-4 focus:ring-brand-green/5"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
          </div>

          {/* Dropdown de Resultados */}
          {showDropdown && searchTerm.length > 0 && (
            <div className="absolute w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-48 overflow-y-auto custom-scrollbar">
              {filteredMembers.length > 0 ? filteredMembers.map(m => (
                <div 
                  key={m.id}
                  onClick={() => selectMember(m)}
                  className="p-4 hover:bg-brand-green-light cursor-pointer border-b border-gray-50 last:border-none group"
                >
                  <p className="text-xs font-bold text-brand-dark group-hover:text-brand-green">
                    <span className="opacity-50">{m.registration}</span> — {m.name}
                  </p>
                </div>
              )) : (
                <p className="p-4 text-[10px] text-brand-muted uppercase font-bold text-center">Nenhum membro encontrado</p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Título da Atividade</label>
          <input 
            required
            type="text" 
            placeholder="Ex: Workshop NextStep 2026"
            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-4 focus:ring-brand-green/5"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Horas</label>
            <input 
              required
              type="number" 
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-4 focus:ring-brand-green/5"
              value={formData.hours}
              onChange={e => setFormData({...formData, hours: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Arquivo PDF</label>
            <div className="relative bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-gray-200 flex items-center justify-center gap-2">
              <input 
                required
                type="file" 
                accept=".pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={e => setFormData({...formData, file: e.target.files[0]})}
              />
              <FileText size={16} />
              <span className="text-[10px] font-bold uppercase truncate">
                {formData.file ? formData.file.name : "Selecionar"}
              </span>
            </div>
          </div>
        </div>

        <button 
          disabled={loading}
          type="submit"
          className="w-full bg-brand-dark text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Send size={16} /> Associar ao Membro</>}
        </button>
      </form>
    </div>
  );
}