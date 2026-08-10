import React, { useState, useEffect } from 'react';
import { Search, Bell, ShieldCheck, MapPin, Sun, Moon, Palette, Music } from 'lucide-react';

interface HeaderProps {
  currentCompany: string;
  setCurrentCompany: (company: string) => void;
  companies?: { id: string; name: string; emoji: string }[];
}

export const Header: React.FC<HeaderProps> = ({ currentCompany, setCurrentCompany, companies = [] }) => {
  const [selectedCampus, setSelectedCampus] = useState('Tec Campus Laguna (Torreón)');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Default fallback companies if none passed
  const displayCompanies = companies.length > 0 ? companies : [
    { id: '1', name: 'Ensamble Musical Tec', emoji: '🎵' },
    { id: '2', name: 'Comedia Musical 2026', emoji: '🎭' },
    { id: '3', name: 'Grupo de Baile Urbano', emoji: '💃' },
    { id: '4', name: 'Compañía de Canto Vocal', emoji: '🎤' },
  ];

  // Sync theme with HTML data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-card)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Campus Selector - Tec Campus Laguna Exclusivo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(217, 119, 6, 0.1)',
        border: '1px solid rgba(217, 119, 6, 0.25)',
        padding: '6px 14px',
        borderRadius: '10px'
      }}>
        <MapPin style={{ width: '16px', height: '16px', color: 'var(--accent-amber)' }} />
        <select 
          value={selectedCampus}
          onChange={(e) => setSelectedCampus(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-amber)',
            fontWeight: 700,
            fontSize: '0.85rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="Tec Campus Laguna (Torreón)" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
            Tec Campus Laguna (Torreón)
          </option>
        </select>
      </div>

      {/* Company Selector & Theme Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Company Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(2, 132, 199, 0.25)', padding: '6px 14px', borderRadius: '10px' }}>
          <Palette style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
          <select 
            value={currentCompany} 
            onChange={(e) => setCurrentCompany(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {displayCompanies.map((c) => (
              <option key={c.id} value={c.name} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Manual Light/Dark Theme Switcher */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-dark)',
            border: '1px solid var(--border-color)',
            padding: '6px 12px',
            borderRadius: '10px',
            color: 'var(--text-main)',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
          title="Cambiar Modo Claro / Oscuro"
        >
          {theme === 'light' ? (
            <>
              <Sun style={{ width: '16px', height: '16px', color: '#f59e0b' }} /> Modo Claro
            </>
          ) : (
            <>
              <Moon style={{ width: '16px', height: '16px', color: '#38bdf8' }} /> Modo Oscuro
            </>
          )}
        </button>

        {/* Notifications Icon */}
        <button style={{
          background: 'var(--bg-dark)',
          border: '1px solid var(--border-color)',
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative'
        }}>
          <Bell style={{ width: '18px', height: '18px' }} />
          <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: 'var(--accent-amber)', borderRadius: '50%' }}></span>
        </button>
      </div>
    </header>
  );
};
