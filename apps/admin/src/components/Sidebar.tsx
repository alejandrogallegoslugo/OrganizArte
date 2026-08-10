import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  CalendarClock,
  CalendarDays,
  Building2,
  Music2,
  QrCode,
  FileCheck2,
  Building,
  LogOut,
  Palette,
  Settings,
  Users,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'approvals'
  | 'availability'
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
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingApprovalsCount,
  adminUser,
  onLogout,
}) => {
  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard Artístico', icon: <LayoutDashboard style={{ width: 18, height: 18 }} /> },
    { id: 'approvals', label: 'Aprobación Alumnos', icon: <UserCheck style={{ width: 18, height: 18 }} />, badge: pendingApprovalsCount },
    { id: 'availability', label: 'Matriz & IA Horarios', icon: <CalendarClock style={{ width: 18, height: 18 }} /> },
    { id: 'cast', label: 'Reparto & Personajes', icon: <Users style={{ width: 18, height: 18 }} /> },
    { id: 'rehearsals', label: 'Agenda & Ensayos', icon: <CalendarDays style={{ width: 18, height: 18 }} /> },
    { id: 'rooms', label: 'Salones Tec & Permisos', icon: <Building2 style={{ width: 18, height: 18 }} /> },
    { id: 'songs', label: 'Repertorio & Guías', icon: <Music2 style={{ width: 18, height: 18 }} /> },
    { id: 'attendance', label: 'Pase de Lista QR', icon: <QrCode style={{ width: 18, height: 18 }} /> },
    { id: 'justifications', label: 'Justificantes', icon: <FileCheck2 style={{ width: 18, height: 18 }} /> },
    { id: 'companies', label: 'Compañías & Elencos', icon: <Palette style={{ width: 18, height: 18 }} /> },
    { id: 'campuses', label: 'Configuración & Campuses', icon: <Settings style={{ width: 18, height: 18 }} /> },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      <div>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 12px 24px 12px', borderBottom: '1px solid var(--border-color)' }}>
          <img
            src="/logo.png"
            alt="OrganizArte Logo"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              objectFit: 'cover',
              boxShadow: '0 4px 14px rgba(6, 182, 212, 0.4)'
            }}
          />
          <div>
            <h1 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 800, lineHeight: 1.1 }}>OrganizArte</h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Compañía Artística Tec</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '16px' }}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'var(--primary-glow)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span style={{
                    background: 'var(--accent-amber)',
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

      {/* User Profile Badge & Logout */}
      <div style={{
        padding: '12px',
        background: 'var(--bg-dark)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '0.75rem'
          }}>
            SA
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {adminUser?.name || 'Prof. Alejandro Gallegos'}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
              Super Admin
            </div>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-rose)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Cerrar Sesión"
          >
            <LogOut style={{ width: '16px', height: '16px' }} />
          </button>
        )}
      </div>
    </aside>
  );
};
