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
} from 'lucide-react';

interface MiTecTopBarProps {
  adminName?: string;
  onSearch?: (query: string) => void;
  onToggleTheme?: () => void;
  currentRole?: string;
}

export const MiTecTopBar: React.FC<MiTecTopBarProps> = ({
  adminName = 'Prof. Alejandro Gallegos',
  onSearch,
  currentRole = 'Director de Compañía',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

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
      zIndex: 150,
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

        {/* Profile Switcher Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#0033a0',
              cursor: 'pointer'
            }}
          >
            <span>Cambiar perfil</span>
            <ChevronDown style={{ width: '14px', height: '14px' }} />
          </button>

          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              width: '230px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              padding: '8px',
              zIndex: 200
            }}>
              <div style={{ padding: '8px 10px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Perfiles de Arte y Cultura
              </div>
              <button style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '8px', background: '#e0f2fe', color: '#0033a0', border: 'none', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <span>Director de Compañía</span>
                <CheckCircle2 style={{ width: '14px', height: '14px' }} />
              </button>
              <button style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '8px', background: 'transparent', color: '#334155', border: 'none', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer' }}>
                Profesor Colaborador Tec
              </button>
              <button style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '8px', background: 'transparent', color: '#334155', border: 'none', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer' }}>
                Alumno de Compañía (PWA)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center: Global Search Bar */}
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
          onChange={handleSearchChange}
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
      </div>

      {/* Right: Quick Action Icons & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '6px' }} title="Reacciones">
          <Smile style={{ width: '20px', height: '20px' }} />
        </button>

        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '6px' }} title="Marcadores y Favoritos">
          <Bookmark style={{ width: '20px', height: '20px' }} />
        </button>

        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '6px' }} title="Servicios Arte y Cultura">
          <Grid style={{ width: '20px', height: '20px' }} />
        </button>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '6px', position: 'relative' }}
            title="Notificaciones"
          >
            <Bell style={{ width: '20px', height: '20px' }} />
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              background: '#ec4899',
              borderRadius: '50%'
            }} />
          </button>
        </div>

        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '6px' }} title="Ayuda Arte y Cultura">
          <HelpCircle style={{ width: '20px', height: '20px' }} />
        </button>

        {/* User Profile Avatar with Online Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '6px', paddingLeft: '12px', borderLeft: '1px solid #e2e8f0' }}>
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
        </div>
      </div>
    </header>
  );
};
