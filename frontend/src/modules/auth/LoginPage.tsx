// Exemplo rápido de uma tela de login institucional
export function LoginPage() {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f1f5f9' 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#1e3a8a', marginBottom: '10px' }}>NextStep</h1>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>Sistema de Gestão de Membros</p>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="E-mail institucional" 
            style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
          />
          <input 
            type="password" 
            placeholder="Senha" 
            style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
          />
          <button style={{ 
            padding: '12px', 
            backgroundColor: '#1e3a8a', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}