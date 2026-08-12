import React, { useState } from 'react';
import { Sparkles, Upload, FileText, CheckCircle2, Clock, Calendar, ShieldCheck, AlertCircle, Loader2, Plus, CheckSquare, Square } from 'lucide-react';
import { TimeSlot, parseScheduleImageWithGemini } from '../shared';
import { saveStudentScheduleCourseInNeon, clearStudentSchedulesInNeon } from '../api';

interface ScheduleUploadAIProps {
  currentSlots: TimeSlot[];
  onUpdateSlots: (newSlots: TimeSlot[]) => void;
  studentId?: string;
  studentMatricula?: string;
  studentEmail?: string;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

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

  // Manual Bulk Multi-day Modal State
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkCourseName, setBulkCourseName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Lunes']);
  const [bulkStartTime, setBulkStartTime] = useState('09:00');
  const [bulkEndTime, setBulkEndTime] = useState('11:00');

  const userIdentifier = studentMatricula || studentEmail || studentId || '';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);

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

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const selectAllWeekdays = () => {
    setSelectedDays(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']);
  };

  const handleSaveBulkSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkCourseName || !userIdentifier) return;

    const newGeneratedSlots: TimeSlot[] = [];

    for (const d of selectedDays) {
      await saveStudentScheduleCourseInNeon(
        userIdentifier,
        d,
        bulkStartTime,
        bulkEndTime,
        bulkCourseName,
        periodName,
        validUntil
      );

      newGeneratedSlots.push({
        id: `slot-bulk-${d}-${Date.now()}`,
        day: d.toUpperCase(),
        startTime: bulkStartTime,
        endTime: bulkEndTime,
        courseName: bulkCourseName,
        isAcademicClass: true,
      });
    }

    onUpdateSlots([...currentSlots, ...newGeneratedSlots]);
    setShowBulkModal(false);
    setBulkCourseName('');
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

      {/* Main Upload & Bulk Action Card */}
      <div className="pwa-card" style={{ textAlign: 'center', padding: '24px 20px' }}>
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
          Horario Académico & Bloqueos
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '16px' }}>
          Sube tu captura de pantalla de MiTec con IA o agrega bloqueos recurrentes masivos (ej. <i>No puedo de Lunes a Viernes de 14:00 a 16:00 hs</i>).
        </p>

        {/* Action Buttons: IA Upload vs Bulk Multi-day */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            borderRadius: '12px',
            background: 'var(--primary)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
          }}>
            <Upload style={{ width: '18px', height: '18px' }} />
            <span>Escanear con IA</span>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              disabled={loading}
              style={{ display: 'none' }}
            />
          </label>

          <button
            onClick={() => setShowBulkModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: '12px',
              background: '#e0f2fe',
              color: '#0369a1',
              border: '1px solid #bae6fd',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <Plus style={{ width: '18px', height: '18px' }} />
            <span>Bloqueo Masivo</span>
          </button>
        </div>

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText style={{ color: 'var(--primary)', width: '18px', height: '18px' }} /> Mis Clases & Bloqueos ({currentSlots.length})
          </h3>

          <button
            onClick={() => setShowBulkModal(true)}
            style={{ fontSize: '0.75rem', color: '#0033a0', background: '#e0f2fe', border: 'none', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}
          >
            + Cargar Bloqueo
          </button>
        </div>

        {currentSlots.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            Aún no has subido tu horario de MiTec ni agregado bloqueos. Sube tu captura o agrega un bloqueo arriba.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentSlots.map((slot, idx) => (
              <div
                key={slot.id || `slot-${idx}`}
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
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.85rem' }}>📖 {slot.courseName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <span style={{ fontWeight: 800, color: '#ec4899' }}>{slot.day}</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(2, 132, 199, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>
                  ⏰ {slot.startTime} - {slot.endTime}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Student Bulk Multi-day Blocking Modal */}
      {showBulkModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', maxWidth: '420px', width: '100%', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              ⚡ Cargar Bloqueo Masivo Multidías
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '16px' }}>
              Selecciona varios días a la vez para bloquear el mismo horario (ej. Trabajo, entrenamiento, etc.)
            </p>

            <form onSubmit={handleSaveBulkSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Motivo del Bloqueo o Nombre de Clase
                </label>
                <input
                  type="text"
                  value={bulkCourseName}
                  onChange={(e) => setBulkCourseName(e.target.value)}
                  placeholder="Ej. Trabajo, Entrenamiento, Compromiso fijo"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              {/* Multi-day Selection */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                    Días a Bloquear
                  </label>
                  <button
                    type="button"
                    onClick={selectAllWeekdays}
                    style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                  >
                    ⚡ Lunes a Viernes
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {DAYS.map((d) => {
                    const isSelected = selectedDays.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDay(d)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid #0033a0' : '1px solid #cbd5e1',
                          background: isSelected ? '#e0f2fe' : '#f8fafc',
                          color: isSelected ? '#0033a0' : '#475569',
                          fontWeight: isSelected ? 800 : 500,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {isSelected ? <CheckSquare style={{ width: 14, height: 14 }} /> : <Square style={{ width: 14, height: 14 }} />}
                        <span>{d}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    value={bulkStartTime}
                    onChange={(e) => setBulkStartTime(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    value={bulkEndTime}
                    onChange={(e) => setBulkEndTime(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Period & Expiration */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Vigencia Hasta
                  </label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Periodo
                  </label>
                  <input
                    type="text"
                    value={periodName}
                    onChange={(e) => setPeriodName(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Guardar Bloqueo ({selectedDays.length} Días)
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowBulkModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL-SCREEN PROCESSING MODAL */}
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
