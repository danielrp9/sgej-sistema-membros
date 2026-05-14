import { api } from './api';

export const memberService = {
  // Listagem com filtros (status, data, busca)
  getMembers: (params) => api.get('/members/', { params }),
  
  // Detalhes do membro (incluindo novos campos como CPF e Cargo)
  getMemberDetail: (id) => api.get(`/members/${id}/`),
  
  // Histórico de permanência para a linha do tempo
  getMemberHistory: (id) => api.get(`/members/${id}/history/`),
  
  // Estatísticas para os cards do Dashboard
  getStats: () => api.get('/members/stats/'),
  
  // Criação de novo membro (POST)
  createMember: (data) => api.post('/members/', data),

  /**
   * Encerra as atividades do membro (POST)
   * Dispara o cálculo de 6h semanais no Django e gera rascunho do certificado.
   */
  terminateMember: (id) => api.post(`/members/${id}/terminate/`),
};