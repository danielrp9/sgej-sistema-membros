import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";

// Importação fictícia dos módulos que você criou nas pastas
// À medida que você criar os arquivos, basta importar aqui
const LoginPage = () => <div>Tela de Login (Módulo Auth)</div>;
const MemberListPage = () => <div>Lista de Membros (Módulo Members)</div>;
const MemberFormPage = () => <div>Cadastro de Membro (Módulo Members)</div>;
const CertificatesPage = () => <div>Gestão de Certificados (Módulo Certificates)</div>;

export function AppRoutes() {
  // Simulação de autenticação (depois você integra com o Carlos)
  const isAuthenticated = !!localStorage.getItem("@SGEJ:token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas Protegidas (Dashboard) */}
        <Route
          path="/"
          element={
            isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />
          }
        >
          {/* Redireciona a raiz para a lista de membros */}
          <Route index element={<Navigate to="/members" />} />
          
          <Route path="members">
            <Route index element={<MemberListPage />} />
            <Route path="new" element={<MemberFormPage />} />
            <Route path="edit/:id" element={<MemberFormPage />} />
          </Route>

          <Route path="certificates" element={<CertificatesPage />} />
        </Route>

        {/* Rota 404 - Not Found */}
        <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}