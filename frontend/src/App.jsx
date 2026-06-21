import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members/index";
import MemberDetail from "./pages/Members/MemberDetail";
import CertificateAudit from "./pages/Certificates/Audit"; 
import CertificateSubmit from "./pages/Certificates/Submit";
import CertificateHistory from './pages/Certificates/CertificateHistory';

// ✅ Caminho atualizado apontando para a nova pasta 'Public' em 'src/pages'
import PublicVerifyPage from "./pages/Certificates/PublicVerifyPage";
import NextStepSocial from "./pages/Public/NextStepSocial";
import { ModalProvider } from "./components/ModalContext";

export default function App() {
  const isAuthenticated = !!localStorage.getItem("@SGEJ:token");

  return (
    <ModalProvider>
      <BrowserRouter>
      <Routes>
        {/* ROTA RAIZ DA APLICAÇÃO
          Se NÃO estiver logado: Abre a página institucional/social com o verificador por hash.
          Se ESTIVER logado: Redireciona automaticamente para o Dashboard interno protegido.
        */}
        <Route 
          path="/" 
          element={!isAuthenticated ? <NextStepSocial /> : <Navigate to="/dashboard" />} 
        />

        {/* Rota de Autenticação */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
        />
        
        {/* Rota Pública de Validação Instantânea (Acessível via QR Code ou Link) */}
        <Route 
          path="/verificar/:uuid" 
          element={<PublicVerifyPage />} 
        />
        
        {/* VINCULAÇÃO DO LAYOUT (Área Restrita / Administrativa)
          Tudo dentro deste bloco exige autenticação e herdará o menu lateral.
        */}
        <Route 
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          {/* Dashboard agora responde em /dashboard se o usuário estiver logado */}
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Módulo de Membros */}
          <Route path="members" element={<Members />} />
          <Route path="members/:id" element={<MemberDetail />} />
          
          {/* Módulo de Certificados - Fila de Assinaturas */}
          <Route path="audit" element={<CertificateAudit />} />
          
          {/* Módulo de Certificados - Histórico Permanente */}
          <Route path="history-certificates" element={<CertificateHistory />} />
          
          {/* Rota Auxiliar */}
          <Route path="certificates" element={<CertificateSubmit />} />
        </Route>

        {/* Redirecionamento Padrão */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
      </Routes>
    </BrowserRouter>
    </ModalProvider>
  );
}