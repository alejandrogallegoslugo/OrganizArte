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
  Sparkles,
  Shield,
  ChevronRight,
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
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 400,
          }}
        />
      )}

      <aside
        className={`sidebar-container ${mobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: '260px',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 16px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflowY: 'auto',
          zIndex: 450,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div>
          {/* Brand Logo Banner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 14px var(--primary-glow)'
              }}>
                <Sparkles style={{ width: '22px', height: '22px' }} />
              </div>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
                  OrganizArte
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '2px' }}>
                  Arte & Cultura Tec
                </div>
              </div>
            </div>

            {mobileOpen && (
              <button onClick={onCloseMobile} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            )}
          </div>

          {/* Section Header: MÓDULOS */}
          <div style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '4px 12px 10px 12px',
          }}>
            PANEL DE CONTROL
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: isActive ? '1px solid var(--primary-glow)' : '1px solid transparent',
                    background: isActive ? 'var(--primary-light)' : 'transparent',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span style={{
                        background: 'var(--rose-accent)',
                        color: '#ffffff',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        boxShadow: '0 2px 8px rgba(244, 63, 94, 0.3)'
                      }}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight style={{ width: 14, height: 14, color: 'var(--primary)' }} />}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer: User Profile & Security Status */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '10px', fontSize: '0.75rem', color: 'var(--emerald-accent)', fontWeight: 700 }}>
            <Shield style={{ width: '14px', height: '14px' }} />
            <span>Sistema Seguro & Conectado</span>
          </div>

          <div style={{
            padding: '12px',
            background: 'var(--bg-dark)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {adminUser?.name || 'Prof. Alejandro Gallegos'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Director Arte & Cultura
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                style={{ background: 'none', border: 'none', color: 'var(--rose-accent)', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
                title="Cerrar sesión"
              >
                <LogOut style={{ width: 18, height: 18 }} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
