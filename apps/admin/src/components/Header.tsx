import React, { useState, useEffect } from 'react';
import { Search, Bell, ShieldCheck, MapPin, Sun, Moon, Palette, Music, ChevronDown, Menu } from 'lucide-react';

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
        background: 'var(--bg-card)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        gap: '12px',
      }}>
        {/* Left Section: Hamburger Menu Toggle Button & Brand Logo & Campus Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Hamburger Menu Toggle for Tablets & Mobile */}
          <button
            onClick={onToggleMobileMenu}
            className="mobile-hamburger-btn"
            style={{
              background: 'rgba(2, 132, 199, 0.1)',
              border: '1px solid rgba(2, 132, 199, 0.25)',
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

          {/* Official Arte y Cultura Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '4px' }}>
            <div style={{ display: 'flex', gap: '2px', height: '20px', alignItems: 'center' }}>
              <span style={{ width: '4px', height: '18px', background: '#f59e0b', borderRadius: '2px' }} />
              <span style={{ width: '4px', height: '22px', background: '#0033a0', borderRadius: '2px' }} />
              <span style={{ width: '4px', height: '16px', background: '#ec4899', borderRadius: '2px' }} />
              <span style={{ width: '4px', height: '20px', background: '#06b6d4', borderRadius: '2px' }} />
            </div>
            <div>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
                Arte y Cultura
              </span>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#ec4899', display: 'block', marginTop: '-2px' }}>
                colaboradores
              </span>
            </div>
          </div>

          {/* Campus Selector - Tec Campus Laguna Exclusivo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(217, 119, 6, 0.1)',
            border: '1px solid rgba(217, 119, 6, 0.25)',
            padding: '6px 12px',
            borderRadius: '10px',
            maxWidth: '100%'
          }}>
            <MapPin style={{ width: '16px', height: '16px', color: 'var(--accent-amber)', flexShrink: 0 }} />
            <select 
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-amber)',
                fontWeight: 700,
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="Tec Campus Laguna (Torreón)" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
                Tec Campus Laguna (Torreón)
              </option>
            </select>
          </div>
        </div>

        {/* Right Action Bar (Company Selector + Theme + Notifications) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Desktop Company Selector */}
          <div className="desktop-company-selector" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(2, 132, 199, 0.25)', padding: '6px 14px', borderRadius: '10px' }}>
            <Palette style={{ width: '16px', height: '16px', color: 'var(--primary)', flexShrink: 0 }} />
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

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-dark)',
              border: '1px solid var(--border-color)',
              padding: '6px 10px',
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
              <Sun style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
            ) : (
              <Moon style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
            )}
          </button>

          {/* Notifications Icon */}
          <button style={{
            background: 'var(--bg-dark)',
            border: '1px solid var(--border-color)',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative'
          }}>
            <Bell style={{ width: '18px', height: '18px' }} />
            <span style={{ position: 'absolute', top: '7px', right: '7px', width: '8px', height: '8px', background: 'var(--accent-amber)', borderRadius: '50%' }}></span>
          </button>
        </div>
      </header>

      {/* Dedicated Full-Width Company Selector Bar for Mobile/Tablet Screens */}
      <div className="mobile-company-bar" style={{
        background: 'rgba(2, 132, 199, 0.08)',
        borderBottom: '1px solid rgba(2, 132, 199, 0.2)',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', flexShrink: 0 }}>
          <Palette style={{ width: '14px', height: '14px' }} /> Proyecto / Elenco:
        </div>
        <select 
          value={currentCompany} 
          onChange={(e) => setCurrentCompany(e.target.value)}
          style={{
            flex: 1,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--primary)',
            fontWeight: 800,
            fontSize: '0.82rem',
            padding: '6px 10px',
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
    </div>
  );
};
