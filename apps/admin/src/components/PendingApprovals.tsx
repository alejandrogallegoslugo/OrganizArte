import React, { useState } from 'react';
import { UserCheck, CheckCircle, XCircle, Mail, Sparkles, UserPlus, Clock, Trash2, Users, AlertCircle } from 'lucide-react';
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
  const [subTab, setSubTab] = useState<'pending' | 'all'>('all');

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
    setAssignedSection(student.section || 'Saxofón Alto');
  };

  const handleConfirmApproval = () => {
    if (selectedStudent) {
      onApproveStudent(selectedStudent.id, assignedCompany, assignedDiscipline, assignedSection);
      setSelectedStudent(null);
    }
  };

  const handleDeleteConfirm = (studentId: string, studentName: string) => {
    if (confirm(`¿Estás seguro de eliminar permanentemente al alumno "${studentName}" de la base de datos? Esta acción no se puede deshacer.`)) {
      if (onDeleteStudent) {
        onDeleteStudent(studentId);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <UserCheck style={{ color: 'var(--accent-amber)', width: '20px', height: '20px' }} />
            <span style={{ color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Control de Accesos & Gestión de Integrantes
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Aprobación y Directorio de Alumnos</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Aprueba registros pendientes, administra el directorio activo o elimina integrantes de prueba.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            <UserPlus style={{ width: '18px', height: '18px' }} /> Alta Directa + Horario IA
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        <button
          onClick={() => setSubTab('all')}
          style={{
            background: subTab === 'all' ? 'rgba(2, 132, 199, 0.15)' : 'transparent',
            border: 'none',
            color: subTab === 'all' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 700,
            padding: '10px 18px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Users style={{ width: '16px', height: '16px' }} /> Todos los Alumnos ({students.length})
        </button>

        <button
          onClick={() => setSubTab('pending')}
          style={{
            background: subTab === 'pending' ? 'rgba(217, 119, 6, 0.15)' : 'transparent',
            border: 'none',
            color: subTab === 'pending' ? 'var(--accent-amber)' : 'var(--text-muted)',
            fontWeight: 700,
            padding: '10px 18px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Clock style={{ width: '16px', height: '16px' }} /> Solicitudes Pendientes ({pendingStudents.length})
        </button>
      </div>

      {/* Main Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        {displayedStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
            <CheckCircle style={{ width: '48px', height: '48px', color: 'var(--accent-emerald)', margin: '0 auto 12px auto', display: 'block' }} />
            <h3 style={{ color: 'var(--text-main)', marginBottom: '4px' }}>No hay registros en esta sección</h3>
            <p style={{ fontSize: '0.9rem' }}>Todos los integrantes están al día.</p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Alumno / Correo</th>
                <th>Matrícula</th>
                <th>Compañía / Elenco</th>
                <th>Disciplina / Sección</th>
                <th>Estatus</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {displayedStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{student.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail style={{ width: '12px', height: '12px' }} /> {student.email}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', color: 'var(--accent-amber)', fontWeight: 700 }}>{student.matricula}</span>
                  </td>
                  <td style={{ color: 'var(--text-main)' }}>{student.companyName}</td>
                  <td>
                    <span className="badge badge-purple">{student.discipline}</span>
                    <span style={{ marginLeft: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{student.section}</span>
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
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {student.status === 'PENDING_APPROVAL' && (
                        <>
                          <button className="btn-success" onClick={() => handleOpenApproveModal(student)}>
                            <CheckCircle style={{ width: '14px', height: '14px' }} /> Aprobar
                          </button>
                          <button className="btn-danger" onClick={() => onRejectStudent(student.id)}>
                            <XCircle style={{ width: '14px', height: '14px' }} /> Rechazar
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleDeleteConfirm(student.id, student.name)}
                        style={{
                          background: 'rgba(225, 29, 72, 0.1)',
                          border: '1px solid rgba(225, 29, 72, 0.3)',
                          color: 'var(--accent-rose)',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                        title="Eliminar Alumno"
                      >
                        <Trash2 style={{ width: '14px', height: '14px' }} /> Eliminar
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
          <div className="glass-panel" style={{ width: '500px', padding: '28px', background: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles style={{ color: 'var(--primary)' }} /> Activar Alumno y Asignar Rol
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Confirmas los datos de <strong>{selectedStudent.name}</strong> ({selectedStudent.matricula}) para darle acceso a la PWA.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Compañía / Elenco</label>
                <select 
                  value={assignedCompany} 
                  onChange={(e) => setAssignedCompany(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                >
                  <option value="Ensamble Musical Tec">Ensamble Musical Tec</option>
                  <option value="Comedia Musical 2026">Comedia Musical 2026</option>
                  <option value="Grupo de Baile Urbano">Grupo de Baile Urbano</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Disciplina Artística</label>
                <select 
                  value={assignedDiscipline} 
                  onChange={(e) => setAssignedDiscipline(e.target.value as DisciplineType)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                >
                  <option value="MUSICA">Música / Instrumento</option>
                  <option value="CANTO">Canto / Vocal</option>
                  <option value="BAILE">Danza / Baile</option>
                  <option value="TEATRO">Teatro / Actuación</option>
                  <option value="STAFF">Staff / Producción</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Sección / Instrumento Específico</label>
                <input 
                  type="text" 
                  value={assignedSection} 
                  onChange={(e) => setAssignedSection(e.target.value)}
                  placeholder="Ej: Saxofón Alto 1, Soprano, Percusión"
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button className="btn-secondary" onClick={() => setSelectedStudent(null)}>Cancelar</button>
                <button className="btn-primary" onClick={handleConfirmApproval}>
                  <CheckCircle style={{ width: '16px', height: '16px' }} /> Confirmar & Activar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
