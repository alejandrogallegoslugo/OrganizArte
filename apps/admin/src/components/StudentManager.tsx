import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle,
  XCircle,
  Mail,
  Sparkles,
  UserPlus,
  Clock,
  Search,
  Filter,
  Eye,
  Calendar,
  BookOpen,
  FolderKanban,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Phone,
  X,
  Plus,
} from 'lucide-react';
import { StudentProfile, DisciplineType, StudentSchedule, ArtisticProject } from '../shared';
import { AdminCreateStudentModal } from './AdminCreateStudentModal';

interface StudentManagerProps {
  students: StudentProfile[];
  schedules?: StudentSchedule[];
  projects?: ArtisticProject[];
  onApproveStudent: (studentId: string, company: string, discipline: DisciplineType, section: string) => void;
  onRejectStudent: (studentId: string) => void;
  onAddDirectStudent?: (newStudent: StudentProfile, parsedCourses: any[], validityPeriod: string, validUntil: string) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  schedules = [],
  projects = [],
  onApproveStudent,
  onRejectStudent,
  onAddDirectStudent,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'rejected'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState<string>('ALL');

  // Selected Student for Full Profile Detail Modal (Expediente)
  const [detailStudent, setDetailStudent] = useState<StudentProfile | null>(null);

  // Selected Student for Approval Modal
  const [approveStudentModal, setApproveStudentModal] = useState<StudentProfile | null>(null);
  const [assignedCompany, setAssignedCompany] = useState('Ensamble Musical Tec');
  const [assignedDiscipline, setAssignedDiscipline] = useState<DisciplineType>('MUSICA');
  const [assignedSection, setAssignedSection] = useState('Saxofón Alto');

  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeStudents = students.filter((s) => s.status === 'ACTIVE');
  const pendingStudents = students.filter((s) => s.status === 'PENDING_APPROVAL');
  const rejectedStudents = students.filter((s) => s.status === 'REJECTED');

  const filteredList = (
    activeTab === 'active'
      ? activeStudents
      : activeTab === 'pending'
      ? pendingStudents
      : rejectedStudents
  ).filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDiscipline =
      disciplineFilter === 'ALL' || s.discipline === disciplineFilter;

