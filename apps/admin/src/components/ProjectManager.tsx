import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Archive,
  Calendar,
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  UserPlus,
  Trash2,
  Edit,
  Tag,
  ShieldCheck,
  Building,
  Star,
} from 'lucide-react';
import { ArtisticProject, ProjectCharacter, StudentProfile, ProjectType } from '../shared';

interface ProjectManagerProps {
  projects: ArtisticProject[];
  students: StudentProfile[];
  onCreateProject: (project: ArtisticProject) => void;
  onUpdateProject: (project: ArtisticProject) => void;
  onArchiveProject: (projectId: string) => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  projects,
  students,
  onCreateProject,
  onUpdateProject,
  onArchiveProject,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'archived' | 'create'>('active');
  const [selectedProject, setSelectedProject] = useState<ArtisticProject | null>(projects[0] || null);

  // New Project Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<ProjectType>('SPECIAL_EVENT');
  const [campus, setCampus] = useState('Tec Campus Laguna (Torreón)');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  // New Character Form State (inside selected project)
  const [charName, setCharName] = useState('');
  const [roleType, setRoleType] = useState<'PRINCIPAL' | 'SECONDARY' | 'ENSEMBLE' | 'SOLO'>('PRINCIPAL');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [charNotes, setCharNotes] = useState('');

  const activeProjects = projects.filter((p) => p.status === 'ACTIVE');
  const archivedProjects = projects.filter((p) => p.status === 'ARCHIVED');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProj: ArtisticProject = {
      id: `proj-${Date.now()}`,
      name,
      type,
      campus,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || '2026-12-31',
      status: 'ACTIVE',
      directorName: 'Prof. Alejandro Gallegos',
      description,
      characters: [],
      enrolledStudentIds: [],
    };

