import React, { useState } from 'react';
import { Users, Sparkles, Plus, CheckCircle, UserCheck, Star, Trash2, Palette, UserPlus, X, Award } from 'lucide-react';
import { StudentProfile, DisciplineType } from '../shared';

interface CastRole {
  id: string;
  characterName: string;
  roleCategory: 'PRINCIPAL' | 'CO_ESTELAR' | 'ENSAMBLE' | 'FOSO_MUSICAL' | 'STAFF';
  requiredDiscipline: DisciplineType;
  assignedStudentName?: string;
  assignmentType?: 'TITULAR' | 'UNDERSTUDY' | 'SWING';
}

interface ShowCast {
  id: string;
  companyName: string;
  showTitle: string;
  directorName: string;
  roles: CastRole[];
}

interface CastManagerProps {
  currentCompany: string;
  students: StudentProfile[];
  casts?: ShowCast[];
  onAddCastRole?: (showTitle: string, companyName: string, characterName: string, roleCategory: string, requiredDiscipline: string, studentName: string, assignmentType: string) => void;
  onDeleteCastRole?: (roleId: string) => void;
}

export const CastManager: React.FC<CastManagerProps> = ({
  currentCompany,
  students,
  casts = [],
  onAddCastRole,
  onDeleteCastRole,
}) => {
  // Filter active students for the current company
  const companyStudents = students.filter((s) => s.status === 'ACTIVE');

  // Filter or find the cast associated strictly with currentCompany
  const activeCast = casts.find((c) => c.companyName === currentCompany) || {
    id: `cast-${currentCompany.toLowerCase().replace(/\s+/g, '-')}`,
    companyName: currentCompany,
    showTitle: `Producción de ${currentCompany}`,
    directorName: 'Prof. Alejandro Gallegos',
    roles: casts.flatMap(c => c.roles),
  };

  // State for adding new Character to current company
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [characterName, setCharacterName] = useState('');
  const [roleCategory, setRoleCategory] = useState<'PRINCIPAL' | 'CO_ESTELAR' | 'ENSAMBLE' | 'FOSO_MUSICAL' | 'STAFF'>('PRINCIPAL');
  const [requiredDiscipline, setRequiredDiscipline] = useState<DisciplineType>('TEATRO_MUSICAL');

  // State for Assigning Student to Character Modal
  const [assigningRole, setAssigningRole] = useState<CastRole | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState(companyStudents[0]?.name || '');
  const [assignmentType, setAssignmentType] = useState<'TITULAR' | 'UNDERSTUDY' | 'SWING'>('TITULAR');

  const handleAddCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterName) return;

    if (onAddCastRole) {
      onAddCastRole(activeCast.showTitle, currentCompany, characterName, roleCategory, requiredDiscipline, '', 'TITULAR');
    }

    setCharacterName('');
    setShowRoleModal(false);
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningRole || !selectedStudentName) return;

    if (onAddCastRole) {
      onAddCastRole(activeCast.showTitle, currentCompany, assigningRole.characterName, assigningRole.roleCategory, assigningRole.requiredDiscipline, selectedStudentName, assignmentType);
    }

    setAssigningRole(null);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'PRINCIPAL':
        return <span className="badge badge-amber">⭐ ROL PRINCIPAL</span>;
      case 'CO_ESTELAR':
        return <span className="badge badge-purple">✨ CO-ESTELAR</span>;
      case 'ENSAMBLE':
        return <span className="badge badge-emerald">💃 ENSAMBLE / BAILE</span>;
      case 'FOSO_MUSICAL':
        return <span className="badge badge-purple">🎻 FOSO ORQUESTAL</span>;
      default:
        return <span className="badge badge-dark">🛠️ STAFF TÉCNICO</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner dynamically synced with currentCompany */}
      <div className="glass-panel" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Palette style={{ color: 'var(--primary)', width: '20px', height: '20px' }} />
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Compañía Activa: {currentCompany}
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Reparto & Asignación de Personajes</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Gestiona los personajes y asigna alumnos titulares o suplentes (Understudies) para la producción de <strong>{currentCompany}</strong>.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowRoleModal(true)}>
          <Plus style={{ width: '18px', height: '18px' }} /> + Crear Personaje en {currentCompany}
        </button>
      </div>

      {/* Main Reparto Table for currentCompany */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 700 }}>PRODUCCIÓN Y REPARTO OFICIAL</span>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', fontWeight: 800 }}>{activeCast.showTitle}</h3>
          </div>
          <span className="badge badge-purple" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
            🎭 {activeCast.roles.length} Personajes en Catálogo
          </span>
        </div>

        {activeCast.roles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
            <Sparkles style={{ width: '48px', height: '48px', color: 'var(--primary)', margin: '0 auto 12px auto', display: 'block' }} />
            <h3 style={{ color: 'var(--text-main)', marginBottom: '4px' }}>No hay personajes registrados en {currentCompany}</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>Crea el primer personaje de la obra (ej. Protagonista, Solista Canto, Capitán de Baile).</p>
            <button className="btn-primary" onClick={() => setShowRoleModal(true)} style={{ margin: '0 auto' }}>
              + Crear Personaje
            </button>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Personaje / Rol en Obra</th>
                <th>Categoría Artística</th>
                <th>Disciplina Requerida</th>
                <th>Alumno Asignado (Elenco)</th>
                <th>Rol Asignado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {activeCast.roles.map((r: CastRole) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>{r.characterName}</div>
                  </td>
                  <td>{getCategoryBadge(r.roleCategory)}</td>
                  <td>
                    <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>{r.requiredDiscipline}</span>
                  </td>
                  <td>
                    {r.assignedStudentName && r.assignedStudentName !== 'Alumno Asignado' ? (
                      <div style={{ fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <UserCheck style={{ width: '14px', height: '14px' }} /> {r.assignedStudentName}
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setAssigningRole(r);
                          setSelectedStudentName(companyStudents[0]?.name || '');
                        }}
                        style={{ background: 'rgba(217, 119, 6, 0.1)', border: '1px solid rgba(217, 119, 6, 0.3)', color: 'var(--accent-amber)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <UserPlus style={{ width: '12px', height: '12px' }} /> 👤 Asignar Alumno
                      </button>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${r.assignmentType === 'TITULAR' ? 'badge-emerald' : 'badge-amber'}`}>
                      {r.assignmentType || 'TITULAR'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar el personaje "${r.characterName}"?`) && onDeleteCastRole) {
                          onDeleteCastRole(r.id);
                        }
                      }}
                      style={{ background: 'rgba(225, 29, 72, 0.1)', border: '1px solid rgba(225, 29, 72, 0.3)', color: 'var(--accent-rose)', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}
                      title="Eliminar Personaje"
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal 1: Step 1 - Add Character to Catálogo */}
      {showRoleModal && (
        <div className="modal-backdrop">
          <form onSubmit={handleAddCharacter} className="glass-panel" style={{ width: '480px', padding: '28px', background: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus style={{ color: 'var(--primary)' }} /> Crear Personaje en {currentCompany}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Define un nuevo personaje o rol del catálogo para esta compañía.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nombre del Personaje / Rol</label>
                <input
                  type="text"
                  required
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="Ej: Protagonista (Elphaba), Glinda, Primer Violín"
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Categoría de Rol</label>
                  <select
                    value={roleCategory}
                    onChange={(e) => setRoleCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                  >
                    <option value="PRINCIPAL">⭐ Rol Principal / Protagonista</option>
                    <option value="CO_ESTELAR">✨ Co-Estelar / Secundario</option>
                    <option value="ENSAMBLE">💃 Ensamble / Cuerpo de Baile</option>
                    <option value="FOSO_MUSICAL">🎻 Foso Orquestal / Músico</option>
                    <option value="STAFF">🛠️ Staff Técnico / Tramoya</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Disciplina Requerida</label>
                  <select
                    value={requiredDiscipline}
                    onChange={(e) => setRequiredDiscipline(e.target.value as DisciplineType)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                  >
                    <option value="TEATRO_MUSICAL">🎭 Teatro Musical</option>
                    <option value="MUSICA">🎵 Música / Orquesta</option>
                    <option value="CANTO">🎤 Canto / Vocal</option>
                    <option value="BAILE">💃 Baile / Danza</option>
                    <option value="TEATRO">🎬 Teatro / Actuación</option>
                    <option value="STAFF">🛠️ Staff / Producción</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowRoleModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">
                  <CheckCircle style={{ width: '16px', height: '16px' }} /> Guardar Personaje
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Modal 2: Step 2 - Assign Student to Character */}
      {assigningRole && (
        <div className="modal-backdrop">
          <form onSubmit={handleSaveAssignment} className="glass-panel" style={{ width: '480px', padding: '28px', background: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck style={{ color: 'var(--primary)' }} /> Asignar Integrante a "{assigningRole.characterName}"
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Selecciona qué alumno de la compañía interpretará este papel.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Alumno Integrante de {currentCompany}</label>
                <select
                  value={selectedStudentName}
                  onChange={(e) => setSelectedStudentName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                >
                  {companyStudents.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.section})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tipo de Asignación</label>
                <select
                  value={assignmentType}
                  onChange={(e) => setAssignmentType(e.target.value as any)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                >
                  <option value="TITULAR">👑 Titular Principal</option>
                  <option value="UNDERSTUDY">🔄 Understudy (Suplente Rol Principal)</option>
                  <option value="SWING">🔀 Swing (Suplente Ensamble)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setAssigningRole(null)}>Cancelar</button>
                <button type="submit" className="btn-primary">
                  <CheckCircle style={{ width: '16px', height: '16px' }} /> Confirmar Asignación
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
