import React, { useState } from 'react';
import { FileText, Upload, Send, CheckCircle2, X } from 'lucide-react';
import { RehearsalEvent } from '../shared';

interface JustificationFormProps {
  rehearsal: RehearsalEvent;
  onClose: () => void;
}

export const JustificationForm: React.FC<JustificationFormProps> = ({ rehearsal, onClose }) => {
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop">
      <div className="pwa-card" style={{ width: '100%', maxWidth: '420px', background: '#0f172a', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </button>

        <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', marginBottom: '4px' }}>Justificar Inasistencia</h3>
        <p style={{ fontSize: '0.8rem', color: '#38bdf8', marginBottom: '16px' }}>{rehearsal.title} ({rehearsal.date})</p>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle2 style={{ width: '56px', height: '56px', color: '#10b981', margin: '0 auto 12px auto' }} />
            <h4 style={{ color: '#f8fafc', fontSize: '1.1rem', marginBottom: '4px' }}>¡Justificante Enviado!</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px' }}>
              El director revisará el motivo y el comprobante para justificar la inasistencia.
            </p>
            <button className="btn-pwa-secondary" onClick={onClose}>Cerrar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Motivo Académico / Médico</label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explica la razón de tu falta (ej. Examen parcial, cita médica)..."
                style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Adjuntar Comprobante (PDF o Imagen)</label>
              <div style={{ border: '1px dashed rgba(255,255,255,0.2)', padding: '14px', borderRadius: '8px', textAlign: 'center', color: '#38bdf8', fontSize: '0.8rem', background: 'rgba(255,255,255,0.02)', cursor: 'pointer' }}>
                <Upload style={{ width: '20px', height: '20px', margin: '0 auto 4px auto' }} />
                Subir comprobante o citatorio
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button type="button" className="btn-pwa-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn-pwa-primary">
                <Send style={{ width: '16px', height: '16px' }} /> Enviar Justificante
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
