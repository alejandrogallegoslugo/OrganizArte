import React, { useState } from 'react';
import { Building, Plus, CheckCircle, ShieldCheck, MapPin } from 'lucide-react';

interface CampusManagerProps {
  campuses: { id: string; name: string; city: string; state: string; isActive: boolean }[];
  onAddCampus: (name: string, city: string, state: string) => void;
}

export const CampusManager: React.FC<CampusManagerProps> = ({
  campuses,
  onAddCampus,
}) => {
  const [showCampusModal, setShowCampusModal] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const handleCampusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCampus(name, city, state);
    setName('');
    setCity('');
    setState('');
    setShowCampusModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Super Admin Header */}
      <div className="glass-panel" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <ShieldCheck style={{ color: 'var(--accent-amber)', width: '20px', height: '20px' }} />
            <span style={{ color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Configuración Global Super Admin
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Gestión de Campuses del Tec de Monterrey</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Habilita y administra los diferentes planteles universitarios registrados en la plataforma.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowCampusModal(true)}>
          <Building style={{ width: '18px', height: '18px' }} /> + Registrar Nuevo Campus Tec
        </button>
      </div>

      {/* Campuses Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building style={{ color: 'var(--accent-amber)', width: '20px', height: '20px' }} /> Campuses Tec Habilitados ({campuses.length})
        </h3>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Campus Tec</th>
              <th>Ciudad / Estado</th>
              <th>Estado Sistema</th>
            </tr>
          </thead>
          <tbody>
            {campuses.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin style={{ width: '14px', height: '14px', color: 'var(--accent-amber)' }} /> {c.name}
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{c.city}, {c.state}</td>
                <td>
                  <span className="badge badge-emerald">ACTIVO Y PRINCIPAL</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Campus Modal */}
      {showCampusModal && (
        <div className="modal-backdrop">
          <form onSubmit={handleCampusSubmit} className="glass-panel" style={{ width: '450px', padding: '28px', background: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building style={{ color: 'var(--accent-amber)' }} /> Registrar Nuevo Campus Tec
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Añade un campus del Tecnológico de Monterrey a la plataforma global.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nombre del Campus</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Tec Campus Monterrey"
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Ciudad</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Monterrey"
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Estado</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Nuevo León"
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCampusModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">
                  <CheckCircle style={{ width: '16px', height: '16px' }} /> Habilitar Campus
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
