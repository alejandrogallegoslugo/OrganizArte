import React, { useState } from 'react';
import { Sparkles, Upload, FileText, CheckCircle2, Clock, Calendar, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { TimeSlot, parseScheduleImageWithGemini } from '../shared';
import { saveStudentScheduleCourseInNeon, clearStudentSchedulesInNeon } from '../api';

interface ScheduleUploadAIProps {
  currentSlots: TimeSlot[];
  onUpdateSlots: (newSlots: TimeSlot[]) => void;
  studentId?: string;
  studentMatricula?: string;
  studentEmail?: string;
}

export const ScheduleUploadAI: React.FC<ScheduleUploadAIProps> = ({
  currentSlots,
  onUpdateSlots,
  studentId,
  studentMatricula,
  studentEmail,
}) => {
  const [loading, setLoading] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState<'IDLE' | 'PENDING_VALIDATION' | 'APPROVED'>('IDLE');
  const [periodName, setPeriodName] = useState('Semestre Agosto - Diciembre 2026');
  const [validUntil, setValidUntil] = useState('2026-12-15');

  const userIdentifier = studentMatricula || studentEmail || studentId || '';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);

      // Read real uploaded file into Base64
      const reader = new FileReader();
      reader.onload = async () => {
        const realBase64 = reader.result as string;
        try {
          console.log('⚡ Procesando captura real de MiTec con Gemini Vision OCR...');
          const parsed = await parseScheduleImageWithGemini(realBase64);
          console.log('✅ Gemini Vision OCR Resultado:', parsed);

          if (parsed.courses && parsed.courses.length > 0) {
            const generatedSlots: TimeSlot[] = parsed.courses.map((c: any, index: number) => ({
              id: `slot-gemini-${index}-${Date.now()}`,
              day: (c.dayOfWeek || 'Lunes').toUpperCase(),
              startTime: c.startTime || '09:00',
              endTime: c.endTime || '11:00',
              courseName: c.name || 'Materia Tec',
              isAcademicClass: true,
            }));

            // REPLACEMENT POLICY: Clear ALL previous courses for this exact student in database
            if (userIdentifier) {
              await clearStudentSchedulesInNeon(userIdentifier);
              for (const c of parsed.courses) {
                await saveStudentScheduleCourseInNeon(
                  userIdentifier,
                  c.dayOfWeek || 'Lunes',
                  c.startTime || '09:00',
                  c.endTime || '11:00',
                  c.name || 'Materia Tec',
                  periodName,
                  validUntil
                );
              }
            }

            onUpdateSlots(generatedSlots);
            setScheduleStatus('PENDING_VALIDATION');
          }
        } catch (error) {
          console.error('Error procesando archivo:', error);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Schedule Validity Banner */}
      <div className="pwa-card" style={{ borderLeft: '4px solid var(--accent-amber)', background: 'rgba(217, 119, 6, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock style={{ width: '16px', height: '16px' }} /> Vigencia del Horario Cargado
          </span>
          <span style={{ fontSize: '0.7rem', background: 'rgba(217, 119, 6, 0.2)', color: 'var(--accent-amber)', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
            VIGENTE
          </span>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>
          {periodName}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Válido en la plataforma hasta el: <strong>{validUntil}</strong> (6 meses por semestre). Al cargar un nuevo horario, las materias anteriores serán reemplazadas automáticamente.
        </p>
      </div>

      {/* Main Upload Card */}
      <div className="pwa-card" style={{ textAlign: 'center', padding: '28px 20px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          boxShadow: '0 6px 20px var(--primary-glow)'
        }}>
          <Sparkles style={{ color: '#fff', width: '28px', height: '28px' }} />
        </div>

        <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '6px' }}>
          Escáner de Horarios MiTec con IA
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '20px' }}>
          Sube tu captura de pantalla o PDF de clases de MiTec. La Inteligencia Artificial extraerá únicamente tus materias y las <strong>guardará en tu perfil para la matriz de disponibilidad del Director</strong>.
        </p>

        {/* Custom Upload Drop Area */}
        <label style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '24px',
          border: '2px dashed var(--primary)',
          borderRadius: '16px',
          background: 'var(--bg-dark)',
          cursor: 'pointer',
          marginBottom: '16px'
        }}>
          <Upload style={{ width: '32px', height: '32px', color: 'var(--primary)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {loading ? 'Procesando captura de MiTec...' : 'Seleccionar Imagen o PDF de MiTec'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Soporta PNG, JPG, PDF (Máx. 10MB)</span>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            disabled={loading}
            style={{ display: 'none' }}
          />
        </label>

        {scheduleStatus === 'PENDING_VALIDATION' && (
          <div style={{ background: 'rgba(217, 119, 6, 0.1)', border: '1px solid rgba(217, 119, 6, 0.3)', padding: '14px', borderRadius: '12px', color: 'var(--accent-amber)', fontSize: '0.85rem', textAlign: 'left' }}>
            <div style={{ fontWeight: 800, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock style={{ width: '18px', height: '18px' }} /> ⏳ Horario Guardado — Pendiente de Validación por el Director
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Tus materias de MiTec han sido leídas y sincronizadas. Tu disponibilidad en la matriz del Director se ha actualizado.
            </div>
          </div>
        )}
      </div>

      {/* Current Parsed Slots Grid */}
      <div className="pwa-card">
        <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText style={{ color: 'var(--primary)', width: '18px', height: '18px' }} /> Mis Clases Extraídas por IA ({currentSlots.length})
        </h3>

        {currentSlots.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            Aún no has subido tu horario de MiTec. Sube tu captura arriba para ver tus materias aquí.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentSlots.map((slot) => (
              <div
                key={slot.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.85rem' }}>{slot.courseName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{slot.day}</div>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(2, 132, 199, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>
                  ⏰ {slot.startTime} - {slot.endTime}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULL-SCREEN PROCESSING MODAL - PREVENTS LEAVING THE SCREEN */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--primary)',
            borderRadius: '24px',
            padding: '36px 28px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(2, 132, 199, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              position: 'relative',
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px var(--primary-glow)'
            }}>
              <Loader2 style={{ width: '36px', height: '36px', color: '#fff', animation: 'spin 1.5s linear infinite' }} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 800, marginBottom: '6px' }}>
                Procesando Horario con IA...
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '10px' }}>
                ⚡ Por favor no cierres ni abandones esta ventana
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                La Inteligencia Artificial está analizando la imagen de tu comprobante de MiTec para extraer tus materias, días de la semana y bloques de horas.
              </p>
            </div>

            <div style={{ background: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(2, 132, 199, 0.3)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.75rem', color: '#38bdf8', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Sparkles style={{ width: '14px', height: '14px' }} /> Leyendo clases y sustituyendo horario anterior...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
