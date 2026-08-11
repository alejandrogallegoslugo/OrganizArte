import React, { useState } from 'react';
import { ShieldCheck, QrCode, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { StudentProfile } from '../shared';
import { QRCodeSVG } from './QRCodeSVG';

interface MiIDDigitalCardProps {
  student: StudentProfile;
}

export const MiIDDigitalCard: React.FC<MiIDDigitalCardProps> = ({ student }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const qrData = `ATTENDANCE:${student.matricula || student.id}:${student.name}`;

  return (
    <div
      className="mitec-card"
      style={{
        borderRadius: '20px',
        padding: '20px',
        background: 'linear-gradient(135deg, #0033a0 0%, #001f66 100%)',
        color: '#ffffff',
        boxShadow: '0 10px 30px rgba(0, 51, 160, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
      }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* Background Decorative Waves */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.06)',
        pointerEvents: 'none',
      }} />

      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '2px', height: '18px' }}>
            <span style={{ width: '3px', height: '16px', background: '#f59e0b', borderRadius: '2px' }} />
            <span style={{ width: '3px', height: '18px', background: '#ec4899', borderRadius: '2px' }} />
            <span style={{ width: '3px', height: '14px', background: '#06b6d4', borderRadius: '2px' }} />
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            ID Arte y Cultura
          </span>
        </div>
        <span style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#34d399',
          fontSize: '0.68rem',
          fontWeight: 800,
          padding: '3px 8px',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <CheckCircle2 style={{ width: '12px', height: '12px' }} /> ALUMNO ACTIVO
        </span>
      </div>

      {!isFlipped ? (
        /* Front Side: Credential Details */
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* Avatar Photo */}
          <div style={{ position: 'relative' }}>
            <img
              src="/logo.png"
              alt={student.name}
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '16px',
                objectFit: 'cover',
                border: '3px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              background: '#06b6d4',
              borderRadius: '50%',
              padding: '3px',
              display: 'flex'
            }}>
              <ShieldCheck style={{ width: '12px', height: '12px', color: '#fff' }} />
            </div>
          </div>

          {/* Student Info */}
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: '2px' }}>
              {student.name}
            </h3>
            <div style={{ fontSize: '0.82rem', opacity: 0.9, fontWeight: 700, color: '#38bdf8' }}>
              {student.matricula || 'A01234567'} • {student.campus || 'Tec Campus Laguna'}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '4px' }}>
              🎭 Arte y Cultura Tec ({student.discipline || 'Música'})
            </div>
          </div>

          {/* QR Flip Hint Button */}
          <div style={{ textAlign: 'center', opacity: 0.85 }}>
            <QrCode style={{ width: '28px', height: '28px', color: '#ffffff' }} />
            <span style={{ fontSize: '0.62rem', display: 'block', marginTop: '2px', fontWeight: 600 }}>Tocar QR</span>
          </div>
        </div>
      ) : (
        /* Back Side: Real Offline Scannable QR Code Screen */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6px 0' }}>
          <div style={{ background: '#ffffff', padding: '8px', borderRadius: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', marginBottom: '8px' }}>
            <QRCodeSVG value={qrData} size={110} color="#0033a0" bgColor="#ffffff" />
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textAlign: 'center' }}>
            Muestra este QR al profesor para tomar asistencia
          </span>
          <span style={{ fontSize: '0.68rem', opacity: 0.7, marginTop: '3px' }}>
            Toca la tarjeta para volver a la credencial
          </span>
        </div>
      )}
    </div>
  );
};


