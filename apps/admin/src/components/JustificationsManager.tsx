import React, { useState } from 'react';
import { FileText, CheckCircle, XCircle, ExternalLink, ShieldAlert } from 'lucide-react';

interface JustificationItem {
  id: string;
  studentName: string;
  matricula: string;
  rehearsalTitle: string;
  rehearsalDate: string;
  reason: string;
  fileUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const JustificationsManager: React.FC = () => {
  const [justifications, setJustifications] = useState<JustificationItem[]>([
    {
      id: 'just-1',
      studentName: 'Diego Villalobos',
      matricula: 'A01712345',
      rehearsalTitle: 'Ensayo General - Gala de Invierno Tec',
      rehearsalDate: '2026-08-13',
      reason: 'Examen Parcial de Cálculo Multivariable programado en el mismo horario por el departamento de Ciencias Básicas.',
      fileUrl: 'https://pdfobject.com/pdf/sample.pdf',
      status: 'PENDING',
    },
  ]);

  const handleApprove = (id: string) => {
    setJustifications((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: 'APPROVED' } : j))
    );
  };

  const handleReject = (id: string) => {
    setJustifications((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: 'REJECTED' } : j))
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <FileText style={{ color: '#38bdf8', width: '20px', height: '20px' }} />
          <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
            Gestión de Inasistencias Académicas y Médicas
          </span>
        </div>
        <h2 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Revisión de Justificantes de Alumnos</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
          Aprueba o rechaza solicitudes de justificante por exámenes o fuerza mayor acompañados de comprobante.
        </p>
      </div>

      {/* Justifications Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Ensayo / Convocatoria</th>
              <th>Motivo Expuesto</th>
              <th>Comprobante Attached</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {justifications.map((j) => (
              <tr key={j.id}>
                <td>
                  <div style={{ fontWeight: 600, color: '#f8fafc' }}>{j.studentName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'monospace' }}>{j.matricula}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#a78bfa' }}>{j.rehearsalTitle}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>📅 {j.rehearsalDate}</div>
                </td>
                <td style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '280px' }}>{j.reason}</td>
                <td>
                  {j.fileUrl ? (
                    <a
                      href={j.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#38bdf8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                    >
                      <ExternalLink style={{ width: '14px', height: '14px' }} /> Ver Comprobante (PDF)
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Sin archivo</span>
                  )}
                </td>
                <td>
                  {j.status === 'PENDING' ? (
                    <span className="badge badge-pending">PENDIENTE</span>
                  ) : j.status === 'APPROVED' ? (
                    <span className="badge badge-active">JUSTIFICADO</span>
                  ) : (
                    <span className="badge badge-purple">RECHAZADO</span>
                  )}
                </td>
                <td>
                  {j.status === 'PENDING' ? (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn-success" onClick={() => handleApprove(j.id)}>
                        <CheckCircle style={{ width: '14px', height: '14px' }} /> Validar
                      </button>
                      <button className="btn-danger" onClick={() => handleReject(j.id)}>
                        <XCircle style={{ width: '14px', height: '14px' }} /> Rechazar
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Procesado</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
