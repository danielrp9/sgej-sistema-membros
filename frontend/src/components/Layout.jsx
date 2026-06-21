import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Bell, Search, Menu } from "lucide-react";
import { api } from "../services/api";

export default function Layout() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get logged user info
  const userJson = localStorage.getItem("@SGEJ:user");
  const user = userJson ? JSON.parse(userJson) : null;
  const initial = user?.full_name 
    ? user.full_name.charAt(0).toUpperCase() 
    : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/auth/notifications/");
      setNotifications(response.data);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds to fetch new notifications in background
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleRead = async (id, currentIsRead) => {
    try {
      await api.patch(`/auth/notifications/${id}/`, { is_read: !currentIsRead });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: !currentIsRead } : n)
      );
    } catch (error) {
      console.error("Erro ao atualizar notificação:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      try {
        await api.patch(`/auth/notifications/${notification.id}/`, { is_read: true });
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
        );
      } catch (error) {
        console.error("Erro ao marcar como lida:", error);
      }
    }
    setShowNotifications(false);
    if (notification.certificate_id) {
      navigate("/audit", { state: { highlightId: notification.certificate_id } });
    } else {
      navigate("/audit");
    }
  };

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const unreadCount = unreadNotifications.length;
  const filteredNotifications = showAll ? notifications : unreadNotifications;

  return (
    <div className="flex h-screen bg-[#111315] overflow-hidden">
      {/* Sidebar com z-index controlado e responsivo */}
      <div className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 transform md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Backdrop para fechar o menu no mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Layout principal ajustando o espaçamento no mobile */}
      <div className="flex-1 p-2 md:p-3 flex flex-col min-w-0 overflow-hidden">
        <div className="h-full bg-white rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col shadow-2xl relative">
          
          {/* Top Bar Interna Responsiva */}
          <header className="px-4 md:px-8 py-4 md:py-6 flex items-center justify-between border-b border-gray-50 shrink-0 relative z-10">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 rounded-xl text-gray-500 hover:bg-gray-100 md:hidden cursor-pointer"
                aria-label="Abrir menu"
              >
                <Menu size={20} />
              </button>
              <h2 className="text-sm md:text-xl font-bold text-brand-dark uppercase tracking-tight">NextStep Dashboard</h2>
            </div>
            <div className="flex items-center gap-4">
              {/* Botão de Notificações e Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors relative"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-gray-50 flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-800">Notificações</span>
                        <button 
                          onClick={() => setShowAll(!showAll)}
                          className="text-[9px] text-brand-green font-black uppercase tracking-widest hover:underline"
                        >
                          {showAll ? "Apenas Não Lidas" : "Ver Todas"}
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        {filteredNotifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-xs text-gray-400">
                            Nenhuma notificação encontrada
                          </div>
                        ) : (
                          filteredNotifications.map(notification => (
                            <div 
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 flex gap-3 items-start last:border-b-0 ${!notification.is_read ? 'bg-brand-green/5' : ''}`}
                            >
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs ${!notification.is_read ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                                  {notification.title}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-0.5 break-words">
                                  {notification.message}
                                </p>
                                <span className="text-[8px] text-gray-400 mt-1 block">
                                  {new Date(notification.created_at).toLocaleString('pt-BR')}
                                </span>
                              </div>
                              <div 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleRead(notification.id, notification.is_read);
                                }}
                                className="flex items-center self-center p-1 hover:bg-gray-100 rounded-full shrink-0"
                                title={notification.is_read ? "Marcar como não lida" : "Marcar como lida"}
                              >
                                {!notification.is_read ? (
                                  <div className="w-2.5 h-2.5 rounded-full bg-brand-green shrink-0"></div>
                                ) : (
                                  <div className="w-2.5 h-2.5 rounded-full border border-gray-400 shrink-0"></div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Perfil Dinâmico */}
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-2xl bg-brand-green text-white flex items-center justify-center font-black text-sm border-2 border-white shadow-md shadow-brand-green/10 select-none hover:scale-105 transition-transform cursor-pointer"
                  title={user?.full_name || user?.email}
                >
                  {initial}
                </div>
                <div className="flex flex-col text-left hidden sm:flex">
                  <span className="text-xs font-black text-brand-dark tracking-tight leading-none">
                    {user?.full_name || 'Usuário'}
                  </span>
                  <span className="text-[9px] text-brand-muted font-bold uppercase tracking-widest mt-1">
                    {user?.role_display || (user?.role === 'president' ? 'Presidente' : user?.role === 'director' ? 'RH' : 'Coordenador')}
                  </span>
                </div>
              </div>

            </div>
          </header>

          {/* Área de Conteúdo */}
          <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar relative z-0">
            <div className="relative pointer-events-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}