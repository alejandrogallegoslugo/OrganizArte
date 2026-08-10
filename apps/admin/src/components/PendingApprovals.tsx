import React, { useState } from 'react';
import { UserCheck, CheckCircle, XCircle, Mail, Sparkles, UserPlus, Clock } from 'lucide-react';
import { StudentProfile, DisciplineType } from '../shared';
import { AdminCreateStudentModal } from './AdminCreateStudentModal';

interface PendingApprovalsProps {
  students: StudentProfile[];
  onApproveStudent: (studentId: string, company: string, discipline: DisciplineType, section: string) => void;
  onRejectStudent: (studentId: string) => void;
  onAddDirectStudent?: (newStudent: StudentProfile, parsedCourses: any[], validityPeriod: string, validUntil: string) => void;
}

export const PendingApprovals: React.FC<PendingApprovalsProps> = ({
  students,
  onApproveStudent,
  onRejectStudent,
  onAddDirectStudent,
}) => {
  const pendingStudents = students.filter((s) => s.status === 'PENDING_APPROVAL');

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <UserCheck style={{ color: 'var(--accent-amber)', width: '20px', height: '20px' }} />
            <span style={{ color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Control de Accesos & Alta Directa
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Aprobación y Gestión de Integrantes</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Aprueba registros pendientes o registra tú directamente al alumno cargando su horario de MiTec con IA y vigencia semestral.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            <UserPlus style={{ width: '18px', height: '18px' }} /> Alta Directa + Horario IA
          </button>
          <div style={{ background: 'rgba(217, 119, 6, 0.1)', border: '1px solid rgba(217, 119, 6, 0.25)', padding: '10px 16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{pendingStudents.length}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pendientes</div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        {pendingStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
            <CheckCircle style={{ width: '48px', height: '48px', color: 'var(--accent-emerald)', margin: '0 auto 12px auto', display: 'block' }} />
            <h3 style={{ color: 'var(--text-main)', marginBottom: '4px' }}>¡No hay solicitudes pendientes!</h3>
            <p style={{ fontSize: '0.9rem' }}>Todos los integrantes registrados están verificados y activos.</p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Alumno / Correo</th>
                <th>Matrícula</th>
                <th>Compañía Solicitada</th>
                <th>Disciplina / Sección</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pendingStudents.map((student) => (
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
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{student.createdAt}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-success" onClick={() => handleOpenApproveModal(student)}>
                        <CheckCircle style={{ width: '14px', height: '14px' }} /> Aprobar & Activar
                      </button>
                      <button className="btn-danger" onClick={() => onRejectStudent(student.id)}>
                        <XCircle style={{ width: '14px', height: '14px' }} /> Rechazar
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
