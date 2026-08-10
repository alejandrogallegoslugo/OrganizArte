import React, { useState } from 'react';
import { Palette, Plus, Edit2, Trash2, CheckCircle, Sparkles, MapPin } from 'lucide-react';
import { DisciplineType } from '../shared';

interface CompanyItem {
  id: string;
  name: string;
  discipline: string;
  emoji: string;
  campusName?: string;
}

interface CompanyManagerProps {
  currentCampus: string;
  companies: CompanyItem[];
  onAddCompany: (name: string, discipline: string, emoji: string) => void;
  onUpdateCompany: (id: string, name: string, discipline: string, emoji: string) => void;
  onDeleteCompany: (id: string) => void;
}

export const CompanyManager: React.FC<CompanyManagerProps> = ({
  currentCampus,
  companies,
  onAddCompany,
  onUpdateCompany,
  onDeleteCompany,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyItem | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [companyDiscipline, setCompanyDiscipline] = useState<DisciplineType>('TEATRO_MUSICAL');
  const [companyEmoji, setCompanyEmoji] = useState('🎭');

  const handleOpenCreate = () => {
    setEditingCompany(null);
    setCompanyName('');
    setCompanyDiscipline('TEATRO_MUSICAL');
    setCompanyEmoji('🎭');
    setShowModal(true);
  };

  const handleOpenEdit = (c: CompanyItem) => {
    setEditingCompany(c);
    setCompanyName(c.name);
    setCompanyDiscipline(c.discipline as DisciplineType);
    setCompanyEmoji(c.emoji);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName) return;

    if (editingCompany) {
      onUpdateCompany(editingCompany.id, companyName, companyDiscipline, companyEmoji);
    } else {
      onAddCompany(companyName, companyDiscipline, companyEmoji);
    }

    setCompanyName('');
    setShowModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Palette style={{ color: 'var(--primary)', width: '20px', height: '20px' }} />
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Elencos Artísticos de {currentCampus}
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Gestión de Compañías & Agrupaciones</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Crea, edita y organiza los elencos (Teatro Musical, Ensamble, Baile) exclusivos para tu campus.
          </p>
        </div>

        <button className="btn-primary" onClick={handleOpenCreate}>
          <Plus style={{ width: '18px', height: '18px' }} /> + Nueva Compañía o Elenco
        </button>
      </div>

      {/* Grid of Companies */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles style={{ color: 'var(--primary)' }} /> Elencos Registrados ({companies.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin style={{ width: '14px', height: '14px' }} /> Aislando para: {currentCampus}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {companies.map((c) => (
            <div
              key={c.id}
              style={{
                background: 'var(--bg-dark)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ fontSize: '2rem', background: 'rgba(2, 132, 199, 0.1)', width: '52px', height: '52px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {c.emoji}
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: '1rem' }}>{c.name}</h4>
                  <span className="badge badge-purple" style={{ marginTop: '4px', display: 'inline-block', fontSize: '0.75rem' }}>
                    {c.discipline === 'TEATRO_MUSICAL' ? '🎭 TEATRO MUSICAL (MULTIDISCIPLINAR)' : c.discipline}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => handleOpenEdit(c)}
                  style={{ background: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(2, 132, 199, 0.3)', color: 'var(--primary)', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700 }}
                  title="Editar"
                >
                  <Edit2 style={{ width: '12px', height: '12px' }} /> Editar
                </button>
                <button
                  onClick={() => {
                    if (confirm(`¿Borrar el elenco "${c.name}"?`)) onDeleteCompany(c.id);
                  }}
                  style={{ background: 'rgba(225, 29, 72, 0.1)', border: '1px solid rgba(225, 29, 72, 0.3)', color: 'var(--accent-rose)', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700 }}
                  title="Borrar"
                >
                  <Trash2 style={{ width: '12px', height: '12px' }} /> Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <form onSubmit={handleSubmit} className="glass-panel" style={{ width: '500px', padding: '28px', background: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette style={{ color: 'var(--primary)' }} /> {editingCompany ? 'Editar Elenco Artístico' : 'Nuevo Elenco Artístico'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Se asignará automáticamente al campus <strong>{currentCampus}</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nombre del Elenco / Compañía</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ej: Teatro Musical Wishes 2026"
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Enfoque / Disciplina</label>
                  <select
                    value={companyDiscipline}
                    onChange={(e) => setCompanyDiscipline(e.target.value as DisciplineType)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                  >
                    <option value="TEATRO_MUSICAL">🎭 Teatro Musical (Multidisciplinario)</option>
                    <option value="MUSICA">🎵 Música / Orquesta / Bandas</option>
                    <option value="CANTO">🎤 Canto / Coral / Vocales</option>
                    <option value="BAILE">💃 Baile / Danza / Ballets</option>
                    <option value="TEATRO">🎬 Teatro / Actuación Drama</option>
                    <option value="STAFF">🛠️ Staff / Producción Técnica</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Emoji</label>
                  <input
                    type="text"
                    required
                    value={companyEmoji}
                    onChange={(e) => setCompanyEmoji(e.target.value)}
                    placeholder="🎭"
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', textAlign: 'center' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">
                  <CheckCircle style={{ width: '16px', height: '16px' }} /> {editingCompany ? 'Guardar Cambios' : 'Crear Elenco'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
