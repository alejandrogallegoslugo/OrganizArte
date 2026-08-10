import React, { useState } from 'react';
import { Building2, Plus, QrCode, ShieldCheck, Clock, Send } from 'lucide-react';
import { RoomBooking, StudentProfile } from '../shared';

interface RoomPassPDFProps {
  student: StudentProfile;
  bookings: RoomBooking[];
  onRequestBooking: (booking: RoomBooking) => void;
}

export const RoomPassPDF: React.FC<RoomPassPDFProps> = ({
  student,
  bookings,
  onRequestBooking,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState('Salón de Ensamble A-101');
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('2026-08-14');
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('19:00');

  const [activePass, setActivePass] = useState<RoomBooking | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: RoomBooking = {
      id: `bk-${Date.now()}`,
      roomId: 'room-101',
      roomName,
      requestedByStudentId: student.id,
      studentName: student.name,
      companyName: student.companyName,
      purpose,
      date,
      startTime,
      endTime,
      status: 'APPROVED', // auto-approve mock for testing
      qrPermissionCode: `PERMISO-TEC-${Math.floor(100000 + Math.random() * 900000)}`,
      approvedBy: 'Director R. Cantú',
    };
    onRequestBooking(newBooking);
    setShowModal(false);
    setPurpose('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#f8fafc', fontWeight: 800 }}>Salones & Permisos Tec</h2>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Solicita salones y presenta el pase digital a Planta Física</p>
        </div>

        <button className="btn-pwa-primary" onClick={() => setShowModal(true)} style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem' }}>
          <Plus style={{ width: '16px', height: '16px' }} /> Pedir Salón
        </button>
      </div>

      {/* Bookings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {bookings.map((bk) => (
          <div key={bk.id} className="pwa-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="badge badge-active">{bk.roomName}</span>
              <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>APROBADO</span>
            </div>

            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>{bk.purpose}</div>

            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              📅 {bk.date} | ⏰ {bk.startTime} - {bk.endTime} hs
            </div>

            {bk.status === 'APPROVED' && (
              <button className="btn-pwa-primary" onClick={() => setActivePass(bk)} style={{ marginTop: '6px' }}>
                <QrCode style={{ width: '18px', height: '18px' }} /> Mostrar Permiso Digital QR
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal Request Form */}
      {showModal && (
        <div className="modal-backdrop">
          <form onSubmit={handleSubmit} className="pwa-card" style={{ width: '100%', maxWidth: '440px', background: '#0f172a' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', marginBottom: '14px' }}>Solicitud de Salón de Ensayo</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Salón Deseado</label>
                <select
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff' }}
                >
                  <option value="Salón de Ensamble A-101" style={{ background: '#0f172a' }}>Salón de Ensamble A-101</option>
                  <option value="Sala de Danza & Expresión B-202" style={{ background: '#0f172a' }}>Sala de Danza B-202</option>
                  <option value="Estudio de Canto & Vientos C-05" style={{ background: '#0f172a' }}>Estudio Canto C-05</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Motivo del Ensayo</label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Ej: Ensayo seccional de trompetas"
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Fecha</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', fontSize: '0.75rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Inicio</label>
                  <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', fontSize: '0.75rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Fin</label>
                  <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', fontSize: '0.75rem' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button type="button" className="btn-pwa-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-pwa-primary">
                  <Send style={{ width: '16px', height: '16px' }} /> Enviar Solicitud
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Digital Pass Viewer Modal */}
      {activePass && (
        <div className="modal-backdrop">
          <div className="pwa-card" style={{ width: '100%', maxWidth: '380px', background: '#0f172a', border: '2px solid #38bdf8', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
              TECNOLÓGICO DE MONTERREY
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', marginTop: '4px' }}>PERMISO DIGITAL DE SALÓN</h3>
            <span className="badge badge-active" style={{ marginTop: '6px' }}>
              <ShieldCheck style={{ width: '12px', height: '12px' }} /> VÁLIDO PARA SEGURIDAD
            </span>

            <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', margin: '16px auto', width: '160px' }}>
              <QrCode style={{ width: '128px', height: '128px', color: '#000' }} />
            </div>

            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              <div><strong>Alumno:</strong> {activePass.studentName}</div>
              <div><strong>Salón:</strong> {activePass.roomName}</div>
              <div><strong>Horario:</strong> {activePass.date} ({activePass.startTime} - {activePass.endTime})</div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}><strong>Código:</strong> {activePass.qrPermissionCode}</div>
            </div>

            <button className="btn-pwa-secondary" onClick={() => setActivePass(null)}>Cerrar Permiso</button>
          </div>
        </div>
      )}
    </div>
  );
};
