import React, { useState } from 'react';
import { QrCode, CheckCircle, Clock, Users, ShieldCheck, RefreshCw } from 'lucide-react';
import { RehearsalEvent, StudentProfile } from '../shared';

interface AttendanceQRProps {
  rehearsals: RehearsalEvent[];
  students: StudentProfile[];
}

export const AttendanceQR: React.FC<AttendanceQRProps> = ({ rehearsals, students }) => {
  const [selectedRehearsalId, setSelectedRehearsalId] = useState<string>(rehearsals[0]?.id || '');

  const currentRehearsal = rehearsals.find((r) => r.id === selectedRehearsalId) || rehearsals[0];

  // Mock attendance records for active rehearsal
  const [attendanceRecords, setAttendanceRecords] = useState([
    { id: 'att-1', name: 'Mateo Hernández', section: 'Saxofón Alto', time: '17:02 hs', status: 'PRESENT' },
    { id: 'att-2', name: 'Sofia Garza', section: 'Soprano', time: '17:05 hs', status: 'PRESENT' },
    { id: 'att-3', name: 'Carlos Elizondo', section: 'Batería & Percusión', time: '17:14 hs', status: 'LATE' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <QrCode style={{ color: '#38bdf8', width: '20px', height: '20px' }} />
            <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Pase de Lista Digital en Tiempo Real
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Proyector de Código QR Dinámico</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
            Proyecta este código QR durante el ensayo. Los alumnos escanean desde su PWA para registrar asistencia al instante.
          </p>
        </div>

        {/* Rehearsal Picker */}
        {rehearsals.length > 0 && (
          <select
            value={selectedRehearsalId}
            onChange={(e) => setSelectedRehearsalId(e.target.value)}
            style={{
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            {rehearsals.map((r) => (
              <option key={r.id} value={r.id} style={{ background: '#0f172a' }}>
                {r.title} ({r.date})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Main Grid: QR Projector & Live Check-in Log */}
      {currentRehearsal && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
          {/* QR Display Card */}
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(2, 132, 199, 0.15) 100%)' }}>
            <span className="badge badge-purple" style={{ marginBottom: '12px' }}>PROYECTOR EN VIVO</span>
            <h3 style={{ fontSize: '1.3rem', color: '#f8fafc', marginBottom: '4px' }}>{currentRehearsal.title}</h3>
            <p style={{ fontSize: '0.85rem', color: '#38bdf8', marginBottom: '20px' }}>
              📍 {currentRehearsal.location} | ⏰ {currentRehearsal.startTime} - {currentRehearsal.endTime} hs
            </p>

            {/* QR Box */}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '20px', boxShadow: '0 0 40px rgba(56, 189, 248, 0.4)', marginBottom: '20px' }}>
              <QrCode style={{ width: '220px', height: '220px', color: '#090d16' }} />
            </div>

            <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw style={{ width: '14px', height: '14px', color: '#10b981' }} /> Código auto-renovable cada 30s (Seguridad Antifraude)
            </div>
          </div>

          {/* Live Check-in Log */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users style={{ color: '#10b981' }} /> Asistencias Registradas ({attendanceRecords.length})
              </h3>
              <span className="badge badge-active">EN VIVO</span>
            </div>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Sección</th>
                  <th>Hora Check-in</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((rec) => (
                  <tr key={rec.id}>
                    <td style={{ fontWeight: 600, color: '#f8fafc' }}>{rec.name}</td>
                    <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{rec.section}</td>
                    <td style={{ color: '#38bdf8', fontSize: '0.85rem', fontFamily: 'monospace' }}>{rec.time}</td>
                    <td>
                      {rec.status === 'PRESENT' ? (
                        <span className="badge badge-active">PRESENTE</span>
                      ) : (
                        <span className="badge badge-pending">RETARDO</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
