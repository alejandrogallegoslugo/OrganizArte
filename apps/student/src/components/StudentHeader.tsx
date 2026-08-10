import React, { useState, useEffect } from 'react';
import { Palette, Bell, ShieldCheck, Sun, Moon, Music, Sparkles } from 'lucide-react';
import { StudentProfile } from '../shared';

interface StudentHeaderProps {
  student: StudentProfile;
  pushEnabled: boolean;
  setPushEnabled: (enabled: boolean) => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  student,
  pushEnabled,
  setPushEnabled,
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header style={{
      padding: '16px 20px',
      background: 'var(--bg-card)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src="/logo.png"
          alt="OrganizArte Logo"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            objectFit: 'cover',
            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.4)'
          }}
        />
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>{student.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <ShieldCheck style={{ width: '12px', height: '12px' }} /> {student.companyName} • {student.section}
          </div>
        </div>
      </div>

      {/* Actions: Theme Switcher & Push Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-dark)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '8px',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Cambiar Modo Claro / Oscuro"
        >
          {theme === 'light' ? <Sun style={{ width: '16px', height: '16px', color: '#d97706' }} /> : <Moon style={{ width: '16px', height: '16px', color: '#38bdf8' }} />}
        </button>

        <button
          onClick={() => setPushEnabled(!pushEnabled)}
          style={{
            background: pushEnabled ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-dark)',
            border: pushEnabled ? '1px solid #0284c7' : '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '8px 10px',
            color: pushEnabled ? '#0284c7' : 'var(--text-muted)',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
        >
          <Bell style={{ width: '14px', height: '14px' }} />
          {pushEnabled ? 'Push iOS' : 'Notif'}
        </button>
      </div>
    </header>
  );
};
