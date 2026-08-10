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
}) => {
  const [activeProfileId, setActiveProfileId] = useState(userProfiles[0]?.id || 'director');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Active Dropdowns State
  const [activeMenu, setActiveMenu] = useState<'profile' | 'reactions' | 'bookmarks' | 'grid' | 'notifications' | 'help' | 'user' | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Bookmarks State
  const [bookmarks] = useState<string[]>([
    'Aprobación de Alumnos',
    'Agenda & Ensayos',
    'Pase de Lista QR',
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

  // Auto-hide rule: Only show "Cambiar perfil" if user has MORE than 1 profile!
  const hasMultipleProfiles = userProfiles.length > 1;

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
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 200,
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
    }}>
      {/* Left: Multi-Colored Vertical Bars + Arte y Cultura Brand Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Icon Multi-Colored Vertical Bars */}
          <div style={{ display: 'flex', gap: '3px', height: '28px', alignItems: 'center' }}>
            <span style={{ width: '5px', height: '24px', background: '#f59e0b', borderRadius: '3px' }} />
            <span style={{ width: '5px', height: '28px', background: '#ec4899', borderRadius: '3px' }} />
            <span style={{ width: '5px', height: '22px', background: '#f97316', borderRadius: '3px' }} />
            <span style={{ width: '5px', height: '26px', background: '#1d4ed8', borderRadius: '3px' }} />
            <span style={{ width: '5px', height: '20px', background: '#06b6d4', borderRadius: '3px' }} />
          </div>

          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', fontFamily: 'Outfit, sans-serif' }}>
              Arte y Cultura
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ec4899', display: 'block', marginTop: '-4px' }}>
              colaboradores
            </span>
          </div>
        </div>

        {/* 1. Cambiar perfil Button (AUTO-HIDES if user has only 1 profile!) */}
        {hasMultipleProfiles && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => toggleMenu('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                background: activeMenu === 'profile' ? '#e0f2fe' : '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.82rem',
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
                width: '240px',
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
                      padding: '9px 10px',
                      borderRadius: '8px',
                      background: p.id === activeProfileId ? '#e0f2fe' : 'transparent',
                      color: p.id === activeProfileId ? '#0033a0' : '#334155',
                      border: 'none',
                      fontWeight: p.id === activeProfileId ? 700 : 500,
                      fontSize: '0.85rem',
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

      {/* 2. Center: Global Search Bar with Live Autocomplete */}
      <div style={{ flex: '0 1 480px', margin: '0 20px', position: 'relative' }}>
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
            padding: '10px 16px 10px 42px',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '999px',
            fontSize: '0.88rem',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        
        {/* 3. 😃 Reacciones / Clima del Elenco */}
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
            <Smile style={{ width: '20px', height: '20px' }} />
          </button>

          {activeMenu === 'reactions' && (
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
                Estado / Clima del Elenco
              </div>
              <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#0033a0', marginBottom: '10px' }}>
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

        {/* 4. 🔖 Marcadores y Favoritos */}
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
            <Bookmark style={{ width: '20px', height: '20px' }} />
          </button>

          {activeMenu === 'bookmarks' && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '250px',
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

        {/* 5. 🎛️ App Grid Menu de Servicios */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => toggleMenu('grid')}
            style={{
              background: activeMenu === 'grid' ? '#f1f5f9' : 'none',
              border: 'none',
              color: activeMenu === 'grid' ? '#0033a0' : '#64748b',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px'
            }}
            title="Grid de Servicios Arte y Cultura"
          >
            <Grid style={{ width: '20px', height: '20px' }} />
          </button>

          {activeMenu === 'grid' && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '280px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              padding: '14px',
              zIndex: 300
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '10px' }}>
                Servicios del Ecosistema
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div onClick={() => { if (onSearchSelect) onSearchSelect('availability'); setActiveMenu(null); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', borderRadius: '10px', background: '#f0f9ff', cursor: 'pointer' }}>
                  <Sparkles style={{ width: '20px', height: '20px', color: '#06b6d4' }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, marginTop: '4px', textAlign: 'center' }}>IA Horarios</span>
                </div>
                <div onClick={() => { if (onSearchSelect) onSearchSelect('attendance'); setActiveMenu(null); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', borderRadius: '10px', background: '#ecfdf5', cursor: 'pointer' }}>
                  <QrCode style={{ width: '20px', height: '20px', color: '#10b981' }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, marginTop: '4px', textAlign: 'center' }}>Escáner QR</span>
                </div>
                <div onClick={() => { if (onSearchSelect) onSearchSelect('rooms'); setActiveMenu(null); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', borderRadius: '10px', background: '#fef3c7', cursor: 'pointer' }}>
                  <Building2 style={{ width: '20px', height: '20px', color: '#d97706' }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, marginTop: '4px', textAlign: 'center' }}>Salones Tec</span>
                </div>
                <div onClick={() => { if (onSearchSelect) onSearchSelect('songs'); setActiveMenu(null); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', borderRadius: '10px', background: '#f3e8ff', cursor: 'pointer' }}>
                  <Music style={{ width: '20px', height: '20px', color: '#7c3aed' }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, marginTop: '4px', textAlign: 'center' }}>Repertorio</span>
                </div>
                <div onClick={() => { if (onSearchSelect) onSearchSelect('approvals'); setActiveMenu(null); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', borderRadius: '10px', background: '#fce7f3', cursor: 'pointer' }}>
                  <UserCheck style={{ width: '20px', height: '20px', color: '#ec4899' }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, marginTop: '4px', textAlign: 'center' }}>Alumnos</span>
                </div>
                <div onClick={() => { if (onSearchSelect) onSearchSelect('rehearsals'); setActiveMenu(null); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', borderRadius: '10px', background: '#e0e7ff', cursor: 'pointer' }}>
                  <Calendar style={{ width: '20px', height: '20px', color: '#4f46e5' }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, marginTop: '4px', textAlign: 'center' }}>Agenda</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6. 🔔 Centro de Notificaciones */}
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
            <Bell style={{ width: '20px', height: '20px' }} />
            {pendingApprovalsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
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
              width: '280px',
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
                <div style={{ padding: '8px 10px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.8rem', color: '#475569' }}>
                  📄 Conexión activa con Neon Postgres DB y Google Gemini Vision.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 7. ❓ Centro de Ayuda & Guía Tec */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => toggleMenu('help')}
            style={{
              background: activeMenu === 'help' ? '#f1f5f9' : 'none',
              border: 'none',
              color: activeMenu === 'help' ? '#0033a0' : '#64748b',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px'
            }}
            title="Ayuda y Soporte"
          >
            <HelpCircle style={{ width: '20px', height: '20px' }} />
          </button>

          {activeMenu === 'help' && (
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
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Centro de Ayuda OrganizArte
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: '#334155' }}>
                <div style={{ padding: '6px 8px', background: '#f8fafc', borderRadius: '6px' }}>❓ ¿Cómo procesar horarios con IA Gemini?</div>
                <div style={{ padding: '6px 8px', background: '#f8fafc', borderRadius: '6px' }}>❓ ¿Cómo proyectar el QR de asistencia?</div>
                <div style={{ padding: '6px 8px', background: '#f8fafc', borderRadius: '6px' }}>❓ Autorización de Salones Tec</div>
              </div>
            </div>
          )}
        </div>

        {/* 8. 👤 User Profile Avatar Menu with Theme Toggle */}
        <div style={{ position: 'relative', marginLeft: '6px', paddingLeft: '10px', borderLeft: '1px solid #e2e8f0' }}>
          <button
            onClick={() => toggleMenu('user')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src="/logo.png"
                alt={adminName}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #0033a0'
                }}
              />
              <span style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '10px',
                height: '10px',
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
              width: '240px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
              padding: '12px',
              zIndex: 300
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{adminName}</div>
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
