import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, ShieldCheck, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { StudentProfile, DisciplineType } from '../shared';

interface StudentLoginProps {
  onRegisterStudent: (newStudent: StudentProfile) => void;
  onLoginStudent: (email: string) => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ onRegisterStudent, onLoginStudent }) => {
  // Default to Iniciar Sesión mode
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form State - Empty defaults
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [campus, setCampus] = useState('Tec Campus Laguna (Torreón)');
  const [companyName, setCompanyName] = useState('Ensamble Musical Tec');
  const [discipline, setDiscipline] = useState<DisciplineType>('MUSICA');
  const [section, setSection] = useState('');

  const [submittedPending, setSubmittedPending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegisterMode) {
      const newStudent: StudentProfile = {
        id: `std-${Date.now()}`,
        name,
        email,
        matricula: matricula.toUpperCase(),
        campus,
        role: 'STUDENT',
        status: 'PENDING_APPROVAL',
        companyName,
        discipline,
        section: section || 'General',
        createdAt: new Date().toISOString().split('T')[0],
      };
      onRegisterStudent(newStudent);
      setSubmittedPending(true);
    } else {
      onLoginStudent(email);
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
            Compañía Artística - Tec Campus Laguna
          </p>
        </div>

        {submittedPending ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <Clock style={{ width: '56px', height: '56px', color: 'var(--accent-amber)', margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-amber)', fontWeight: 800, marginBottom: '6px' }}>
              ¡Registro Recibido con Éxito!
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '16px' }}>
              Hola <strong>{name}</strong>, tu solicitud para ingresar a <strong>{companyName}</strong> ({section}) en <strong>{campus}</strong> ha sido registrada en la base de datos de Neon Postgres.
            </p>
            <div style={{ background: 'rgba(217, 119, 6, 0.1)', border: '1px solid rgba(217, 119, 6, 0.3)', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--accent-amber)', marginBottom: '20px' }}>
              El director o administrador del Tec revisará tu perfil para <strong>activarte</strong>. Recibirás una notificación en <strong>{email}</strong> al ser autorizado.
            </div>
            <button className="btn-pwa-primary" onClick={() => onLoginStudent(email)}>
              Ir a la Pantalla Principal
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
                onClick={() => setIsRegisterMode(false)}
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
                onClick={() => setIsRegisterMode(true)}
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
                      placeholder="Ej. Mateo Hernández"
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
                        placeholder="A01708821"
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Compañía / Elenco</label>
                      <select
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
                      >
                        <option value="Ensamble Musical Tec">Ensamble Musical</option>
                        <option value="Comedia Musical 2026">Comedia Musical</option>
                        <option value="Grupo de Baile Urbano">Grupo de Baile</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Sección / Rol</label>
                      <input
                        type="text"
                        required
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        placeholder="Ej. Saxofón Alto"
                        style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alumno@gmail.com o @tec.mx"
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

              <button type="submit" className="btn-pwa-primary" style={{ marginTop: '8px' }}>
                {!isRegisterMode ? 'Iniciar Sesión' : 'Enviar Registro a la Compañía'} <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
