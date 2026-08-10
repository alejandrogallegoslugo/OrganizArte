import React, { useState } from 'react';
import { Calendar, Plus, QrCode, MapPin, Clock, Users, CheckCircle } from 'lucide-react';
import { RehearsalEvent } from '../shared';

interface RehearsalSchedulerProps {
  rehearsals: RehearsalEvent[];
  companyName: string;
  onAddRehearsal: (newRehearsal: RehearsalEvent) => void;
}

export const RehearsalScheduler: React.FC<RehearsalSchedulerProps> = ({
  rehearsals,
  companyName,
  onAddRehearsal,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [discipline, setDiscipline] = useState('MUSICA');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('20:00');
  const [location, setLocation] = useState('Salón de Ensamble A-101');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qrCode = `QR-ENSAYO-${Date.now().toString().slice(-6)}`;
    const newRehearsal: RehearsalEvent = {
      id: `reh-${Date.now()}`,
      title,
      companyName,
      discipline: discipline as any,
      targetSections: ['General'],
      date,
      startTime,
      endTime,
      location,
      description,
      qrCheckInCode: qrCode,
    };
    onAddRehearsal(newRehearsal);
    setShowModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      {/* Header Banner (Simplified) */}
      <div className="mitec-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar style={{ color: '#0033a0', width: '24px', height: '24px' }} /> Agenda
        </h2>

        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus style={{ width: '18px', height: '18px' }} /> Programar Ensayo
        </button>
      </div>

      {/* Grid of Rehearsals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {rehearsals.map((reh) => (
          <div key={reh.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="badge badge-purple">{reh.discipline}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                {reh.date}
              </span>
            </div>

            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{reh.title}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock style={{ width: '15px', height: '15px', color: 'var(--primary)' }} />
                <span>Horario: <strong>{reh.startTime} - {reh.endTime} hs</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin style={{ width: '15px', height: '15px', color: 'var(--accent-amber)' }} />
                <span>Ubicación: <strong>{reh.location}</strong></span>
              </div>
            </div>

            {reh.description && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--bg-dark)', padding: '10px', borderRadius: '8px' }}>
                {reh.description}
              </p>
            )}

            <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Código Lista QR:</span>
              <span style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem' }}>
                {reh.qrCheckInCode}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Programar Ensayo */}
      {showModal && (
        <div className="modal-backdrop">
          <form onSubmit={handleSubmit} className="glass-panel" style={{ width: '500px', padding: '28px', background: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar style={{ color: 'var(--primary)' }} /> Programar Convocatoria de Ensayo
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Título del Ensayo</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Ensayo Tutti - Huapango de Moncayo"
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Disciplina</label>
                  <select
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                  >
                    <option value="MUSICA">Música</option>
                    <option value="CANTO">Canto</option>
                    <option value="BAILE">Baile</option>
                    <option value="TEATRO">Teatro</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Fecha</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Hora Inicio</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Hora Fin</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Lugar / Salón Tec</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Salón de Ensamble A-101"
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Indicaciones Especiales</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Traer partitura impresa y atril..."
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">
                  <CheckCircle style={{ width: '16px', height: '16px' }} /> Publicar Ensayo & Generar QR
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