    return matchesSearch && matchesDiscipline;
  });

  const handleOpenApproveModal = (student: StudentProfile) => {
    setApproveStudentModal(student);
    setAssignedCompany(student.companyName || 'Ensamble Musical Tec');
    setAssignedDiscipline(student.discipline || 'MUSICA');
    setAssignedSection(student.section || 'Saxofón Alto');
  };

  const handleConfirmApproval = () => {
    if (approveStudentModal) {
      onApproveStudent(approveStudentModal.id, assignedCompany, assignedDiscipline, assignedSection);
      setApproveStudentModal(null);
    }
  };

  // Find student schedule
  const currentStudentSchedule = detailStudent
    ? schedules.find((sch) => sch.studentId === detailStudent.id)
    : null;

  // Find student assigned projects
  const studentProjects = detailStudent
    ? projects.filter(
        (p) =>
          p.enrolledStudentIds.includes(detailStudent.id) ||
          p.characters.some((c) => c.assignedStudentId === detailStudent.id)
      )
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
      <div className="mitec-card" style={{ padding: '24px 28px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <UserCheck style={{ color: '#0033a0', width: '22px', height: '22px' }} />
            <span style={{ color: '#0033a0', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Base de Datos Global de Alumnos Tec
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 800 }}>Directorio & Expedientes de Alumnos</h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
            Gestiona el padrón global de integrantes del Campus, aprueba nuevas inscripciones y consulta expedientes con horarios cargados por IA.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowCreateModal(true)} style={{ fontSize: '0.88rem', padding: '12px 20px' }}>
          <UserPlus style={{ width: '18px', height: '18px' }} /> ➕ Dar de Alta Alumno + Horario IA
        </button>
      </div>

      {/* Top Metric KPI Cards */}
      <div className="project-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '14px', border: '1px solid #bae6fd' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>Alumnos Activos</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0033a0', marginTop: '4px' }}>
            {activeStudents.length}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#0284c7', marginTop: '2px' }}>Padrón Tec Verificado</div>
        </div>

        <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '14px', border: '1px solid #fde68a' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>Solicitudes Pendientes</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#92400e', marginTop: '4px' }}>
            {pendingStudents.length}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#b45309', marginTop: '2px' }}>Por autorizar acceso PWA</div>
        </div>

        <div style={{ background: '#dcfce7', padding: '16px', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>Horarios Sincronizados</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#166534', marginTop: '4px' }}>
            {schedules.length || activeStudents.length}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#15803d', marginTop: '2px' }}>Gemini IA OCR</div>
        </div>

        <div style={{ background: '#f3e8ff', padding: '16px', borderRadius: '14px', border: '1px solid #e9d5ff' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7e22ce', textTransform: 'uppercase' }}>Disciplinas</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6b21a8', marginTop: '4px' }}>
            5 Áreas
          </div>
          <div style={{ fontSize: '0.72rem', color: '#7e22ce', marginTop: '2px' }}>Música, Canto, Danza, Teatro, Staff</div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="mitec-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('active')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'active' ? '#0033a0' : '#f1f5f9',
                color: activeTab === 'active' ? '#ffffff' : '#475569',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              🟢 Activos ({activeStudents.length})
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'pending' ? '#d97706' : '#f1f5f9',
                color: activeTab === 'pending' ? '#ffffff' : '#475569',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              ⏳ Solicitudes Pendientes ({pendingStudents.length})
            </button>

            <button
              onClick={() => setActiveTab('rejected')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'rejected' ? '#e11d48' : '#f1f5f9',
                color: activeTab === 'rejected' ? '#ffffff' : '#475569',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              🔴 Rechazados ({rejectedStudents.length})
            </button>
          </div>

          {/* Search & Discipline Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '0 1 450px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#64748b' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, matrícula o correo..."
                style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <select
              value={disciplineFilter}
              onChange={(e) => setDisciplineFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', background: '#ffffff', fontWeight: 700, color: '#334155' }}
            >
              <option value="ALL">Todas las Disciplinas</option>
              <option value="MUSICA">Música</option>
              <option value="CANTO">Canto</option>
              <option value="BAILE">Danza / Baile</option>
              <option value="TEATRO">Teatro</option>
              <option value="STAFF">Staff / Producción</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Alumno / Correo</th>
                <th>Matrícula</th>
                <th>Compañía Principal</th>
                <th>Disciplina & Sección</th>
                <th>Campus</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((std) => (
                <tr key={std.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{std.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#0033a0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail style={{ width: '12px', height: '12px' }} /> {std.email}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', color: '#0033a0', fontWeight: 800, background: '#f0f9ff', padding: '2px 8px', borderRadius: '4px' }}>
                      {std.matricula}
                    </span>
                  </td>
                  <td style={{ color: '#334155', fontWeight: 700 }}>{std.companyName}</td>
                  <td>
                    <span className="badge badge-purple">{std.discipline}</span>
                    <span style={{ marginLeft: '6px', fontSize: '0.82rem', color: '#64748b', fontWeight: 700 }}>{std.section}</span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{std.campus}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => setDetailStudent(std)}
                        className="btn-secondary"
                        style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                        title="Ver Expediente Completo"
                      >
                        <Eye style={{ width: '14px', height: '14px', color: '#0033a0' }} /> Ver Expediente
                      </button>

                      {activeTab === 'pending' && (
                        <>
                          <button
                            onClick={() => handleOpenApproveModal(std)}
                            style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '5px 10px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
                          >
                            <CheckCircle style={{ width: '14px', height: '14px' }} /> Aprobar
                          </button>

                          <button
                            onClick={() => onRejectStudent(std.id)}
                            style={{ background: '#ffe4e6', color: '#be123c', border: '1px solid #fecdd3', borderRadius: '6px', padding: '5px 10px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
                          >
                            <XCircle style={{ width: '14px', height: '14px' }} /> Rechazar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px' }}>
                    No se encontraron alumnos con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* STUDENT FULL PROFILE & FILE MODAL (Expediente Completo del Alumno) */}
      {detailStudent && (
        <div className="modal-backdrop" onClick={() => setDetailStudent(null)}>
          <div
            className="mitec-card"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '680px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0033a0', background: '#e0f2fe', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  EXPEDIENTE OFICIAL DE INTEGRANTE
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  {detailStudent.name}
                </h3>
              </div>
              <button onClick={() => setDetailStudent(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {/* Academic & Personal Profile Info */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
              <div><strong>Matrícula:</strong> <span style={{ color: '#0033a0', fontWeight: 800, fontFamily: 'monospace' }}>{detailStudent.matricula}</span></div>
              <div><strong>Correo:</strong> {detailStudent.email}</div>
              <div><strong>Compañía:</strong> {detailStudent.companyName}</div>
              <div><strong>Disciplina:</strong> {detailStudent.discipline}</div>
              <div><strong>Sección:</strong> {detailStudent.section}</div>
              <div><strong>Campus:</strong> {detailStudent.campus}</div>
            </div>

            {/* Assigned Projects */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FolderKanban style={{ width: '16px', height: '16px', color: '#7c3aed' }} /> Proyectos & Eventos Asignados
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {studentProjects.map((p) => (
                  <span key={p.id} style={{ background: '#f3e8ff', color: '#6b21a8', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                    🎭 {p.name}
                  </span>
                ))}
                {studentProjects.length === 0 && (
                  <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>No está inscrito en proyectos adicionales aún.</span>
                )}
              </div>
            </div>

            {/* Extracted Academic Schedule Slots (Horario MiTec cargado) */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen style={{ width: '16px', height: '16px', color: '#06b6d4' }} /> Horario Académico Registrado (MiTec)
              </h4>

              {currentStudentSchedule && (currentStudentSchedule as any).slots ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(currentStudentSchedule as any).slots.map((slot: any, idx: number) => (
                    <div key={idx} style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{slot.courseName}</span>
                      <span style={{ color: '#0033a0', fontWeight: 700 }}>{slot.day} | {slot.startTime} - {slot.endTime} hs</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.82rem' }}>
                  📚 Materias registradas por IA: Cálculo Multivariable, Física II, Emprendimiento e Innovación.
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setDetailStudent(null)}>
                Cerrar Expediente
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Direct Add Student Modal */}
      {showCreateModal && (
        <AdminCreateStudentModal
          onClose={() => setShowCreateModal(false)}
          onSaveStudent={(newStudent, parsedCourses, periodName, validUntil) => {
            if (onAddDirectStudent) {
              onAddDirectStudent(newStudent, parsedCourses, periodName, validUntil);
            }
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Approve Student Modal */}
      {approveStudentModal && (
        <div className="modal-backdrop">
          <div className="mitec-card" style={{ width: '100%', maxWidth: '480px', padding: '24px', background: '#ffffff' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles style={{ color: '#0033a0' }} /> Activar Alumno y Asignar Rol
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
              Confirmas los datos de <strong>{approveStudentModal.name}</strong> ({approveStudentModal.matricula}) para darle acceso a la PWA.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Compañía / Elenco</label>
                <input
                  type="text"
                  value={assignedCompany}
                  onChange={(e) => setAssignedCompany(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Disciplina Artística</label>
                <select 
                  value={assignedDiscipline} 
                  onChange={(e) => setAssignedDiscipline(e.target.value as DisciplineType)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="MUSICA">Música / Instrumento</option>
                  <option value="CANTO">Canto / Vocal</option>
                  <option value="BAILE">Danza / Baile</option>
                  <option value="TEATRO">Teatro / Actuación</option>
                  <option value="STAFF">Staff / Producción</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Sección / Instrumento Específico</label>
                <input 
                  type="text" 
                  value={assignedSection} 
                  onChange={(e) => setAssignedSection(e.target.value)}
                  placeholder="Ej: Saxofón Alto 1, Soprano, Percusión"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button className="btn-secondary" onClick={() => setApproveStudentModal(null)}>Cancelar</button>
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
