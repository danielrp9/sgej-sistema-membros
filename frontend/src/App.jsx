import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members/index";
import MemberDetail from "./pages/Members/MemberDetail";
import CertificateAudit from "./pages/Certificates/Audit"; 
import CertificateSubmit from "./pages/Certificates/Submit";
import CertificateHistory from './pages/Certificates/CertificateHistory';

export default function App() {
  const isAuthenticated = !!localStorage.getItem("@SGEJ:token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Autenticação */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
        />
        
        {/* Rotas Protegidas e com Layout (Menu Lateral + Header)
          Tudo que estiver dentro deste Route herdará o Sidebar e o Outlet
        */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          {/* Dashboard Principal */}
          <Route index element={<Dashboard />} />
          
          {/* Módulo de Membros */}
          <Route path="members" element={<Members />} />
          <Route path="members/:id" element={<MemberDetail />} />
          
          {/* Módulo de Certificados - Auditoria */}
          <Route path="audit" element={<CertificateAudit />} />
          
          {/* Módulo de Certificados - Histórico Permanente (Corrigido para dentro do Layout) */}
          <Route path="history-certificates" element={<CertificateHistory />} />
          
          {/* Outras rotas auxiliares */}
          <Route path="certificates" element={<CertificateSubmit />} />
        </Route>

        {/* Redirecionamento Padrão */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}