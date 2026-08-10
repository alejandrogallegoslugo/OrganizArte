import React, { useState } from 'react';
import { UserPlus, Sparkles, Upload, Calendar, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { StudentProfile, DisciplineType, parseScheduleImageWithGemini } from '../shared';

interface AdminCreateStudentModalProps {
  onClose: () => void;
  onSaveStudent: (newStudent: StudentProfile, parsedCourses: any[], validityPeriod: string, validUntil: string) => void;
}

export const AdminCreateStudentModal: React.FC<AdminCreateStudentModalProps> = ({
  onClose,
  onSaveStudent,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [matricula, setMatricula] = useState('');
  const [companyName, setCompanyName] = useState('Ensamble Musical Tec');
  const [discipline, setDiscipline] = useState<DisciplineType>('TEATRO_MUSICAL');
  const [section, setSection] = useState('Cantante / Actor');

  // Validity Period (Vigencia del Horario)
  const [periodName, setPeriodName] = useState('Semestre Agosto - Diciembre 2026');
  const [validUntil, setValidUntil] = useState('2026-12-15');

  // Gemini OCR Schedule State
  const [ocrLoading, setOcrLoading] = useState(false);
  const [parsedCourses, setParsedCourses] = useState<any[]>([]);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      setOcrLoading(true);

      const reader = new FileReader();
      reader.onload = async () => {
        const realBase64 = reader.result as string;
        try {
          const result = await parseScheduleImageWithGemini(realBase64);
          setParsedCourses(result.courses || []);
          if (result.studentMatricula && !matricula) {
            setMatricula(result.studentMatricula);
          }
        } catch (err) {
          console.error('Error procesando horario real con Inteligencia Artificial:', err);
        } finally {
          setOcrLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: StudentProfile = {
      id: `std-${Date.now()}`,
      name,
      email,
      matricula: matricula.toUpperCase(),
      campus: 'Tec Campus Laguna (Torreón)',
      role: 'STUDENT',
      status: 'ACTIVE',
      companyName,
      discipline,
      section,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSaveStudent(newStudent, parsedCourses, periodName, validUntil);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <form onSubmit={handleSubmit} className="glass-panel" style={{ width: '560px', padding: '28px', background: 'var(--bg-card)', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <UserPlus style={{ width: '22px', height: '22px' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800 }}>Alta Directa de Integrante + Horario IA</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Registra al alumno y procesa su captura de MiTec con Inteligencia Artificial
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Personal Info */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nombre Completo del Alumno</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Sofía Garza Cantú"
              style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Matrícula Tec</label>
              <input
                type="text"
                required
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                placeholder="A01708821"
                style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sofia.garza@tec.mx"
                style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Compañía / Elenco</label>
              <select
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
              >
                <option value="Teatro Musical Wishes 2026">Teatro Musical Wishes 2026</option>
                <option value="Ensamble Musical Tec">Ensamble Musical Tec</option>
                <option value="Comedia Musical 2026">Comedia Musical 2026</option>
                <option value="Grupo de Baile Urbano">Grupo de Baile Urbano</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Enfoque / Disciplina</label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as DisciplineType)}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
              >
                <option value="TEATRO_MUSICAL">🎭 Teatro Musical (Multidisciplinar)</option>
                <option value="MUSICA">🎵 Música / Orquesta</option>
                <option value="CANTO">🎤 Canto / Vocal</option>
                <option value="BAILE">💃 Baile / Danza</option>
                <option value="TEATRO">🎬 Teatro / Actuación</option>
                <option value="STAFF">🛠️ Staff / Producción</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Instrumento / Rol Específico</label>
            <input
              type="text"
              required
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="Ej: Cantante Principal, Bailarín Solista, Saxofón, Tramoya"
              style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
            />
          </div>

          {/* Schedule Upload with Gemini OCR */}
          <div style={{ background: 'rgba(2, 132, 199, 0.06)', border: '1px dashed var(--primary)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles style={{ width: '16px', height: '16px' }} /> Cargar Horario MiTec con Inteligencia Artificial
              </span>
              {ocrLoading && <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 700 }}>Procesando imagen con IA...</span>}
            </div>

            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}
            />

            {parsedCourses.length > 0 && (
              <div style={{ marginTop: '10px', background: 'var(--bg-card)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700, marginBottom: '4px' }}>
                  ✅ {parsedCourses.length} Clases procesadas con Inteligencia Artificial:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {parsedCourses.map((c, i) => (
                    <span key={i} style={{ fontSize: '0.7rem', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-main)' }}>
                      {c.name} ({c.dayOfWeek} {c.startTime}-{c.endTime})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Schedule Validity Section (Vigencia del Horario) */}
          <div style={{ background: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.25)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock style={{ width: '16px', height: '16px' }} /> Vigencia del Horario Académico
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Periodo / Semestre</label>
                <select
                  value={periodName}
                  onChange={(e) => setPeriodName(e.target.value)}
                  style={{ width: '100%', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.8rem' }}
                >
                  <option value="Semestre Agosto - Diciembre 2026">Agosto - Diciembre 2026</option>
                  <option value="Semestre Enero - Mayo 2027">Enero - Mayo 2027</option>
                  <option value="Periodo Verano 2027">Verano 2027</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Fecha de Vencimiento</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  style={{ width: '100%', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.8rem' }}
                />
              </div>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              * Al llegar la fecha limite, el sistema le pedirá al alumno subir su nuevo horario para el siguiente semestre.
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">
              <CheckCircle style={{ width: '16px', height: '16px' }} /> Guardar Integrante y Horario IA
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
