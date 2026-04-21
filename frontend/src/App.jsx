import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members/index";

export default function App() {
  const isAuthenticated = !!localStorage.getItem("@SGEJ:token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="members" element={<Members />} />
          <Route path="certificates" element={<div className="p-10 font-bold">Gerenciamento de Certificados</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}