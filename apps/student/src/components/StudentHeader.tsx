import React, { useState } from 'react';
import { Search, Bell, Bookmark, HelpCircle, Sun, Moon } from 'lucide-react';
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

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <header style={{
      padding: '12px 16px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
    }}>
      {/* Left: Multi-Colored Vertical Bars + Arte y Cultura Brand Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '2px', height: '22px', alignItems: 'center' }}>
          <span style={{ width: '4px', height: '20px', background: '#f59e0b', borderRadius: '2px' }} />
          <span style={{ width: '4px', height: '22px', background: '#ec4899', borderRadius: '2px' }} />
          <span style={{ width: '4px', height: '18px', background: '#06b6d4', borderRadius: '2px' }} />
        </div>

        <div>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', fontFamily: 'Outfit, sans-serif' }}>
            Arte y Cultura
          </span>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#ec4899', display: 'block', marginTop: '-3px' }}>
            alumnos
          </span>
        </div>
      </div>

      {/* Right: Quick Action Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
          <Search style={{ width: '18px', height: '18px' }} />
        </button>

        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
          <Bookmark style={{ width: '18px', height: '18px' }} />
        </button>

        <button
          onClick={() => setPushEnabled(!pushEnabled)}
          style={{
            background: 'none',
            border: 'none',
            color: pushEnabled ? '#ec4899' : '#64748b',
            cursor: 'pointer',
            padding: '4px',
            position: 'relative'
          }}
        >
          <Bell style={{ width: '18px', height: '18px' }} />
          {pushEnabled && (
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '6px',
              height: '6px',
              background: '#ec4899',
              borderRadius: '50%'
            }} />
          )}
        </button>

        <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
          {theme === 'light' ? <Sun style={{ width: '18px', height: '18px', color: '#f59e0b' }} /> : <Moon style={{ width: '18px', height: '18px', color: '#38bdf8' }} />}
        </button>

        {/* Profile Avatar */}
        <img
          src="/logo.png"
          alt={student.name}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #0033a0'
          }}
        />
      </div>
    </header>
  );
};
