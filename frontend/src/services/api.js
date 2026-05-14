import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1', 
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@SGEJ:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("@SGEJ:token");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);