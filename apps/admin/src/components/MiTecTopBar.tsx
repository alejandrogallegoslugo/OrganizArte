import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Bell,
  Bookmark,
  Grid,
  HelpCircle,
  Smile,
  CheckCircle2,
  Sun,
  Moon,
  LogOut,
  Sparkles,
  ExternalLink,
  UserCheck,
  Calendar,
  Building2,
  Music,
  FileCheck,
  X,
  Menu,
  CalendarClock,
  CalendarDays,
  Users,
  Music2,
  QrCode,
  FileCheck2,
  Palette,
  Settings,
} from 'lucide-react';
import { StudentProfile } from '../shared';

export interface UserRoleProfile {
  id: string;
  label: string;
  roleDescription: string;
}

interface MiTecTopBarProps {
  adminName?: string;
  userProfiles?: UserRoleProfile[];
  onSearchSelect?: (tab: string) => void;
  onLogout?: () => void;
  students?: StudentProfile[];
  pendingApprovalsCount?: number;
  onToggleMobileSidebar?: () => void;
}

const DEFAULT_PROFILES: UserRoleProfile[] = [
  { id: 'director', label: 'Director de Compañía', roleDescription: 'Gestión General Tec' },
];

export const MiTecTopBar: React.FC<MiTecTopBarProps> = ({
  adminName = 'Prof. Alejandro Gallegos',
  userProfiles = DEFAULT_PROFILES,
  onSearchSelect,
  onLogout,
  students = [],
  pendingApprovalsCount = 0,
  onToggleMobileSidebar,
}) => {
  const [activeProfileId, setActiveProfileId] = useState(userProfiles[0]?.id || 'director');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Active Dropdowns State
  const [activeMenu, setActiveMenu] = useState<'profile' | 'reactions' | 'bookmarks' | 'grid' | 'notifications' | 'help' | 'user' | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Bookmarks State
  const [bookmarks] = useState<string[]>([
    'Alumnos',
    'Agenda',
    'Asistencia',
  ]);

  // Reactions / Mood State
  const [currentMood, setCurrentMood] = useState('🎭 Concierto Próximo');

  const toggleMenu = (menu: 'profile' | 'reactions' | 'bookmarks' | 'grid' | 'notifications' | 'help' | 'user') => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const hasMultipleProfiles = userProfiles.length > 1;

  // App modules for 9-dot grid launcher (Herramientas estilo Microsoft 365)
  const appModules = [
    { id: 'approvals', label: 'Alumnos', icon: <UserCheck style={{ width: '22px', height: '22px', color: '#0033a0' }} />, bg: '#e0f2fe' },
    { id: 'availability', label: 'Horarios', icon: <CalendarClock style={{ width: '22px', height: '22px', color: '#06b6d4' }} />, bg: '#e0f2fe' },
    { id: 'cast', label: 'Proyectos', icon: <Users style={{ width: '22px', height: '22px', color: '#7c3aed' }} />, bg: '#f3e8ff' },
    { id: 'rehearsals', label: 'Agenda', icon: <CalendarDays style={{ width: '22px', height: '22px', color: '#ec4899' }} />, bg: '#fce7f3' },
    { id: 'rooms', label: 'Salones', icon: <Building2 style={{ width: '22px', height: '22px', color: '#d97706' }} />, bg: '#fef3c7' },
    { id: 'songs', label: 'Repertorio', icon: <Music2 style={{ width: '22px', height: '22px', color: '#10b981' }} />, bg: '#dcfce7' },
    { id: 'attendance', label: 'Asistencia', icon: <QrCode style={{ width: '22px', height: '22px', color: '#f97316' }} />, bg: '#ffedd5' },
    { id: 'justifications', label: 'Justificantes', icon: <FileCheck2 style={{ width: '22px', height: '22px', color: '#475569' }} />, bg: '#f1f5f9' },
    { id: 'companies', label: 'Elencos', icon: <Palette style={{ width: '22px', height: '22px', color: '#be185d' }} />, bg: '#fce7f3' },
    { id: 'campuses', label: 'Campuses', icon: <Settings style={{ width: '22px', height: '22px', color: '#334155' }} />, bg: '#e2e8f0' },
  ];

  // Filter students for search dropdown
  const filteredStudents = searchQuery.trim()
    ? students.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.matricula?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header style={{
      height: '64px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      position: 'sticky',
      top: 0,
      zIndex: 200,
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
    }}>
      {/* Left: Mobile Hamburger Toggle + Multi-Colored Vertical Bars + Brand Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        
        {/* Mobile Sidebar Hamburger Toggle Button */}
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f172a',
              cursor: 'pointer',
            }}
            title="Abrir Menú Principal"
          >
            <Menu style={{ width: '20px', height: '20px' }} />
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Icon Multi-Colored Vertical Bars */}
          <div style={{ display: 'flex', gap: '3px', height: '24px', alignItems: 'center' }}>
            <span style={{ width: '4px', height: '20px', background: '#f59e0b', borderRadius: '2px' }} />
            <span style={{ width: '4px', height: '24px', background: '#ec4899', borderRadius: '2px' }} />
            <span style={{ width: '4px', height: '18px', background: '#f97316', borderRadius: '2px' }} />
            <span style={{ width: '4px', height: '22px', background: '#1d4ed8', borderRadius: '2px' }} />
            <span style={{ width: '4px', height: '16px', background: '#06b6d4', borderRadius: '2px' }} />
          </div>

          <div>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', fontFamily: 'Outfit, sans-serif' }}>
              Arte y Cultura
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#ec4899', display: 'block', marginTop: '-4px' }}>
              colaboradores
            </span>
          </div>
        </div>

        {/* Cambiar perfil Button (AUTO-HIDES if user has only 1 profile!) */}
        {hasMultipleProfiles && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => toggleMenu('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                background: activeMenu === 'profile' ? '#e0f2fe' : '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#0033a0',
                cursor: 'pointer'
              }}
            >
              <span>Cambiar perfil</span>
              <ChevronDown style={{ width: '14px', height: '14px', transform: activeMenu === 'profile' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {activeMenu === 'profile' && (
              <div style={{
                position: 'absolute',
                top: '115%',
                left: 0,
                width: '220px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                padding: '8px',
                zIndex: 300
              }}>
                <div style={{ padding: '8px 10px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Perfiles de Arte y Cultura
                </div>
                {userProfiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setActiveProfileId(p.id); setActiveMenu(null); }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: p.id === activeProfileId ? '#e0f2fe' : 'transparent',
                      color: p.id === activeProfileId ? '#0033a0' : '#334155',
                      border: 'none',
                      fontWeight: p.id === activeProfileId ? 700 : 500,
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      marginBottom: '4px'
                    }}
                  >
                    <span>{p.label}</span>
                    {p.id === activeProfileId && <CheckCircle2 style={{ width: '14px', height: '14px' }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center: Global Search Bar */}
      <div className="topbar-search" style={{ flex: '0 1 420px', margin: '0 12px', position: 'relative' }}>
        <Search style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '18px',
          height: '18px',
          color: '#64748b'
        }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSearchDropdown(true);
          }}
          onFocus={() => setShowSearchDropdown(true)}
          placeholder="Buscar personas o servicios..."
          style={{
            width: '100%',
            padding: '9px 16px 9px 40px',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '999px',
            fontSize: '0.85rem',
            color: '#0f172a',
            outline: 'none'
          }}
        />

        {/* Live Search Autocomplete Dropdown */}
        {showSearchDropdown && searchQuery.trim().length > 0 && (
          <div style={{
            position: 'absolute',
            top: '115%',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            padding: '12px',
            maxHeight: '320px',
            overflowY: 'auto',
            zIndex: 300
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                Resultados para "{searchQuery}"
              </span>
              <button onClick={() => setShowSearchDropdown(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X style={{ width: '14px', height: '14px' }} />
              </button>
            </div>

            {filteredStudents.length > 0 ? (
              filteredStudents.map((std) => (
                <div
                  key={std.id}
                  onClick={() => {
                    if (onSearchSelect) onSearchSelect('approvals');
                    setShowSearchDropdown(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background 0.15s ease',
                  }}
                  className="search-item-hover"
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{std.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{std.matricula} • {std.companyName} ({std.section})</div>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: std.status === 'ACTIVE' ? '#10b981' : '#d97706', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                    {std.status === 'ACTIVE' ? 'ACTIVO' : 'PENDIENTE'}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                No se encontraron alumnos con ese nombre o matrícula.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Quick Action Icons & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        
        {/* Reacciones */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => toggleMenu('reactions')}
            style={{
              background: activeMenu === 'reactions' ? '#f1f5f9' : 'none',
              border: 'none',
              color: activeMenu === 'reactions' ? '#0033a0' : '#64748b',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px'
            }}
            title="Reacciones y Clima del Elenco"
          >
            <Smile style={{ width: '18px', height: '18px' }} />
          </button>

          {activeMenu === 'reactions' && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '230px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
              padding: '12px',
              zIndex: 300
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Estado / Clima del Elenco
              </div>
              <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, color: '#0033a0', marginBottom: '10px' }}>
                {currentMood}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {['🎭 Concierto Próximo', '⭐ Excelente Energía', '🎯 Audiciones Abiertas', '🔥 Ensayos Intensivos'].map((mood) => (
                  <button
                    key={mood}
                    onClick={() => { setCurrentMood(mood); setActiveMenu(null); }}
                    style={{ textAlign: 'left', padding: '6px 10px', borderRadius: '6px', border: 'none', background: 'transparent', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, color: '#334155' }}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Marcadores */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => toggleMenu('bookmarks')}
            style={{
              background: activeMenu === 'bookmarks' ? '#f1f5f9' : 'none',
              border: 'none',
              color: activeMenu === 'bookmarks' ? '#0033a0' : '#64748b',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px'
            }}
            title="Marcadores y Favoritos"
          >
            <Bookmark style={{ width: '18px', height: '18px' }} />
          </button>

          {activeMenu === 'bookmarks' && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '240px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
              padding: '12px',
              zIndex: 300
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Mis Accesos Favoritos
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {bookmarks.map((bm) => (
                  <div key={bm} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>🔖 {bm}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 🎛️ 9-Dot App Grid Launcher: Herramientas (Microsoft 365 Style) */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => toggleMenu('grid')}
            style={{
              background: activeMenu === 'grid' ? '#e0f2fe' : '#f8fafc',
              border: '1px solid #cbd5e1',
              color: activeMenu === 'grid' ? '#0033a0' : '#64748b',
              cursor: 'pointer',
              padding: '6px 8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Herramientas y Módulos tipo Apps"
          >
            <Grid style={{ width: '18px', height: '18px', color: '#0033a0' }} />
          </button>

          {activeMenu === 'grid' && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '320px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '16px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.18)',
              overflow: 'hidden',
              zIndex: 350
            }}>
              {/* Blue Header Banner matching user screenshot */}
              <div style={{
                background: 'linear-gradient(135deg, #0033a0 0%, #002677 100%)',
                color: '#ffffff',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}>
                    Herramientas
                  </h4>
                  <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>Arte y Cultura Tec</span>
                </div>
                <Grid style={{ width: '22px', height: '22px', opacity: 0.9 }} />
              </div>

              {/* 2-Column App Grid List matching Microsoft 365 screenshot style */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                padding: '14px',
                background: '#ffffff'
              }}>
                {appModules.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      if (onSearchSelect) onSearchSelect(app.id);
                      setActiveMenu(null);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: '1px solid #f1f5f9',
                      background: '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                    className="app-module-hover"
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: app.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {app.icon}
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                      {app.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notificaciones */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => toggleMenu('notifications')}
            style={{
              background: activeMenu === 'notifications' ? '#f1f5f9' : 'none',
              border: 'none',
              color: activeMenu === 'notifications' ? '#0033a0' : '#64748b',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              position: 'relative'
            }}
            title="Notificaciones del Sistema"
          >
            <Bell style={{ width: '18px', height: '18px' }} />
            {pendingApprovalsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '7px',
                height: '7px',
                background: '#ec4899',
                borderRadius: '50%'
              }} />
            )}
          </button>

          {activeMenu === 'notifications' && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '260px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
              padding: '12px',
              zIndex: 300
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Notificaciones
                </span>
                <span style={{ fontSize: '0.7rem', color: '#0033a0', fontWeight: 700, cursor: 'pointer' }}>
                  Marcar leídas
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pendingApprovalsCount > 0 ? (
                  <div style={{ padding: '8px 10px', background: '#fef3c7', borderRadius: '8px', fontSize: '0.8rem', color: '#b45309', fontWeight: 600 }}>
                    🔔 Tienes <strong>{pendingApprovalsCount} alumno(s)</strong> pendientes por autorizar.
                  </div>
                ) : (
                  <div style={{ padding: '8px 10px', background: '#f0fdf4', borderRadius: '8px', fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>
                    ✅ No tienes notificaciones pendientes.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Menu */}
        <div style={{ position: 'relative', marginLeft: '4px', paddingLeft: '8px', borderLeft: '1px solid #e2e8f0' }}>
          <button
            onClick={() => toggleMenu('user')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src="/logo.png"
                alt={adminName}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #0033a0'
                }}
              />
              <span style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '9px',
                height: '9px',
                background: '#10b981',
                border: '2px solid #ffffff',
                borderRadius: '50%'
              }} />
            </div>
          </button>

          {activeMenu === 'user' && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '230px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
              padding: '12px',
              zIndex: 300
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>{adminName}</div>
              <div style={{ fontSize: '0.72rem', color: '#0033a0', fontWeight: 700, marginBottom: '10px' }}>
                Director de Compañía • Tec Campus Laguna
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  onClick={toggleTheme}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: '6px', border: 'none', background: '#f8fafc', fontSize: '0.8rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}
                >
                  <span>Modo: {theme === 'light' ? 'Claro ☀️' : 'Oscuro 🌙'}</span>
                  {theme === 'light' ? <Sun style={{ width: '14px', height: '14px', color: '#f59e0b' }} /> : <Moon style={{ width: '14px', height: '14px', color: '#38bdf8' }} />}
                </button>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 10px', borderRadius: '6px', border: 'none', background: '#fff1f2', color: '#e11d48', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    <LogOut style={{ width: '14px', height: '14px' }} /> Cerrar Sesión
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
