import React, { useState } from 'react';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin?: (adminUser: { name: string; email: string; role: string }) => void;
  onLoginSuccess?: (adminUser: { name: string; email: string; role: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Por favor ingresa tu correo y contraseña.');
      return;
    }

    const callback = onLoginSuccess || onLogin;
    if (callback) {
      callback({
        name: 'Prof. Alejandro Gallegos',
        email: email,
        role: 'SUPER_ADMIN',
      });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'var(--bg-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glow Effects */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '20%',
        width: '350px',
        height: '350px',
        background: 'rgba(2, 132, 199, 0.15)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: 0
      }} />

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '36px',
        position: 'relative',
        zIndex: 1,
        background: 'var(--bg-card)',
        boxShadow: 'var(--glass-shadow)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img
            src="/logo.png"
            alt="OrganizArte Logo"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              objectFit: 'cover',
              margin: '0 auto 14px auto',
              boxShadow: '0 8px 24px rgba(6, 182, 212, 0.45)',
              display: 'block'
            }}
          />
          <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 800 }}>OrganizArte</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <ShieldCheck style={{ width: '14px', height: '14px' }} /> Portal Seguro de Directores
          </p>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700 }}>Acceso a Directores y Profesores</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Tec Campus Laguna (Torreón)
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(225, 29, 72, 0.1)', border: '1px solid rgba(225, 29, 72, 0.3)', color: '#e11d48', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '16px', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Correo de Director / Profesor</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-dim)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="director@tec.mx"
                style={{ width: '100%', padding: '10px 12px 10px 38px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-main)', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Contraseña de Seguridad</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-dim)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 12px 10px 38px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-main)', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '12px' }}>
            Ingresar al Panel de Control <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>
        </form>
      </div>
    </div>
  );
};