    onCreateProject(newProj);
    setSelectedProject(newProj);
    setActiveTab('active');
    setName('');
    setDescription('');
  };

  const handleAddCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !charName.trim()) return;

    const assignedStudent = students.find((s) => s.id === selectedStudentId);

    const newChar: ProjectCharacter = {
      id: `char-${Date.now()}`,
      name: charName,
      roleType,
      assignedStudentId: assignedStudent?.id,
      assignedStudentName: assignedStudent?.name,
      notes: charNotes,
    };

    const updatedChars = [...selectedProject.characters, newChar];
    const updatedEnrolled = assignedStudent?.id && !selectedProject.enrolledStudentIds.includes(assignedStudent.id)
      ? [...selectedProject.enrolledStudentIds, assignedStudent.id]
      : selectedProject.enrolledStudentIds;

    const updatedProj: ArtisticProject = {
      ...selectedProject,
      characters: updatedChars,
      enrolledStudentIds: updatedEnrolled,
    };

    onUpdateProject(updatedProj);
    setSelectedProject(updatedProj);
    setCharName('');
    setCharNotes('');
  };

  const getTypeBadge = (pType: ProjectType) => {
    switch (pType) {
      case 'COMPANY_SEMESTER':
        return <span style={{ background: '#e0f2fe', color: '#0033a0', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800 }}>🎭 Compañía Semestral</span>;
      case 'SPECIAL_EVENT':
        return <span style={{ background: '#fce7f3', color: '#be185d', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800 }}>🕯️ Evento Especial</span>;
      case 'EXTRA_MASTERCLASS':
        return <span style={{ background: '#fef3c7', color: '#d97706', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800 }}>⭐ Masterclass / Actividad Extra</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
      <div className="mitec-card" style={{ padding: '24px 28px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <FolderKanban style={{ color: '#0033a0', width: '22px', height: '22px' }} />
            <span style={{ color: '#0033a0', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Gestor Central de Proyectos Arte y Cultura
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 800 }}>Proyectos, Obras & Eventos Especiales</h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
            Crea proyectos semestrales (Compañías), eventos especiales (Día de Muertos, Noche Mexicana) y masterclasses. Asigna elencos y personajes de la base global de alumnos.
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('active')}
            className={activeTab === 'active' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem', padding: '10px 16px' }}
          >
            🚀 Activos ({activeProjects.length})
          </button>

          <button
            onClick={() => setActiveTab('archived')}
            className={activeTab === 'archived' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem', padding: '10px 16px' }}
          >
            📦 Archivados ({archivedProjects.length})
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={activeTab === 'create' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem', padding: '10px 16px', background: activeTab === 'create' ? '#ec4899' : undefined }}
          >
            <Plus style={{ width: '16px', height: '16px' }} /> Nuevo Proyecto
          </button>
        </div>
      </div>

      {/* CREATE NEW PROJECT FORM TAB */}
      {activeTab === 'create' && (
        <div className="mitec-card" style={{ padding: '28px', maxWidth: '680px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
            ➕ Crear Nuevo Proyecto o Evento Especial
          </h3>

          <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Nombre del Proyecto u Obra *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej. Espectáculo Día de Muertos 2026 / Ensamble WISHES"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Tipo de Proyecto *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ProjectType)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                >
                  <option value="SPECIAL_EVENT">🕯️ Evento Especial (Día de Muertos / Noche Mex)</option>
                  <option value="COMPANY_SEMESTER">🎭 Compañía Semestral (Ensamble / Baile)</option>
                  <option value="EXTRA_MASTERCLASS">⭐ Masterclass / Actividad Extra</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Campus Asignado
                </label>
                <input
                  type="text"
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Fecha de Inicio / Convocatoria
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Fecha de Presentación / Cierre
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Descripción / Sinopsis del Proyecto
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalles sobre el montaje, repertorio o logística del evento..."
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '12px', justifyContent: 'center', fontSize: '0.95rem', marginTop: '8px' }}>
              🚀 Guardar y Crear Proyecto
            </button>
          </form>
        </div>
      )}

      {/* PROJECTS LIST & DETAIL VIEW */}
      {activeTab !== 'create' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Left Column: Projects Selector List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              {activeTab === 'active' ? '🚀 Proyectos Activos' : '📦 Proyectos Archivados'}
            </h3>

            {(activeTab === 'active' ? activeProjects : archivedProjects).map((proj) => {
              const isSelected = selectedProject?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className="mitec-card"
                  style={{
                    padding: '16px 18px',
                    cursor: 'pointer',
                    borderLeft: isSelected ? '5px solid #0033a0' : '5px solid transparent',
                    background: isSelected ? '#f0f9ff' : '#ffffff',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    {getTypeBadge(proj.type)}
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                      {proj.characters.length} Personajes
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    {proj.name}
                  </h4>

                  <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar style={{ width: '14px', height: '14px' }} />
                    <span>{proj.startDate} al {proj.endDate}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Project Detail & Characters Manager */}
          {selectedProject ? (
            <div className="mitec-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Project Header Info */}
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    {getTypeBadge(selectedProject.type)}
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>
                      Director: {selectedProject.directorName}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                    {selectedProject.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                    {selectedProject.description || 'Sin descripción adicional.'}
                  </p>
                </div>

                {/* Archive Toggle Button */}
                <button
                  onClick={() => onArchiveProject(selectedProject.id)}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '8px 12px' }}
                >
                  <Archive style={{ width: '16px', height: '16px', color: '#d97706' }} />
                  {selectedProject.status === 'ACTIVE' ? 'Archivar Proyecto' : 'Reactivar Proyecto'}
                </button>
              </div>

              {/* Characters & Cast List Table */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users style={{ color: '#ec4899', width: '20px', height: '20px' }} />
                    Elenco & Personajes Asignados ({selectedProject.characters.length})
                  </h4>
                </div>

                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Personaje / Rol</th>
                      <th>Tipo de Rol</th>
                      <th>Alumno Asignado (Base Campus)</th>
                      <th>Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProject.characters.map((char) => (
                      <tr key={char.id}>
                        <td style={{ fontWeight: 700, color: '#0f172a' }}>{char.name}</td>
                        <td>
                          <span style={{ background: '#f1f5f9', color: '#0033a0', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                            {char.roleType}
                          </span>
                        </td>
                        <td style={{ color: '#0f172a', fontWeight: 700 }}>
                          {char.assignedStudentName ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0033a0' }}>
                              <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10b981' }} />
                              {char.assignedStudentName}
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Sin asignar</span>
                          )}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{char.notes || '-'}</td>
                      </tr>
                    ))}
                    {selectedProject.characters.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
                          Aún no hay personajes o solistas agregados a este proyecto.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add Character Form */}
              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserPlus style={{ width: '16px', height: '16px', color: '#0033a0' }} /> Agregar Personaje o Solista al Elenco
                </h4>

                <form onSubmit={handleAddCharacter} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Nombre del Personaje / Rol *
                    </label>
                    <input
                      type="text"
                      required
                      value={charName}
                      onChange={(e) => setCharName(e.target.value)}
                      placeholder="ej. La Catrina / Solo Violín 1"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Tipo de Rol
                    </label>
                    <select
                      value={roleType}
                      onChange={(e) => setRoleType(e.target.value as any)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    >
                      <option value="PRINCIPAL">Protagonista / Principal</option>
                      <option value="SOLO">Solista</option>
                      <option value="SECONDARY">Secundario</option>
                      <option value="ENSEMBLE">Ensamble</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Alumno de la Base Campus
                    </label>
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    >
                      <option value="">-- Seleccionar Alumno --</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.matricula}) - {s.section}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', alignItems: 'end' }}>
                    <input
                      type="text"
                      value={charNotes}
                      onChange={(e) => setCharNotes(e.target.value)}
                      placeholder="Notas adicionales (ej. Vestuario especial, solo improvisado...)"
                      style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                    <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                      <Plus style={{ width: '14px', height: '14px' }} /> Agregar Personaje
                    </button>
                  </div>
                </form>
              </div>

            </div>
          ) : (
            <div className="mitec-card" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
              Selecciona un proyecto de la lista para gestionar su elenco y personajes.
            </div>
          )}

        </div>
      )}

    </div>
  );
};
