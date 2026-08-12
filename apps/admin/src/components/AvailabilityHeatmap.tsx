import React, { useState } from 'react';
import { CalendarClock, Sparkles, Upload, FileText, CheckCircle2, Clock, Eye, AlertCircle, UserCheck, Plus, Edit2, Trash2, BookOpen, Calendar, Save, ShieldAlert, CheckCircle, Filter, CheckSquare, Square, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { StudentProfile, StudentSchedule, parseScheduleImageWithGemini } from '../shared';

interface AvailabilityHeatmapProps {
  students: StudentProfile[];
  schedules: StudentSchedule[];
  onUploadStudentSchedule?: (studentId: string, courses: any[]) => void;
  onSaveScheduleCourse?: (studentId: string, dayOfWeek: string, startTime: string, endTime: string, courseName: string, periodName?: string, validUntil?: string) => void;
  onDeleteScheduleCourse?: (scheduleId: string) => void;
  onClearStudentSchedules?: (studentId: string) => void;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const HOURLY_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00'
];

const HALF_HOURLY_SLOTS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00'
];

export const AvailabilityHeatmap: React.FC<AvailabilityHeatmapProps> = ({
  students,
  schedules,
  onUploadStudentSchedule,
  onSaveScheduleCourse,
  onDeleteScheduleCourse,
  onClearStudentSchedules,
}) => {
  const activeStudents = students.filter((s) => s.status === 'ACTIVE');
  
  // Default selected student ID dynamically matching active student in DB
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    return activeStudents[0]?.id || '';
  });

  // Time Granularity State: 1 Hour vs 30 Minutes
  const [timeGranularity, setTimeGranularity] = useState<'HOURLY' | 'HALF_HOURLY'>('HOURLY');

  // Director Validation State (persisted in localStorage so approving hides it permanently)
  const [isScheduleApproved, setIsScheduleApproved] = useState<boolean>(() => {
    return localStorage.getItem('organizarte_schedule_approved') === 'true';
  });

  // View Mode: 'heatmap' vs 'inspector'
  const [activeSubTab, setActiveSubTab] = useState<'heatmap' | 'inspector'>('heatmap');
  
  // Real File Upload & Gemini OCR State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any | null>(null);

  // Add / Edit Manual Course Modal State
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<StudentSchedule | null>(null);
  const [courseName, setCourseName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Lunes']);
  const [courseStartTime, setCourseStartTime] = useState('09:00');
  const [courseEndTime, setCourseEndTime] = useState('11:00');
  const [periodName, setPeriodName] = useState('Semestre Agosto - Diciembre 2026');
  const [validUntil, setValidUntil] = useState('2026-12-15');

  // Selected Student Object (Strict match)
  const selectedStudentObj = activeStudents.find((s) => s.id === selectedStudentId) || activeStudents[0];

  // Strictly filter schedules for selected student only by permanent DB UUID
  const currentStudentSchedules = schedules.filter((sch) => {
    if (!selectedStudentObj) return false;
    return sch.studentId === selectedStudentObj.id;
  });

  const activeTimeSlots = timeGranularity === 'HOURLY' ? HOURLY_SLOTS : HALF_HOURLY_SLOTS;

  const handleApproveScheduleValidation = () => {
    setIsScheduleApproved(true);
    localStorage.setItem('organizarte_schedule_approved', 'true');
  };

  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setCourseName('');
    setSelectedDays(['Lunes']);
    setCourseStartTime('09:00');
    setCourseEndTime('11:00');
    setPeriodName('Semestre Agosto - Diciembre 2026');
    setValidUntil('2026-12-15');
    setShowCourseModal(true);
  };

  const handleOpenEditCourse = (course: StudentSchedule) => {
    setEditingCourse(course);
    setCourseName(course.courseName);
    setSelectedDays([course.dayOfWeek]);
    setCourseStartTime(course.startTime);
    setCourseEndTime(course.endTime);
    setPeriodName(course.periodName || 'Semestre Agosto - Diciembre 2026');
    setValidUntil(course.validUntil || '2026-12-15');
    setShowCourseModal(true);
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

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName || !selectedStudentObj) return;

    if (onSaveScheduleCourse) {
      if (editingCourse) {
        // Delete previous course row if editing
        if (onDeleteScheduleCourse) {
          await onDeleteScheduleCourse(editingCourse.id);
        }
      }
      // Loop over all selected days for bulk or single creation
      for (const day of selectedDays) {
        await onSaveScheduleCourse(selectedStudentObj.id, day, courseStartTime, courseEndTime, courseName, periodName, validUntil);
      }
    }

    setShowCourseModal(false);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('¿Eliminar esta materia del horario?') && onDeleteScheduleCourse) {
      await onDeleteScheduleCourse(courseId);
    }
  };

  const [heatmapDisciplineFilter, setHeatmapDisciplineFilter] = useState<string>('ALL');

  const filteredHeatmapStudents = activeStudents.filter(
    (s) => heatmapDisciplineFilter === 'ALL' || s.discipline === heatmapDisciplineFilter
  );

  const calculateAvailability = (day: string, time: string) => {
    const total = filteredHeatmapStudents.length || 1;
    // Find unique students who have a class at this day and time slot
    const busyStudentIds = new Set(
      schedules.filter((s) => {
        const matchingStudent = filteredHeatmapStudents.find(
          (st) => st.id === s.studentId
        );
        if (!matchingStudent) return false;

        const sStart = s.startTime.substring(0, 5);
        const sEnd = s.endTime.substring(0, 5);
        return s.dayOfWeek.toUpperCase() === day.toUpperCase() && sStart <= time && sEnd > time;
      }).map((s) => s.studentId)
    );

    const occupied = busyStudentIds.size;
    const available = Math.max(0, total - occupied);
    const percentage = Math.round((available / total) * 100);
    return { available, total, percentage };
  };

  const getHeatmapColor = (percentage: number) => {
    if (percentage >= 80) return 'rgba(5, 150, 105, 0.2)';
    if (percentage >= 50) return 'rgba(217, 119, 6, 0.2)';
    return 'rgba(225, 29, 72, 0.2)';
  };

  const getTextColor = (percentage: number) => {
    if (percentage >= 80) return '#059669';
    if (percentage >= 50) return '#d97706';
    return '#e11d48';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Banner Header */}
      <div className="mitec-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0033a0 0%, #001a5e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <CalendarClock style={{ width: '24px', height: '24px' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', color: '#0f172a', fontWeight: 800 }}>Horarios & Matriz de Disponibilidad</h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="btn-secondary"
            onClick={() => setActiveSubTab(activeSubTab === 'heatmap' ? 'inspector' : 'heatmap')}
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
          >
            <BookOpen style={{ width: '16px', height: '16px' }} />
            {activeSubTab === 'heatmap' ? 'Inspector de Clases' : 'Ver Mapa de Calor'}
          </button>

          <button
            className="btn-primary"
            onClick={() => setShowUploadModal(true)}
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
          >
            <Upload style={{ width: '16px', height: '16px' }} /> Cargar Horario
          </button>
        </div>
      </div>

      {/* Validation Banner if unapproved */}
      {!isScheduleApproved && (
        <div className="mitec-card" style={{ borderLeft: '5px solid #d97706', background: '#fffbeb', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle style={{ width: '22px', height: '22px', color: '#d97706' }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase' }}>
                ⚠️ VALIDACIÓN DE HORARIO PENDIENTE
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#92400e' }}>
                El alumno {selectedStudentObj?.name || 'Ale G'} subió su horario MiTec con IA
              </div>
              <div style={{ fontSize: '0.78rem', color: '#b45309' }}>
                Se han extraído materias reales de MiTec. Valida el comprobante para habilitar su disponibilidad en la matriz de ensayos.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={() => setActiveSubTab('inspector')} style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
              <Eye style={{ width: '14px', height: '14px' }} /> Revisar Materias ({currentStudentSchedules.length})
            </button>
            <button className="btn-primary" onClick={handleApproveScheduleValidation} style={{ fontSize: '0.78rem', padding: '6px 12px', background: '#059669' }}>
              <CheckCircle style={{ width: '14px', height: '14px' }} /> Validar & Aprobar Horario
            </button>
          </div>
        </div>
      )}

      {/* SubTab Navigation */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setActiveSubTab('heatmap')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            background: activeSubTab === 'heatmap' ? '#0033a0' : '#ffffff',
            color: activeSubTab === 'heatmap' ? '#ffffff' : '#64748b',
            boxShadow: activeSubTab === 'heatmap' ? '0 2px 8px rgba(0,51,160,0.2)' : 'none',
            border: '1px solid #e2e8f0',
          }}
        >
          🗺️ Mapa de Calor de Disponibilidad
        </button>

        <button
          onClick={() => setActiveSubTab('inspector')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            background: activeSubTab === 'inspector' ? '#0033a0' : '#ffffff',
            color: activeSubTab === 'inspector' ? '#ffffff' : '#64748b',
            boxShadow: activeSubTab === 'inspector' ? '0 2px 8px rgba(0,51,160,0.2)' : 'none',
            border: '1px solid #e2e8f0',
          }}
        >
          📑 Inspector & Editor de Horarios de Alumno ({currentStudentSchedules.length} Clases)
        </button>
      </div>

      {/* VIEW 1: Availability Heatmap */}
      {activeSubTab === 'heatmap' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>
              Mapa de Calor de Ensayos ({filteredHeatmapStudents.length} Alumnos)
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Sensibilidad / Granularidad de Tiempo Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <button
                  onClick={() => setTimeGranularity('HOURLY')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    background: timeGranularity === 'HOURLY' ? '#ffffff' : 'transparent',
                    color: timeGranularity === 'HOURLY' ? '#0033a0' : '#64748b',
                    boxShadow: timeGranularity === 'HOURLY' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  ⏰ Cada 1 Hora
                </button>
                <button
                  onClick={() => setTimeGranularity('HALF_HOURLY')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    background: timeGranularity === 'HALF_HOURLY' ? '#ffffff' : 'transparent',
                    color: timeGranularity === 'HALF_HOURLY' ? '#0033a0' : '#64748b',
                    boxShadow: timeGranularity === 'HALF_HOURLY' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  ⏱️ Cada 30 Minutos
                </button>
              </div>

              {/* Discipline Filter */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setHeatmapDisciplineFilter('ALL')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    background: heatmapDisciplineFilter === 'ALL' ? '#0033a0' : '#f1f5f9',
                    color: heatmapDisciplineFilter === 'ALL' ? '#ffffff' : '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  Todos ({activeStudents.length})
                </button>

                <button
                  onClick={() => setHeatmapDisciplineFilter('MUSICA')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    background: heatmapDisciplineFilter === 'MUSICA' ? '#0033a0' : '#f1f5f9',
                    color: heatmapDisciplineFilter === 'MUSICA' ? '#ffffff' : '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  🎺 Músicos ({activeStudents.filter((s) => s.discipline === 'MUSICA').length})
                </button>

                <button
                  onClick={() => setHeatmapDisciplineFilter('CANTO')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    background: heatmapDisciplineFilter === 'CANTO' ? '#0033a0' : '#f1f5f9',
                    color: heatmapDisciplineFilter === 'CANTO' ? '#ffffff' : '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  🎤 Cantantes ({activeStudents.filter((s) => s.discipline === 'CANTO').length})
                </button>

                <button
                  onClick={() => setHeatmapDisciplineFilter('DANZA')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    background: heatmapDisciplineFilter === 'DANZA' ? '#0033a0' : '#f1f5f9',
                    color: heatmapDisciplineFilter === 'DANZA' ? '#ffffff' : '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  💃 Bailarines / Danza ({activeStudents.filter((s) => s.discipline === 'DANZA').length})
                </button>
              </div>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '4px' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'left' }}>Hora</th>
                {DAYS.map((day) => (
                  <th key={day} style={{ padding: '8px', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center' }}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeTimeSlots.map((time) => (
                <tr key={time}>
                  <td style={{ padding: '6px 12px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, width: '85px' }}>
                    {time} hs
                  </td>
                  {DAYS.map((day) => {
                    const { available, total, percentage } = calculateAvailability(day, time);
                    return (
                      <td
                        key={day}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          background: getHeatmapColor(percentage),
                          border: `1px solid ${getTextColor(percentage)}33`,
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'transform 0.1s ease'
                        }}
                        title={`${available} de ${total} alumnos disponibles (${percentage}%)`}
                      >
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: getTextColor(percentage) }}>
                          {available}/{total}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: getTextColor(percentage), opacity: 0.9 }}>
                          {percentage}% libres
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 2: Student Schedule Inspector & Editor */}
      {activeSubTab === 'inspector' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BookOpen style={{ color: 'var(--primary)' }} />
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800 }}>Inspector de Clases por Alumno</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Revisa, resetea y modifica la fecha de vencimiento y materias de cada alumno.</p>
              </div>
            </div>

            {/* Student Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Alumno:</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                style={{ padding: '8px 14px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 700 }}
              >
                {activeStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.matricula}) - {s.section}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Profile Info Card */}
          {selectedStudentObj && (
            <div style={{ background: 'rgba(2, 132, 199, 0.05)', border: '1px solid rgba(2, 132, 199, 0.2)', padding: '16px 20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {selectedStudentObj.companyName} | {selectedStudentObj.discipline}
                  </span>
                  <span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                    🟢 HABILITADO
                  </span>
                </div>
                <h4 style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: '1.1rem', marginTop: '2px' }}>{selectedStudentObj.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Matrícula: <strong>{selectedStudentObj.matricula}</strong> | Correo: <strong>{selectedStudentObj.email}</strong> | UUID BD: <code style={{ fontSize: '0.72rem', background: '#e2e8f0', padding: '2px 4px', borderRadius: '4px' }}>{selectedStudentObj.id}</code>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    if (selectedStudentObj && confirm(`¿Vaciar todo el horario de ${selectedStudentObj.name} para reingresarlo limpio?`)) {
                      if (onClearStudentSchedules) onClearStudentSchedules(selectedStudentObj.id);
                    }
                  }}
                  style={{ fontSize: '0.8rem', padding: '8px 12px', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)', background: '#fff1f2' }}
                >
                  <Trash2 style={{ width: '14px', height: '14px' }} /> Vaciar / Resetear Horario
                </button>

                <button className="btn-primary" onClick={handleOpenAddCourse} style={{ fontSize: '0.8rem', padding: '8px 14px' }}>
                  <Plus style={{ width: '14px', height: '14px' }} /> + Agregar Bloqueo / Materia Masiva
                </button>
              </div>
            </div>
          )}

          {/* Table of Student Courses */}
          {currentStudentSchedules.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <Clock style={{ width: '40px', height: '40px', color: 'var(--accent-amber)', margin: '0 auto 8px auto', display: 'block' }} />
              <p style={{ fontWeight: 700, color: '#475569' }}>Este alumno no tiene materias registradas actualmente.</p>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                El horario está vacío o fue reseteado. Puedes agregar un bloqueo manual o esperar a que el alumno escanee su horario en su PWA.
              </p>
              <button className="btn-secondary" onClick={handleOpenAddCourse} style={{ marginTop: '12px' }}>
                + Agregar Primera Materia o Bloqueo
              </button>
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nombre de la Materia / Bloqueo</th>
                  <th>Día de la Semana</th>
                  <th>Horario (Inicio - Fin)</th>
                  <th>Vigencia & Expiración</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentStudentSchedules.map((course) => (
                  <tr key={course.id}>
                    <td style={{ fontWeight: 800, color: 'var(--text-main)' }}>📖 {course.courseName}</td>
                    <td>
                      <span className="badge badge-purple">{course.dayOfWeek}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      🕒 {course.startTime.substring(0, 5)} - {course.endTime.substring(0, 5)} hs
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                          🟢 VIGENTE
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Vence: <strong>{course.validUntil || '2026-12-15'}</strong>
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn-secondary"
                          onClick={() => handleOpenEditCourse(course)}
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                          <Edit2 style={{ width: '12px', height: '12px' }} /> Editar
                        </button>
                        <button
                          className="btn-secondary"
                          onClick={() => handleDeleteCourse(course.id)}
                          style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#f43f5e' }}
                        >
                          <Trash2 style={{ width: '12px', height: '12px' }} /> Borrar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Manual Bulk Multi-day & Single Course Add/Edit Modal */}
      {showCourseModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', maxWidth: '480px', width: '100%', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              {editingCourse ? 'Editar Clase / Modificar Fecha de Vencimiento' : '⚡ Cargar Bloqueo o Materias Masivas'}
            </h3>

            <form onSubmit={handleSaveCourse} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Nombre de la Materia o Motivo del Bloqueo
                </label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Ej. Trabajo, Entrenamiento, Cálculo Diferencial"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              {/* Multi-day Selection */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                    Días de la Semana (Selección Múltiple Masiva)
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
                    value={courseStartTime}
                    onChange={(e) => setCourseStartTime(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    value={courseEndTime}
                    onChange={(e) => setCourseEndTime(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Period & Expiration Deadline */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Periodo Escolar
                  </label>
                  <input
                    type="text"
                    value={periodName}
                    onChange={(e) => setPeriodName(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Fecha Límite / Vigencia
                  </label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  ⚡ Guardar Cambios ({selectedDays.length} Días)
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowCourseModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
