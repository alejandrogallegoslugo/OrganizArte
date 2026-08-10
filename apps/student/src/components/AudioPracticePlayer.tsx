import React, { useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Zap, Disc, KeyRound, FileText } from 'lucide-react';
import { Song, AudioGuide } from '../shared';

interface AudioPracticePlayerProps {
  songs: Song[];
}

export const AudioPracticePlayer: React.FC<AudioPracticePlayerProps> = ({ songs }) => {
  const [selectedSong, setSelectedSong] = useState<Song>(songs[0]);
  const [selectedGuide, setSelectedGuide] = useState<AudioGuide>(songs[0]?.guides[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    setSelectedGuide(song.guides[0]);
    setIsPlaying(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#f8fafc', fontWeight: 800 }}>Mis Materiales & Partituras</h2>
        <span className="badge badge-purple">{songs.length} Obras</span>
      </div>

      {/* Song Selector Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {songs.map((song) => (
          <button
            key={song.id}
            onClick={() => handleSelectSong(song)}
            style={{
              padding: '8px 14px',
              borderRadius: '999px',
              border: selectedSong.id === song.id ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
              background: selectedSong.id === song.id ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)',
              color: selectedSong.id === song.id ? '#38bdf8' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.8rem',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            🎵 {song.title}
          </button>
        ))}
      </div>

      {/* Interactive Audio Player Card */}
      {selectedSong && (
        <div className="pwa-card" style={{ background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="badge badge-active">{selectedSong.genre}</span>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>Tonalidad: {selectedSong.key}</span>
          </div>

          <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 800 }}>{selectedSong.title}</h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '16px' }}>Compositor: {selectedSong.composer}</p>

          {/* Guide Track Picker */}
          {selectedSong.guides.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Seleccionar Pista de Audio Guía:</label>
              <select
                value={selectedGuide?.id}
                onChange={(e) => {
                  const g = selectedSong.guides.find((x) => x.id === e.target.value);
                  if (g) setSelectedGuide(g);
                }}
                style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
              >
                {selectedSong.guides.map((g) => (
                  <option key={g.id} value={g.id} style={{ background: '#0f172a' }}>{g.title} {g.bpm ? `(${g.bpm} BPM)` : ''}</option>
                ))}
              </select>
            </div>
          )}

          {/* Player Controls */}
          {selectedGuide && (
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <audio ref={audioRef} src={selectedGuide.audioUrl} loop={isLooping} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={() => setIsLooping(!isLooping)}
                  style={{
                    background: isLooping ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
                    border: 'none',
                    color: isLooping ? '#a78bfa' : '#64748b',
                    padding: '8px',
                    borderRadius: '50%',
                    cursor: 'pointer'
                  }}
                  title="Loopear Sección"
                >
                  <RotateCcw style={{ width: '20px', height: '20px' }} />
                </button>

                <button
                  onClick={togglePlay}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                    border: 'none',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(56, 189, 248, 0.5)'
                  }}
                >
                  {isPlaying ? <Pause style={{ width: '24px', height: '24px' }} /> : <Play style={{ width: '24px', height: '24px', marginLeft: '3px' }} />}
                </button>

                <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                  {playbackSpeed}x Velocidad
                </div>
              </div>

              {/* Speed Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                {[0.5, 0.75, 1.0, 1.25].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => handleSpeedChange(spd)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: playbackSpeed === spd ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                      background: playbackSpeed === spd ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                      color: playbackSpeed === spd ? '#38bdf8' : '#94a3b8',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Partituras PDF list */}
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>Partituras de mi Sección:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedSong.sheets.map((sh) => (
                <a
                  key={sh.id}
                  href={sh.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#38bdf8',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText style={{ width: '16px', height: '16px', color: '#f59e0b' }} /> {sh.instrumentOrVoice}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Abrir PDF 📄</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
