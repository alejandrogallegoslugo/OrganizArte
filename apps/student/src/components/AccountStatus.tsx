import React from 'react';
import { Clock, ShieldAlert, Mail, CheckCircle } from 'lucide-react';
import { StudentProfile } from '../shared';

interface AccountStatusProps {
  student: StudentProfile;
}

export const AccountStatusBanner: React.FC<AccountStatusProps> = ({ student }) => {
  if (student.status === 'ACTIVE') return null;

  return (
    <div className="pwa-card" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)', border: '1px solid rgba(245, 158, 11, 0.4)', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <Clock style={{ width: '28px', height: '28px', color: '#fbbf24', flexShrink: 0 }} />
        <div>
          <h3 style={{ fontSize: '1.05rem', color: '#fbbf24', fontWeight: 800 }}>Cuenta Pendiente de Activación</h3>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px', lineHeight: '1.4' }}>
            Tu registro con <strong>{student.email}</strong> fue recibido con éxito. El director o administrador del Tec de Monterrey verificará tu perfil para darte acceso completo.
          </p>
          <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Mail style={{ width: '12px', height: '12px' }} /> Recibirás una notificación por correo (Resend) al ser activado.
          </div>
        </div>
      </div>
    </div>
  );
};
