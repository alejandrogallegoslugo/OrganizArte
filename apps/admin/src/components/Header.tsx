import React, { useState, useEffect } from 'react';
import { Search, Bell, ShieldCheck, MapPin, Sun, Moon, Palette, Music, ChevronDown, Menu, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentCompany: string;
  setCurrentCompany: (company: string) => void;
  companies?: { id: string; name: string; emoji: string }[];
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentCompany, setCurrentCompany, companies = [], onToggleMobileMenu }) => {
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
    <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <header style={{
        minHeight: '64px',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-surface)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {/* Left Section: Hamburger Menu Toggle Button & Brand Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Hamburger Menu Toggle for Tablets & Mobile */}
          <button
            onClick={onToggleMobileMenu}
            className="mobile-hamburger-btn"
            style={{
              background: 'var(--primary-light)',
              border: '1px solid var(--primary-glow)',
              color: 'var(--primary)',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            title="Abrir Menú de Módulos"
          >
            <Menu style={{ width: '22px', height: '22px' }} />
          </button>

          {/* Campus Indicator Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-dark)',
            border: '1px solid var(--border-color)',
            padding: '6px 12px',
            borderRadius: '10px',
          }}>
            <MapPin style={{ width: '16px', height: '16px', color: 'var(--amber-accent)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {selectedCampus}
            </span>
          </div>
        </div>

        {/* Right Section: Company Switcher, Theme Toggle & Notifications */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Company Selector Dropdown */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--primary-light)',
            border: '1px solid var(--primary-glow)',
            padding: '6px 14px',
            borderRadius: '10px',
          }}>
            <Music style={{ width: '16px', height: '16px', color: 'var(--primary)', flexShrink: 0 }} />
            <select
              value={currentCompany}
              onChange={(e) => setCurrentCompany(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {displayCompanies.map((comp) => (
                <option key={comp.id} value={comp.name} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
                  {comp.emoji} {comp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--bg-dark)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            title={theme === 'light' ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
          >
            {theme === 'light' ? <Moon style={{ width: '18px', height: '18px' }} /> : <Sun style={{ width: '18px', height: '18px', color: '#f59e0b' }} />}
          </button>
        </div>
      </header>
    </div>
  );
};
