import React, { useState } from 'react';
import { Music, Plus, FileText, Play, CheckCircle, Disc } from 'lucide-react';
import { Song } from '../shared';

interface SongLibraryProps {
  songs: Song[];
  companyName: string;
  onAddSong: (newSong: Song) => void;
}

export const SongLibrary: React.FC<SongLibraryProps> = ({ songs, companyName, onAddSong }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [composer, setComposer] = useState('');
  const [genre, setGenre] = useState('Sinfónico');
  const [key, setKey] = useState('C Mayor');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSong: Song = {
      id: `song-${Date.now()}`,
      title,
      composer,
      companyName,
      genre,
      key,
      durationSeconds: 300,
      sheets: [
        { id: `sh-${Date.now()}-1`, instrumentOrVoice: 'Partitura General', pdfUrl: 'https://pdfobject.com/pdf/sample.pdf' },
      ],
      guides: [
        { id: `g-${Date.now()}-1`, title: 'Audio Guía Maqueta (Tutti)', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', bpm: 120 },
      ],
      createdAt: new Date().toISOString().split('T')[0],
    };
    onAddSong(newSong);
    setShowModal(false);
    setTitle('');
    setComposer('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Music style={{ color: 'var(--primary)', width: '20px', height: '20px' }} />
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Repertorio Musical
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Repositorio de Partituras y Guías de Audio</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Sube las partituras en PDF por instrumento y las guías de estudio interactivas para tus alumnos.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus style={{ width: '18px', height: '18px' }} /> Agregar Obra al Repertorio
        </button>
      </div>

      {/* Grid of Songs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {songs.map((song) => (
          <div key={song.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="badge badge-purple">{song.genre}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                Tono: {song.key}
              </span>
            </div>

            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{song.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Compositor / Arreglo: <strong>{song.composer}</strong></p>

            <div style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText style={{ width: '14px', height: '14px' }} /> Partituras PDF ({song.sheets.length})
              </div>
              {song.sheets.map((s) => (
                <div key={s.id} style={{ fontSize: '0.75rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>📄 {s.instrumentOrVoice}</span>
                  <a href={s.pdfUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 700 }}>Descargar</a>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Play style={{ width: '14px', height: '14px' }} /> Guía de Audio Reproducible ({song.guides.length})
              </div>
              {song.guides.map((g) => (
                <div key={g.id} style={{ fontSize: '0.75rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>🎧 {g.title}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{g.bpm} BPM</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Song */}
      {showModal && (
        <div className="modal-backdrop">
          <form onSubmit={handleSubmit} className="glass-panel" style={{ width: '480px', padding: '28px', background: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Music style={{ color: 'var(--primary)' }} /> Nueva Obra en Repertorio
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Título de la Obra</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Huapango de Moncayo"
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Compositor / Arreglista</label>
                <input
                  type="text"
                  required
                  value={composer}
                  onChange={(e) => setComposer(e.target.value)}
                  placeholder="José Pablo Moncayo"
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Género Estilo</label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="Sinfónico Fusión"
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tonalidad</label>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="C Mayor"
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">
                  <CheckCircle style={{ width: '16px', height: '16px' }} /> Guardar Obra
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
