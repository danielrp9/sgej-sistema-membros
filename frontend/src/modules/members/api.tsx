import { api } from "../../services/api";

export interface Member {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'EGRESS';
  entry_date: string;
}

export const MemberService = {
  list: () => api.get<Member[]>('/members/'),
  get: (id: string) => api.get<Member>(`/members/${id}/`),
  create: (data: Partial<Member>) => api.post('/members/', data),
};