import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, ShieldCheck, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { StudentProfile, DisciplineType } from '../shared';

interface StudentLoginProps {
  onRegisterStudent: (newStudent: StudentProfile) => void;
  onLoginStudent: (email: string) => Promise<boolean>;
  loginErrorMessage?: string | null;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ onRegisterStudent, onLoginStudent, loginErrorMessage }) => {
  // Default to Iniciar Sesión mode
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form State - Empty defaults
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [campus, setCampus] = useState('Tec Campus Laguna (Torreón)');
  const [discipline, setDiscipline] = useState<DisciplineType>('MUSICA');

  const [submittedPending, setSubmittedPending] = useState(false);
  const [localPendingInfo, setLocalPendingInfo] = useState<{ name: string; email: string; matricula: string } | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);

    try {
      if (isRegisterMode) {
        const newStudent: StudentProfile = {
          id: `std-${Date.now()}`,
          name,
          email,
          matricula: matricula.toUpperCase(),
          campus,
          role: 'STUDENT',
          status: 'PENDING_APPROVAL',
          companyName: 'Arte y Cultura Tec',
          discipline,
          section: 'Alumno Integrante',
          createdAt: new Date().toISOString().split('T')[0],
        };
        await onRegisterStudent(newStudent);
        setLocalPendingInfo({ name, email, matricula: matricula.toUpperCase() });
        setSubmittedPending(true);
      } else {
        const success = await onLoginStudent(email);
        if (!success) {
          setLocalError('No fue posible ingresar.');
        }
      }
    } catch (err: any) {
      setLocalError(err?.message || 'Ocurrió un error al procesar tu solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '480px',
      margin: '0 auto',
      minHeight: '100vh',
      background: 'var(--bg-dark)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '24px 16px'
    }}>
      <div className="pwa-card">
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img
            src="/logo.png"
            alt="OrganizArte Logo"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '18px',
              objectFit: 'cover',
              margin: '0 auto 12px auto',
              boxShadow: '0 6px 20px rgba(6, 182, 212, 0.45)',
              display: 'block'
            }}
          />
          <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)', fontWeight: 800 }}>OrganizArte PWA</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>
            Arte y Cultura - Tec Campus Laguna
          </p>
        </div>

        {submittedPending && localPendingInfo ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <Clock style={{ width: '56px', height: '56px', color: '#f59e0b', margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#f59e0b', fontWeight: 800, marginBottom: '8px' }}>
              ¡Registro Recibido!
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
              Hola <strong>{localPendingInfo.name}</strong>, tu solicitud de registro con matrícula <strong>{localPendingInfo.matricula}</strong> ha sido guardada exitosamente en el sistema.
            </p>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '14px', borderRadius: '12px', fontSize: '0.82rem', color: '#fbbf24', marginBottom: '24px', textAlign: 'left', lineHeight: '1.4' }}>
              🔒 <strong>En espera de autorización:</strong> El administrador o director de Arte y Cultura debe revisar y <strong>aprobar tu cuenta</strong> antes de que puedas ingresar y subir tu horario de MiTec.
            </div>
            <button
              className="btn-pwa-primary"
              onClick={() => {
                setSubmittedPending(false);
                setIsRegisterMode(false);
              }}
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        ) : (
          <>
            {/* Toggle Mode: Default to Iniciar Sesión first */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: 'var(--bg-dark)',
              padding: '4px',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setLocalError(null);
                }}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: !isRegisterMode ? 'rgba(2, 132, 199, 0.15)' : 'transparent',
                  color: !isRegisterMode ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(true);
                  setLocalError(null);
                }}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isRegisterMode ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                  color: isRegisterMode ? 'var(--accent-purple)' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Registrarme
              </button>
            </div>

            {(loginErrorMessage || localError) && (
              <div style={{
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                color: '#f87171',
                fontSize: '0.82rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                <span>{loginErrorMessage || localError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {isRegisterMode && (
                <>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Campus Tec</label>
                    <select
                      value={campus}
                      onChange={(e) => setCampus(e.target.value)}
                      style={{ width: '100%', padding: '10px', background: 'rgba(217, 119, 6, 0.1)', border: '1px solid rgba(217, 119, 6, 0.3)', borderRadius: '8px', color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.85rem' }}
                    >
                      <option value="Tec Campus Laguna (Torreón)">Tec Campus Laguna (Torreón)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Alejandro Gallegos Lugo"
                      style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Matrícula Tec</label>
                      <input
                        type="text"
                        required
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        placeholder="A01232722"
                        style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Disciplina</label>
                      <select
                        value={discipline}
                        onChange={(e) => setDiscipline(e.target.value as DisciplineType)}
                        style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
                      >
                        <option value="MUSICA">Música</option>
                        <option value="CANTO">Canto / Vocal</option>
                        <option value="BAILE">Baile / Danza</option>
                        <option value="TEATRO">Teatro</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Correo Electrónico o Matrícula</label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alumno@gmail.com, @tec.mx o Matrícula"
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Contraseña</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
                />
              </div>

              <button type="submit" disabled={loading} className="btn-pwa-primary" style={{ marginTop: '8px' }}>
                {loading ? 'Procesando...' : (!isRegisterMode ? 'Iniciar Sesión' : 'Enviar Registro a Validación')} <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
