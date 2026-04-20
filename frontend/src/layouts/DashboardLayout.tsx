import { Outlet, Link } from "react-router-dom";

export function DashboardLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar Simples */}
      <aside style={{ width: '250px', backgroundColor: '#1e3a8a', color: 'white', padding: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '30px' }}>NextStep SGEJ</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/members" style={{ color: 'white', textDecoration: 'none' }}>Membros</Link>
          <Link to="/certificates" style={{ color: 'white', textDecoration: 'none' }}>Certificados</Link>
          <button 
            onClick={() => { localStorage.removeItem("@SGEJ:token"); window.location.reload(); }}
            style={{ marginTop: '20px', cursor: 'pointer', background: 'none', border: '1px solid white', color: 'white' }}
          >
            Sair
          </button>
        </nav>
      </aside>

      {/* Área de Conteúdo */}
      <main style={{ flex: 1, backgroundColor: '#f8fafc', padding: '20px', overflowY: 'auto' }}>
        <header style={{ marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
          <span>Usuário: <strong>Daniel Rodrigues (Diretoria)</strong></span>
        </header>
        
        {/* O Outlet renderiza a rota filha selecionada */}
        <Outlet />
      </main>
    </div>
  );
}