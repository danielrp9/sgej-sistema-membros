import React, { useState } from 'react';
import { X, UserPlus, Loader2, CreditCard, GraduationCap, Briefcase } from 'lucide-react';
import { memberService } from '../../services/members';

export default function AddMemberModal({ isOpen, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    registration: '',
    course: 'Sistemas de Informação',
    role: '',
    department: '',
    entry_date: new Date().toISOString().split('T')[0],
    status: 'ACTIVE'
  });

  // Função para aplicar máscara de CPF (000.000.000-00)
  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito
    if (value.length <= 11) {
      value = value.replace(/(\={3})(\={3})(\={3})(\={2})/, "$1.$2.$3-$4");
      setFormData({ ...formData, cpf: value });
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await memberService.createMember(formData);
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar:", error.response?.data);
      alert("Erro ao cadastrar membro. Verifique se os dados (E-mail, CPF ou Matrícula) já existem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        
        {/* Header do Modal */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-green rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-green/20">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-brand-dark uppercase tracking-tight">Novo Colaborador</h2>
              <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest">Cadastro NextStep Tech</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Nome Completo */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
            <input 
              required
              type="text" 
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-4 focus:ring-brand-green/5 transition-all"
              placeholder="Ex: Daniel Rodrigues Pereira"
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* E-mail e CPF */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                E-mail Corporativo
              </label>
              <input 
                required
                type="email" 
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-4 focus:ring-brand-green/5 transition-all"
                placeholder="nome@nextstep.com"
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <CreditCard size={10} className="text-brand-green" /> CPF
              </label>
              <input 
                required
                type="text" 
                value={formData.cpf}
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-4 focus:ring-brand-green/5 transition-all"
                placeholder="000.000.000-00"
                onChange={handleCpfChange}
              />
            </div>
          </div>

          {/* Matrícula e Curso */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Matrícula</label>
              <input 
                required
                type="text" 
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-4 focus:ring-brand-green/5 transition-all"
                placeholder="2024123..."
                onChange={e => setFormData({...formData, registration: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <GraduationCap size={10} className="text-brand-green" /> Curso
              </label>
              <input 
                required
                type="text" 
                value={formData.course}
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-4 focus:ring-brand-green/5 transition-all"
                placeholder="Ex: Sistemas de Informação"
                onChange={e => setFormData({...formData, course: e.target.value})}
              />
            </div>
          </div>

          {/* Cargo e Departamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <Briefcase size={10} className="text-brand-green" /> Cargo
              </label>
              <input 
                required
                type="text" 
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-4 focus:ring-brand-green/5 transition-all"
                placeholder="Ex: Dev Full-stack"
                onChange={e => setFormData({...formData, role: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Departamento</label>
              <input 
                required
                type="text" 
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-4 focus:ring-brand-green/5 transition-all"
                placeholder="Ex: Projetos"
                onChange={e => setFormData({...formData, department: e.target.value})}
              />
            </div>
          </div>

          {/* Data de Ingresso e Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Data de Ingresso</label>
              <input 
                required
                type="date" 
                value={formData.entry_date}
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-4 focus:ring-brand-green/5 transition-all"
                onChange={e => setFormData({...formData, entry_date: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status Inicial</label>
              <select 
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-4 focus:ring-brand-green/5 transition-all appearance-none"
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="ACTIVE">ATIVO</option>
                <option value="SUSPENDED">SUSPENSO</option>
                <option value="INACTIVE">INATIVO</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-dark transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-[2] bg-brand-dark text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Finalizar Cadastro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}