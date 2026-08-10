import React from 'react';
import { Users, UserCheck, Calendar, Building2, Music, Sparkles, ArrowUpRight } from 'lucide-react';
import { StudentProfile, RehearsalEvent, RoomBooking } from '../shared';

interface DashboardProps {
  students: StudentProfile[];
  rehearsals: RehearsalEvent[];
  bookings: RoomBooking[];
  pendingCount: number;
  setActiveTab: (tab: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  rehearsals,
  bookings,
  pendingCount,
  setActiveTab,
}) => {
  const activeStudents = students.filter((s) => s.status === 'ACTIVE');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '28px 32px',
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(124, 58, 237, 0.08) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles style={{ color: 'var(--primary)', width: '20px', height: '20px' }} />
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Plataforma de Gestión Artística Tec
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '6px' }}>
            Panel de Control del Director
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px' }}>
            Gestiona la disponibilidad de tus alumnos mediante IA, autoriza permisos de ensayo en salones Tec y coordina partituras y guías de audio.
          </p>
        </div>

        {pendingCount > 0 && (
          <button 
            className="btn-primary" 
            onClick={() => setActiveTab('approvals')}
            style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }}
          >
            <UserCheck style={{ width: '18px', height: '18px' }} />
            Aprobar {pendingCount} Alumno(s)
          </button>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Integrantes Activos</span>
            <Users style={{ color: 'var(--primary)', width: '20px', height: '20px' }} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{activeStudents.length}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontWeight: 700 }}>
            <ArrowUpRight style={{ width: '14px', height: '14px' }} /> 100% verificados
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Pendientes Aprobación</span>
            <UserCheck style={{ color: 'var(--accent-amber)', width: '20px', height: '20px' }} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{pendingCount}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block', fontWeight: 600 }}>
            Revisión requerida
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Ensayos Próximos</span>
            <Calendar style={{ color: 'var(--accent-purple)', width: '20px', height: '20px' }} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{rehearsals.length}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', marginTop: '4px', display: 'block', fontWeight: 700 }}>
            Esta semana
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Permisos de Salón Tec</span>
            <Building2 style={{ color: 'var(--accent-emerald)', width: '20px', height: '20px' }} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{bookings.length}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '4px', display: 'block', fontWeight: 700 }}>
            Reservas activas
          </span>
        </div>
      </div>

      {/* Main Content Grid: Students List & Rehearsals Schedule */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Active Students Table */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Integrantes de la Compañía</h3>
            <button className="btn-secondary" onClick={() => setActiveTab('availability')}>
              Ver Matriz Disponibilidad
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Alumno</th>
                <th>Matrícula</th>
                <th>Disciplina / Sección</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{student.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.email}</div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>{student.matricula}</span>
                  </td>
                  <td>
                    <span className="badge badge-purple">{student.discipline}</span>
                    <span style={{ marginLeft: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{student.section}</span>
                  </td>
                  <td>
                    {student.status === 'ACTIVE' ? (
                      <span className="badge badge-active">Activo</span>
                    ) : (
                      <span className="badge badge-pending">Pendiente</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upcoming Rehearsals */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar style={{ color: 'var(--primary)', width: '18px', height: '18px' }} /> Próximos Ensayos
          </h3>

          {rehearsals.map((rehearsal) => (
            <div 
              key={rehearsal.id} 
              style={{
                background: 'var(--bg-dark)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '16px'
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>{rehearsal.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: 600 }}>
                📅 {rehearsal.date} | ⏰ {rehearsal.startTime} - {rehearsal.endTime} hs
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                📍 {rehearsal.location}
              </div>
            </div>
          ))}

          <button className="btn-primary" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }} onClick={() => setActiveTab('rehearsals')}>
            Programar Nuevo Ensayo
          </button>
        </div>
      </div>
    </div>
  );
};
