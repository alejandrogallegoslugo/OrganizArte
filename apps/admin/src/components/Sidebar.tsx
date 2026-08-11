import React from 'react';
import {
  Home,
  UserCheck,
  CalendarClock,
  CalendarDays,
  Building2,
  Music2,
  QrCode,
  FileCheck2,
  LogOut,
  Palette,
  Settings,
  Users,
  MessageSquare,
  X,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'approvals'
  | 'availability'
  | 'chat'
  | 'cast'
  | 'rehearsals'
  | 'rooms'
  | 'songs'
  | 'attendance'
  | 'justifications'
  | 'companies'
  | 'campuses';

interface SidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingApprovalsCount: number;
  adminUser?: { name: string; email: string; role: string } | null;
  onLogout?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingApprovalsCount,
  adminUser,
  onLogout,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Inicio', icon: <Home style={{ width: 18, height: 18 }} /> },
    { id: 'approvals', label: 'Alumnos', icon: <UserCheck style={{ width: 18, height: 18 }} />, badge: pendingApprovalsCount },
    { id: 'availability', label: 'Horarios', icon: <CalendarClock style={{ width: 18, height: 18 }} /> },
    { id: 'chat', label: 'Chat Interno', icon: <MessageSquare style={{ width: 18, height: 18 }} /> },
    { id: 'cast', label: 'Proyectos', icon: <Users style={{ width: 18, height: 18 }} /> },
    { id: 'rehearsals', label: 'Agenda', icon: <CalendarDays style={{ width: 18, height: 18 }} /> },
    { id: 'rooms', label: 'Salones', icon: <Building2 style={{ width: 18, height: 18 }} /> },
    { id: 'songs', label: 'Repertorio', icon: <Music2 style={{ width: 18, height: 18 }} /> },
    { id: 'attendance', label: 'Asistencia', icon: <QrCode style={{ width: 18, height: 18 }} /> },
    { id: 'justifications', label: 'Justificantes', icon: <FileCheck2 style={{ width: 18, height: 18 }} /> },
    { id: 'companies', label: 'Elencos', icon: <Palette style={{ width: 18, height: 18 }} /> },
    { id: 'campuses', label: 'Campuses', icon: <Settings style={{ width: 18, height: 18 }} /> },
  ];

  const handleSelectTab = (tabId: AdminTab) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 400,
          }}
        />
      )}

      <aside
        className={`sidebar-container ${mobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: '240px',
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '20px 14px',
          height: 'calc(100vh - 64px)',
          position: 'sticky',
          top: '64px',
          overflowY: 'auto',
          zIndex: 450,
        }}
      >
        <div>
          {/* Mobile Header Close Button */}
          {mobileOpen && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Módulos Arte y Cultura</span>
              <button onClick={onCloseMobile} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>
          )}

          {/* Main Section Link */}
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={() => handleSelectTab('dashboard')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'dashboard' ? '#e0f2fe' : 'transparent',
                color: activeTab === 'dashboard' ? '#0033a0' : '#475569',
                fontWeight: activeTab === 'dashboard' ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <Home style={{ width: 18, height: 18, color: activeTab === 'dashboard' ? '#0033a0' : '#64748b' }} />
              <span>Inicio</span>
            </button>
          </div>

          {/* Section Header: MÓDULOS */}
          <div style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '8px 12px 6px 12px',
          }}>
            MÓDULOS DEL SISTEMA
          </div>

          {/* Services Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {menuItems.slice(1).map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isActive ? '#f1f5f9' : 'transparent',
                    color: isActive ? '#0033a0' : '#475569',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: isActive ? '#0033a0' : '#64748b' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span style={{
                      background: '#ec4899',
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '999px'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer: Service Status & User Logout */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginBottom: '12px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <span>Servicios Tec: OK</span>
          </div>

          <div style={{
            padding: '10px 12px',
            background: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {adminUser?.name || 'Prof. Alejandro Gallegos'}
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                style={{ background: 'none', border: 'none', color: '#e11d48', cursor: 'pointer', padding: '4px' }}
                title="Cerrar sesión"
              >
                <LogOut style={{ width: 16, height: 16 }} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
