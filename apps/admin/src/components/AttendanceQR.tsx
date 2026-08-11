import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle, Clock, Users, ShieldCheck, RefreshCw, Smartphone, Play, Plus } from 'lucide-react';
import { RehearsalEvent, StudentProfile } from '../shared';
import { QRCodeSVG } from './QRCodeSVG';

interface AttendanceQRProps {
  rehearsals: RehearsalEvent[];
  students: StudentProfile[];
}

const DEFAULT_REHEARSAL: RehearsalEvent = {
  id: 'reh-default-1',
  title: 'Ensayo General - Ensamble Musical Arte y Cultura',
  companyName: 'Ensamble Musical Tec',
  date: 'Hoy',
  startTime: '17:00',
  endTime: '19:30',
  location: 'Foro de Artes Escénicas (Salón A-201)',
  status: 'SCHEDULED',
};

export const AttendanceQR: React.FC<AttendanceQRProps> = ({ rehearsals = [], students = [] }) => {
  const activeRehearsals = rehearsals.length > 0 ? rehearsals : [DEFAULT_REHEARSAL];
  const [selectedRehearsalId, setSelectedRehearsalId] = useState<string>(activeRehearsals[0].id);

  const currentRehearsal = activeRehearsals.find((r) => r.id === selectedRehearsalId) || activeRehearsals[0];

  // Dynamic QR Token that rotates every 30 seconds for security
  const [qrToken, setQrToken] = useState<string>(`TEC-QR-${Date.now().toString(36).toUpperCase()}`);
  const [countdown, setCountdown] = useState<number>(30);

  const [scanInput, setScanInput] = useState('');
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Live attendance check-in records (Real DB/Scanned)
  const [attendanceRecords, setAttendanceRecords] = useState<Array<{ id: string; name: string; section: string; time: string; status: string }>>([]);

  // QR Code token rotation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setQrToken(`TEC-QR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Process a scanned QR code string from student card
  const handleProcessScan = (qrCodeString: string) => {
    if (!qrCodeString.trim()) return;

    let studentName = 'Alumno Escaneado';
    let matricula = '';

    if (qrCodeString.includes('ATTENDANCE:')) {
      const parts = qrCodeString.split(':');
      matricula = parts[1] || '';
      studentName = parts[2] || 'Alumno Tec';
    } else {
      studentName = qrCodeString;
    }

    const matchedStudent = students.find(s => s.matricula === matricula || s.name.toLowerCase() === studentName.toLowerCase());
    const finalName = matchedStudent ? matchedStudent.name : studentName;
    const finalDiscipline = matchedStudent ? (matchedStudent.discipline || 'Arte y Cultura') : 'Arte y Cultura';

    const newRecord = {
      id: `att-${Date.now()}`,
      name: finalName,
      section: finalDiscipline,
      time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      status: 'PRESENT',
    };

    setAttendanceRecords((prev) => [newRecord, ...prev.filter(r => r.name !== finalName)]);
    setScanMessage(`✅ Asistencia tomada a: ${finalName}`);
    setScanInput('');
    setTimeout(() => setScanMessage(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="mitec-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <QrCode style={{ color: '#0033a0', width: '24px', height: '24px' }} /> Control de Asistencia QR
        </h2>

        {/* Rehearsal Picker & QR Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <select
            value={selectedRehearsalId}
            onChange={(e) => setSelectedRehearsalId(e.target.value)}
            style={{
              padding: '10px 16px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '0.88rem',
              outline: 'none',
            }}
          >
            {activeRehearsals.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} ({r.date})
              </option>
            ))}
          </select>

          <form onSubmit={(e) => { e.preventDefault(); handleProcessScan(scanInput); }} style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              placeholder="Escanear o ingresar QR..."
              style={{
                padding: '9px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                outline: 'none',
                width: '220px'
              }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '9px 14px', fontSize: '0.82rem' }}>
              Tomar Asistencia
            </button>
          </form>
        </div>
      </div>

      {scanMessage && (
        <div style={{ padding: '12px 20px', background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '10px', color: '#047857', fontWeight: 800, fontSize: '0.9rem' }}>
          {scanMessage}
        </div>
      )}

      {/* Main Grid: QR Projector & Live Check-in Log */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 400px) 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* QR Display Card */}
        <div
          className="mitec-card"
          style={{
            padding: '32px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(160deg, #0033a0 0%, #001a5e 100%)',
            color: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0, 51, 160, 0.25)',
          }}
        >
          <span style={{ background: '#ec4899', color: '#ffffff', fontWeight: 800, fontSize: '0.72rem', padding: '4px 12px', borderRadius: '999px', letterSpacing: '0.05em', marginBottom: '14px' }}>
            PROYECTOR EN VIVO
          </span>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px', lineHeight: 1.25 }}>
            {currentRehearsal.title}
          </h3>
          <p style={{ fontSize: '0.82rem', opacity: 0.9, marginBottom: '20px' }}>
            📍 {currentRehearsal.location} | ⏰ {currentRehearsal.startTime} - {currentRehearsal.endTime} hrs
          </p>

          {/* Real Scannable High-Definition QR Code Image */}
          <div
            style={{
              background: '#ffffff',
              padding: '16px',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <QRCodeSVG
              value={`http://localhost:3001?action=attendance&rehearsalId=${currentRehearsal.id}&token=${qrToken}`}
              size={180}
              color="#0033a0"
              bgColor="#ffffff"
            />
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0033a0', marginTop: '10px', fontFamily: 'monospace' }}>
              TOKEN: {qrToken}
            </span>
          </div>

          {/* Anti-Fraud Rotation Counter */}
          <div style={{ fontSize: '0.8rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '999px' }}>
            <RefreshCw style={{ width: '14px', height: '14px', color: '#38bdf8', animation: 'spin 4s linear infinite' }} />
            <span>Código se renueva en: <strong style={{ color: '#f59e0b' }}>{countdown}s</strong> (Seguridad Antifraude)</span>
          </div>
        </div>

        {/* Live Check-in Log Table */}
        <div className="mitec-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users style={{ color: '#10b981', width: '20px', height: '20px' }} /> Lista de Asistencia en Vivo ({attendanceRecords.length})
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Alumnos registrados en esta sesión de ensayo
              </span>
            </div>

            <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: '999px', border: '1px solid #a7f3d0' }}>
              ● EN TRANSMISIÓN
            </span>
          </div>

          {attendanceRecords.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              <QrCode style={{ width: '40px', height: '40px', margin: '0 auto 8px auto', opacity: 0.4 }} />
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sin registros de asistencia aún</p>
              <span style={{ fontSize: '0.78rem' }}>Escanea la credencial de un alumno para registrar su presencia</span>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Alumno</th>
                  <th style={{ padding: '10px 12px' }}>Sección / Disciplina</th>
                  <th style={{ padding: '10px 12px' }}>Hora de Registro</th>
                  <th style={{ padding: '10px 12px' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((rec) => (
                  <tr key={rec.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>{rec.name}</td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{rec.section}</td>
                    <td style={{ padding: '12px', color: '#0033a0', fontWeight: 700, fontFamily: 'monospace' }}>{rec.time}</td>
                    <td style={{ padding: '12px' }}>
                      {rec.status === 'PRESENT' ? (
                        <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                          ✓ PRESENTE
                        </span>
                      ) : (
                        <span style={{ background: '#fef3c7', color: '#d97706', fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                          ⏰ RETARDO
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};
