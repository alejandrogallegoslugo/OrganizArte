import React, { useState } from 'react';
import { UserCheck, CheckCircle2, XCircle, Mail, Sparkles, UserPlus, Clock, Trash2, Users, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { StudentProfile, DisciplineType } from '../shared';
import { AdminCreateStudentModal } from './AdminCreateStudentModal';

interface PendingApprovalsProps {
  students: StudentProfile[];
  onApproveStudent: (studentId: string, company: string, discipline: DisciplineType, section: string) => void;
  onRejectStudent: (studentId: string) => void;
  onDeleteStudent?: (studentId: string) => void;
  onAddDirectStudent?: (newStudent: StudentProfile, parsedCourses: any[], validityPeriod: string, validUntil: string) => void;
}

export const PendingApprovals: React.FC<PendingApprovalsProps> = ({
  students,
  onApproveStudent,
  onRejectStudent,
  onDeleteStudent,
  onAddDirectStudent,
}) => {
  const [subTab, setSubTab] = useState<'pending' | 'all'>('pending');

  const pendingStudents = students.filter((s) => s.status === 'PENDING_APPROVAL');
  const activeStudents = students.filter((s) => s.status === 'ACTIVE');

  const displayedStudents = subTab === 'pending' ? pendingStudents : students;

  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [assignedCompany, setAssignedCompany] = useState('Ensamble Musical Tec');
  const [assignedDiscipline, setAssignedDiscipline] = useState<DisciplineType>('MUSICA');
  const [assignedSection, setAssignedSection] = useState('Saxofón Alto');

  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleOpenApproveModal = (student: StudentProfile) => {
    setSelectedStudent(student);
    setAssignedCompany(student.companyName || 'Ensamble Musical Tec');
    setAssignedDiscipline(student.discipline || 'MUSICA');
    setAssignedSection(student.section || 'General');
  };

  const handleConfirmApproval = () => {
    if (selectedStudent) {
      onApproveStudent(selectedStudent.id, assignedCompany, assignedDiscipline, assignedSection);
      setSelectedStudent(null);
    }
  };

  const handleDeleteConfirm = (studentId: string, studentName: string) => {
    if (confirm(`¿Estás seguro de eliminar permanentemente al alumno "${studentName}" de la base de datos?`)) {
      if (onDeleteStudent) {
        onDeleteStudent(studentId);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
      {/* Top Header Card */}
      <div className="executive-card" style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-amber">CONTROL DE INTEGRANTES</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {pendingStudents.length} Solicitudes por Validar
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Aprobación y Directorio de Alumnos
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Valida las solicitudes de registro para habilitar el acceso a la App de Alumnos PWA o administra los integrantes activos.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <UserPlus style={{ width: '18px', height: '18px' }} />
          <span>Alta Directa + Horario IA</span>
        </button>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setSubTab('pending')}
          style={{
            background: subTab === 'pending' ? 'var(--primary-light)' : 'var(--bg-card)',
            border: subTab === 'pending' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
            color: subTab === 'pending' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 800,
            padding: '10px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: subTab === 'pending' ? 'var(--shadow-sm)' : 'none',
          }}
        >
          <Clock style={{ width: '16px', height: '16px' }} />
          <span>Solicitudes Pendientes ({pendingStudents.length})</span>
          {pendingStudents.length > 0 && (
            <span style={{
              background: 'var(--rose-accent)',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '2px 7px',
              borderRadius: '999px',
            }}>
              {pendingStudents.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('all')}
          style={{
            background: subTab === 'all' ? 'var(--primary-light)' : 'var(--bg-card)',
            border: subTab === 'all' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
            color: subTab === 'all' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 800,
            padding: '10px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: subTab === 'all' ? 'var(--shadow-sm)' : 'none',
          }}
        >
          <Users style={{ width: '16px', height: '16px' }} />
          <span>Todos los Alumnos ({students.length})</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="executive-card" style={{ padding: '24px', overflowX: 'auto' }}>
        {displayedStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
            <CheckCircle2 style={{ width: '48px', height: '48px', color: 'var(--emerald-accent)', margin: '0 auto 12px auto', display: 'block' }} />
            <h3 style={{ color: 'var(--text-main)', marginBottom: '4px', fontSize: '1.15rem', fontWeight: 800 }}>
              {subTab === 'pending' ? '¡No hay solicitudes pendientes!' : 'No hay alumnos registrados'}
            </h3>
            <p style={{ fontSize: '0.85rem' }}>
              {subTab === 'pending' ? 'Todos los alumnos registrados han sido aprobados y cuentan con acceso a la app.' : 'Comienza dando de alta un alumno o invitándolos a registrarse en la PWA.'}
            </p>
          </div>
        ) : (
          <table className="custom-table" style={{ width: '100%', minWidth: '760px' }}>
            <thead>
              <tr>
                <th>ALUMNO / CORREO</th>
                <th>MATRÍCULA</th>
                <th>COMPAÑÍA / ELENCO</th>
                <th>DISCIPLINA / SECCIÓN</th>
                <th>ESTATUS</th>
                <th style={{ textAlign: 'right' }}>ACCIONES DE VALIDACIÓN</th>
              </tr>
            </thead>
            <tbody>
              {displayedStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>{student.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Mail style={{ width: '12px', height: '12px' }} /> {student.email}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', color: 'var(--amber-accent)', fontWeight: 800, fontSize: '0.88rem' }}>
                      {student.matricula}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{student.companyName}</td>
                  <td>
                    <span className="badge badge-purple">{student.discipline}</span>
                    <span style={{ marginLeft: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {student.section}
                    </span>
                  </td>
                  <td>
                    {student.status === 'ACTIVE' ? (
                      <span className="badge badge-emerald">🟢 ACTIVO</span>
                    ) : student.status === 'PENDING_APPROVAL' ? (
                      <span className="badge badge-amber">🟡 PENDIENTE</span>
                    ) : (
                      <span className="badge badge-rose">🔴 RECHAZADO</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      {student.status === 'PENDING_APPROVAL' && (
                        <>
                          <button className="btn-success" onClick={() => handleOpenApproveModal(student)}>
                            <CheckCircle2 style={{ width: '15px', height: '15px' }} />
                            <span>Aprobar & Activar</span>
                          </button>
                          <button className="btn-danger" onClick={() => onRejectStudent(student.id)}>
                            <XCircle style={{ width: '15px', height: '15px' }} />
                            <span>Rechazar</span>
                          </button>
                        </>
                      )}

                      {student.status === 'ACTIVE' && (
                        <button
                          className="btn-secondary"
                          onClick={() => handleOpenApproveModal(student)}
                          style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                          title="Modificar asignación de elenco o disciplina"
                        >
                          <span>Reasignar Rol</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteConfirm(student.id, student.name)}
                        style={{
                          background: 'rgba(244, 63, 94, 0.08)',
                          border: '1px solid rgba(244, 63, 94, 0.2)',
                          color: 'var(--rose-accent)',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}
                        title="Eliminar Alumno"
                      >
                        <Trash2 style={{ width: '14px', height: '14px' }} />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Direct Add Student Modal */}
      {showCreateModal && (
        <AdminCreateStudentModal
          onClose={() => setShowCreateModal(false)}
          onSaveStudent={(newStudent, parsedCourses, periodName, validUntil) => {
            if (onAddDirectStudent) {
              onAddDirectStudent(newStudent, parsedCourses, periodName, validUntil);
            }
          }}
        />
      )}

      {/* Approve & Assign Modal */}
      {selectedStudent && (
        <div className="modal-backdrop">
          <div className="executive-card" style={{ width: '100%', maxWidth: '520px', padding: '32px', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck style={{ color: 'var(--emerald-accent)', width: 22, height: 22 }} />
                <span>Activar Alumno y Asignar Rol</span>
              </h3>
              <button onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
              Confirmas los datos de asignación para <strong style={{ color: 'var(--text-main)' }}>{selectedStudent.name}</strong> ({selectedStudent.matricula}) para habilitar su acceso oficial a la App de Alumnos PWA.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  COMPAÑÍA / ELENCO ARTÍSTICO
                </label>
                <select 
                  value={assignedCompany} 
                  onChange={(e) => setAssignedCompany(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px' }}
                >
                  <option value="Ensamble Musical Tec">🎵 Ensamble Musical Tec</option>
                  <option value="Comedia Musical 2026">🎭 Comedia Musical 2026</option>
                  <option value="Grupo de Baile Urbano">💃 Grupo de Baile Urbano</option>
                  <option value="Compañía de Canto Vocal">🎤 Compañía de Canto Vocal</option>
                  <option value="Compañía de Teatro">🎬 Compañía de Teatro</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  DISCIPLINA ARTÍSTICA
                </label>
                <select 
                  value={assignedDiscipline} 
                  onChange={(e) => setAssignedDiscipline(e.target.value as DisciplineType)}
                  style={{ width: '100%', padding: '12px 14px' }}
                >
                  <option value="MUSICA">🎺 Música / Instrumento</option>
                  <option value="CANTO">🎤 Canto / Vocal</option>
                  <option value="DANZA">💃 Danza / Baile</option>
                  <option value="ACTUACION">🎭 Actuación / Teatro</option>
                  <option value="STAFF">🛠️ Staff / Escenografía</option>
                  <option value="PRODUCCION">🎬 Producción / Dirección</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  SECCIÓN O INSTRUMENTO ESPECÍFICO
                </label>
                <input 
                  type="text" 
                  value={assignedSection} 
                  onChange={(e) => setAssignedSection(e.target.value)}
                  placeholder="Ej: Saxofón Alto 1, Soprano, Percusión, Elenco Principal"
                  style={{ width: '100%', padding: '12px 14px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button className="btn-secondary" onClick={() => setSelectedStudent(null)}>
                  Cancelar
                </button>
                <button className="btn-success" onClick={handleConfirmApproval}>
                  <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                  <span>Confirmar & Activar Alumno</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
