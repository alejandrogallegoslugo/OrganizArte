import React, { useState } from 'react';
import { QrCode, CheckCircle2, X } from 'lucide-react';

interface QRScannerModalProps {
  rehearsalId: string;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ rehearsalId, onClose }) => {
  const [scanning, setScanning] = useState(true);
  const [scannedSuccess, setScannedSuccess] = useState(false);

  const handleSimulateScan = () => {
    setScanning(false);
    setTimeout(() => {
      setScannedSuccess(true);
    }, 600);
  };

  return (
    <div className="modal-backdrop">
      <div className="pwa-card" style={{ width: '100%', maxWidth: '380px', background: '#0f172a', textAlign: 'center', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </button>

        <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', marginBottom: '4px' }}>Escanear QR de Ensayo</h3>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '20px' }}>
          Apunta con la cámara al código QR proyectado por el director.
        </p>

        {/* Viewfinder Mock */}
        <div
          onClick={handleSimulateScan}
          style={{
            width: '220px',
            height: '220px',
            margin: '0 auto 20px auto',
            border: '3px solid #38bdf8',
            borderRadius: '24px',
            position: 'relative',
            background: 'rgba(56, 189, 248, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            overflow: 'hidden'
          }}
        >
          {scannedSuccess ? (
            <div style={{ color: '#34d399', textAlign: 'center' }}>
              <CheckCircle2 style={{ width: '64px', height: '64px', margin: '0 auto 8px auto' }} />
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>¡Asistencia Confirmada!</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Pase de lista registrado</div>
            </div>
          ) : (
            <>
              <QrCode style={{ width: '100px', height: '100px', color: '#38bdf8', opacity: 0.8 }} />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#38bdf8',
                  boxShadow: '0 0 10px #38bdf8',
                  top: '50%',
                  animation: 'pulse 1.5s infinite'
                }}
              />
            </>
          )}
        </div>

        {!scannedSuccess ? (
          <button className="btn-pwa-primary" onClick={handleSimulateScan}>
            Toca para Simular Escaneo
          </button>
        ) : (
          <button className="btn-pwa-secondary" onClick={onClose}>
            Listo
          </button>
        )}
      </div>
    </div>
  );
};
