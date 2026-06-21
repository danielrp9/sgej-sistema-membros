import { api } from './api';

export const certificateService = {
  // Lista rascunhos aguardando assinatura
  getPendingAudits: () => api.get('/certificates/pending-signature/'),
  
  // Busca estatísticas quantitativas dos certificados
  getStats: () => api.get('/certificates/stats/'),

  
  // ✅ Corrigido: Endpoint de assinatura alinhado com a view de aprovação
  signCertificate: (id, data) => api.post(`/certificates/${id}/approval/`, data),
  
  // Lista certificados finalizados (aprovados)
  getHistory: () => api.get('/certificates/'), 
  
  // Download oficial do certificado assinado
  downloadOfficial: (id) => api.get(`/certificates/${id}/`, { responseType: 'blob' }),
};