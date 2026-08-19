import React, { useState } from 'react';
import {
  CalendarClock,
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle,
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Calendar,
  Save,
  ShieldAlert,
  CheckCircle,
  Filter,
  CheckSquare,
  Square,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  X,
  User,
  Users,
  Search,
  Layers,
  LayoutGrid,
  List,
} from 'lucide-react';
import { StudentProfile, StudentSchedule, parseScheduleImageWithGemini } from '../shared';

interface AvailabilityHeatmapProps {
  students: StudentProfile[];
  schedules: StudentSchedule[];
  onUploadStudentSchedule?: (studentId: string, courses: any[]) => void;
  onSaveScheduleCourse?: (studentId: string, dayOfWeek: string, startTime: string, endTime: string, courseName: string, periodName?: string, validUntil?: string) => void;
  onDeleteScheduleCourse?: (scheduleId: string) => void;
  onClearStudentSchedules?: (studentId: string) => void;
}

interface SlotDetailModalData {
  day: string;
  timeSlot: string;
  freeStudents: StudentProfile[];
  busyStudents: { student: StudentProfile; courseName: string; startTime: string; endTime: string }[];
  percentageFree: number;
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

// Aesthetic distinct color palette for colored course chips
const COURSE_COLORS = [
  { bg: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', border: '#3b82f6', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #581c87 0%, #7c3aed 100%)', border: '#8b5cf6', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)', border: '#10b981', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #831843 0%, #db2777 100%)', border: '#ec4899', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)', border: '#f97316', text: '#ffffff' },
  { bg: 'linear-gradient(135deg, #134e4a 0%, #0d9488 100%)', border: '#14b8a6', text: '#ffffff' },
];

function getCourseColor(courseName: string) {
  let hash = 0;
  for (let i = 0; i < courseName.length; i++) {
    hash = courseName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COURSE_COLORS.length;
  return COURSE_COLORS[index];
}

export const AvailabilityHeatmap: React.FC<AvailabilityHeatmapProps> = ({
  students,
  schedules,
  onUploadStudentSchedule,
  onSaveScheduleCourse,
  onDeleteScheduleCourse,
  onClearStudentSchedules,
}) => {
  const activeStudents = students.filter((s) => s.status === 'ACTIVE');

  // Selected Student View Filter: 'ALL' (Heatmap) vs Specific Student ID (Individual Visual Grid)
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('ALL');

  // Discipline Filter: 'ALL', 'MUSICA', 'CANTO', 'DANZA', 'ACTUACION'
  const [disciplineFilter, setDisciplineFilter] = useState<string>('ALL');

  // Display Mode: 'grid' (Visual Weekly Calendar) vs 'table' (List Table)
  const [displayMode, setDisplayMode] = useState<'grid' | 'table'>('grid');

  // Time Granularity State: 1 Hour vs 30 Minutes
  const [timeGranularity, setTimeGranularity] = useState<'HOURLY' | 'HALF_HOURLY'>('HOURLY');

  // Interactive Slot Detail Modal State (when clicking on collective heatmap cell)
  const [slotDetail, setSlotDetail] = useState<SlotDetailModalData | null>(null);
  const [slotFilterTab, setSlotFilterTab] = useState<'all' | 'free' | 'busy'>('all');

  // Real File Upload & Gemini OCR State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any | null>(null);

  // Manual Add Class / Multi-day Bulk Blocking Form State
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // Multi-day selection state
  const [selectedDays, setSelectedDays] = useState<string[]>(['Lunes']);
  const [newCourseName, setNewCourseName] = useState('');
  const [newStartTime, setNewStartTime] = useState('07:00');
  const [newEndTime, setNewEndTime] = useState('09:00');
  const [newValidUntil, setNewValidUntil] = useState('2026-12-15');

  const activeTimeSlots = timeGranularity === 'HOURLY' ? HOURLY_SLOTS : HALF_HOURLY_SLOTS;

  // Filter students based on discipline filter
  const filteredActiveStudents = activeStudents.filter((s) => {
    if (disciplineFilter === 'ALL') return true;
    return s.discipline === disciplineFilter;
  });

  // Selected student object (if a single student is selected)
  const currentIndividualStudent = activeStudents.find((s) => s.id === selectedStudentFilter);

  // Schedules for the selected individual student
  const individualSchedules = schedules.filter((sch) => {
    if (!currentIndividualStudent) return false;
    return sch.studentId === currentIndividualStudent.id;
  });

  // Compute Heatmap Matrix Occupancy for Collective Mode
  const getOccupancyForSlot = (day: string, timeSlot: string) => {
    if (filteredActiveStudents.length === 0) return { busyCount: 0, freeCount: 0, percentageFree: 100, total: 0 };

    const busyCount = filteredActiveStudents.filter((student) => {
      const studentSch = schedules.filter((sch) => sch.studentId === student.id);
      return studentSch.some((sch) => {
        if (sch.dayOfWeek.toLowerCase() !== day.toLowerCase()) return false;
        return timeSlot >= sch.startTime && timeSlot < sch.endTime;
      });
    }).length;

    const freeCount = filteredActiveStudents.length - busyCount;
    const percentageFree = Math.round((freeCount / filteredActiveStudents.length) * 100);

    return { busyCount, freeCount, percentageFree, total: filteredActiveStudents.length };
  };

  // Find overlapping course for individual student in a specific slot
  const getIndividualSlotCourse = (day: string, timeSlot: string) => {
    if (!currentIndividualStudent) return null;
    return individualSchedules.find((sch) => {
      if (sch.dayOfWeek.toLowerCase() !== day.toLowerCase()) return false;
      return timeSlot >= sch.startTime && timeSlot < sch.endTime;
    });
  };

  // Open Interactive Slot Details by Student Name
  const handleCellClick = (day: string, slot: string) => {
    if (selectedStudentFilter !== 'ALL' && currentIndividualStudent) {
      // In individual mode, clicking opens the add/edit modal for that specific slot
      const existing = getIndividualSlotCourse(day, slot);
      if (existing) {
        handleOpenEditModal(existing);
      } else {
        setEditingCourseId(null);
        setNewCourseName('');
        setSelectedDays([day]);
        setNewStartTime(slot);
        const [h, m] = slot.split(':').map(Number);
        const endHour = String(Math.min(22, h + 1)).padStart(2, '0');
        setNewEndTime(`${endHour}:${String(m).padStart(2, '0')}`);
        setNewValidUntil('2026-12-15');
        setShowAddClassModal(true);
      }
      return;
    }

    // Collective Mode: open detailed breakdown modal
    const freeStudents: StudentProfile[] = [];
    const busyStudents: { student: StudentProfile; courseName: string; startTime: string; endTime: string }[] = [];

    filteredActiveStudents.forEach((student) => {
      const studentSch = schedules.filter((sch) => sch.studentId === student.id);
      const overlapping = studentSch.find((sch) => {
        if (sch.dayOfWeek.toLowerCase() !== day.toLowerCase()) return false;
        return slot >= sch.startTime && slot < sch.endTime;
      });

      if (overlapping) {
        busyStudents.push({
          student,
          courseName: overlapping.courseName,
          startTime: overlapping.startTime,
          endTime: overlapping.endTime,
        });
      } else {
        freeStudents.push(student);
      }
    });

    const percentageFree = filteredActiveStudents.length > 0
      ? Math.round((freeStudents.length / filteredActiveStudents.length) * 100)
      : 100;

    setSlotDetail({
      day,
      timeSlot: slot,
      freeStudents,
      busyStudents,
      percentageFree,
    });
    setSlotFilterTab('all');
  };

  const handleToggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSelectAllWeekdays = () => {
    setSelectedDays(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']);
  };

  const handleOpenAddModal = () => {
    setEditingCourseId(null);
    setNewCourseName('');
    setSelectedDays(['Lunes']);
    setNewStartTime('07:00');
    setNewEndTime('09:00');
    setNewValidUntil('2026-12-15');
    setShowAddClassModal(true);
  };

  const handleOpenEditModal = (sch: StudentSchedule) => {
    setEditingCourseId(sch.id);
    setNewCourseName(sch.courseName);
    setSelectedDays([sch.dayOfWeek]);
    setNewStartTime(sch.startTime);
    setNewEndTime(sch.endTime);
    setNewValidUntil(sch.validUntil || '2026-12-15');
    setShowAddClassModal(true);
  };

  const handleSaveClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;

    const targetStudent = currentIndividualStudent || activeStudents[0];
    if (!targetStudent) return;

    if (editingCourseId && onDeleteScheduleCourse) {
      onDeleteScheduleCourse(editingCourseId);
    }

    if (onSaveScheduleCourse) {
      selectedDays.forEach((day) => {
        onSaveScheduleCourse(
          targetStudent.id,
          day,
          newStartTime,
          newEndTime,
          newCourseName,
          'Semestre Agosto - Diciembre 2026',
          newValidUntil
        );
      });
    }

    setShowAddClassModal(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetStudent = currentIndividualStudent || activeStudents[0];
    if (!file || !targetStudent) return;

    setOcrLoading(true);
    setOcrResult(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const result = await parseScheduleImageWithGemini(base64);
        setOcrResult(result);

        if (result.courses && result.courses.length > 0 && onUploadStudentSchedule) {
          onUploadStudentSchedule(targetStudent.id, result.courses);
        }
      } catch (err) {
        console.error('Error procesando imagen de horario:', err);
      } finally {
        setOcrLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
      {/* 1. TOP HEADER & MAIN CONTROLS */}
      <div className="executive-card" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-blue">MATRIZ DE HORARIOS ESCOLARES</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                {activeStudents.length} Alumnos en Sistema
              </span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              {selectedStudentFilter === 'ALL'
                ? 'Disponibilidad General del Elenco'
                : `Horario Semanal: ${currentIndividualStudent?.name}`}
            </h2>
          </div>

          {/* Action Buttons for Selected Student */}
          {selectedStudentFilter !== 'ALL' && currentIndividualStudent && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={handleOpenAddModal} className="btn-primary">
                <Plus style={{ width: 16, height: 16 }} />
                <span>+ Agregar Bloqueo</span>
              </button>

              <button onClick={() => setShowUploadModal(true)} className="btn-secondary">
                <Sparkles style={{ width: 16, height: 16, color: 'var(--primary)' }} />
                <span>Escanear IA Gemini</span>
              </button>

              {onClearStudentSchedules && (
                <button
                  onClick={() => {
                    if (confirm(`¿Vaciar todo el horario de ${currentIndividualStudent.name}?`)) {
                      onClearStudentSchedules(currentIndividualStudent.id);
                    }
                  }}
                  className="btn-danger"
                  title="Vaciar todas las materias del alumno"
                >
                  <Trash2 style={{ width: 16, height: 16 }} />
                  <span>Vaciar Horario</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* 2. DYNAMIC FILTER TOOLBAR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          {/* Student Filter Selector Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 300px', maxWidth: '480px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: selectedStudentFilter === 'ALL' ? 'var(--primary-light)' : '#dbeafe', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {selectedStudentFilter === 'ALL' ? <Users style={{ width: 18, height: 18 }} /> : <UserCheck style={{ width: 18, height: 18 }} />}
            </div>

            <div style={{ width: '100%' }}>
              <label style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                VISUALIZAR HORARIO DE:
              </label>
              <select
                value={selectedStudentFilter}
                onChange={(e) => setSelectedStudentFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  background: 'var(--bg-dark)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                }}
              >
                <option value="ALL">👥 Todos los Alumnos (Mapa de Calor General)</option>
                <optgroup label="── Ver Horario Individual de Alumno ──">
                  {activeStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      👤 {s.name} ({s.matricula}) — {s.discipline}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Quick Filter by Discipline (for general map) */}
          {selectedStudentFilter === 'ALL' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '4px' }}>
                Disciplina:
              </span>
              {[
                { id: 'ALL', label: 'Todas' },
                { id: 'MUSICA', label: '🎺 Música' },
                { id: 'CANTO', label: '🎤 Canto' },
                { id: 'DANZA', label: '💃 Danza' },
                { id: 'ACTUACION', label: '🎭 Actuación' },
              ].map((disc) => (
                <button
                  key={disc.id}
                  onClick={() => setDisciplineFilter(disc.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: disciplineFilter === disc.id ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    background: disciplineFilter === disc.id ? 'var(--primary-light)' : 'var(--bg-dark)',
                    color: disciplineFilter === disc.id ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {disc.label}
                </button>
              ))}
            </div>
          )}

          {/* Granularity & View Mode Toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            {selectedStudentFilter !== 'ALL' && (
              <div style={{ display: 'flex', background: 'var(--bg-dark)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => setDisplayMode('grid')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '7px',
                    border: 'none',
                    background: displayMode === 'grid' ? 'var(--bg-card)' : 'transparent',
                    color: displayMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                  title="Vista Gráfica Semanal"
                >
                  <LayoutGrid style={{ width: 14, height: 14 }} />
                  <span>Gráfico</span>
                </button>
                <button
                  onClick={() => setDisplayMode('table')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '7px',
                    border: 'none',
                    background: displayMode === 'table' ? 'var(--bg-card)' : 'transparent',
                    color: displayMode === 'table' ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                  title="Vista de Tabla / Lista"
                >
                  <List style={{ width: 14, height: 14 }} />
                  <span>Lista</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setTimeGranularity(timeGranularity === 'HOURLY' ? 'HALF_HOURLY' : 'HOURLY')}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '8px 12px' }}
            >
              <SlidersHorizontal style={{ width: 13, height: 13 }} />
              <span>{timeGranularity === 'HOURLY' ? '⏰ 1 Hora' : '⏱️ 30 Mins'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. VISUAL WEEKLY SCHEDULE GRID (FOR BOTH GENERAL MAP & INDIVIDUAL STUDENT) */}
      {(selectedStudentFilter === 'ALL' || displayMode === 'grid') && (
        <div className="executive-card" style={{ padding: '24px', overflowX: 'auto' }}>
          {/* Header Description */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {selectedStudentFilter === 'ALL'
                  ? 'Matriz Semanal de Compatibilidad (Lunes a Sábado)'
                  : `Horario Gráfico de ${currentIndividualStudent?.name} (${individualSchedules.length} materias)`}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {selectedStudentFilter === 'ALL'
                  ? '👉 Haz clic en cualquier casilla para ver los nombres de los alumnos disponibles y ocupados.'
                  : '👉 Haz clic en cualquier materia para editarla, o en un espacio libre para agregar un bloqueo.'}
              </p>
            </div>

            {/* Color Legend */}
            {selectedStudentFilter === 'ALL' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#dcfce7', border: '1px solid #86efac' }} />
                  <span>80-100% Libre</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#fef9c3', border: '1px solid #fde047' }} />
                  <span>40-79% Libre</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ffe4e6', border: '1px solid #fca5a5' }} />
                  <span>0-39% Libre</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#2563eb' }} />
                  <span>Materia / Clase</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f8fafc', border: '1px dashed #cbd5e1' }} />
                  <span>Espacio Libre</span>
                </div>
              </div>
            )}
          </div>

          {/* Schedule Table */}
          <table className="custom-table" style={{ width: '100%', minWidth: '780px' }}>
            <thead>
              <tr>
                <th style={{ width: '90px' }}>HORA</th>
                {DAYS.map((day) => (
                  <th key={day} style={{ textAlign: 'center' }}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeTimeSlots.map((slot) => (
                <tr key={slot}>
                  <td style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{slot}</td>
                  {DAYS.map((day) => {
                    // MODE A: COLLECTIVE HEATMAP
                    if (selectedStudentFilter === 'ALL') {
                      const occ = getOccupancyForSlot(day, slot);
                      let bgColor = '#dcfce7';
                      let textColor = '#166534';
                      let borderColor = '#86efac';

                      if (occ.percentageFree < 40) {
                        bgColor = '#ffe4e6';
                        textColor = '#9f1239';
                        borderColor = '#fca5a5';
                      } else if (occ.percentageFree < 80) {
                        bgColor = '#fef9c3';
                        textColor = '#854d0e';
                        borderColor = '#fde047';
                      }

                      return (
                        <td key={day} style={{ textAlign: 'center', padding: '6px' }}>
                          <div
                            onClick={() => handleCellClick(day, slot)}
                            style={{
                              background: bgColor,
                              color: textColor,
                              border: `1px solid ${borderColor}`,
                              borderRadius: '10px',
                              padding: '8px 4px',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.04)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                            }}
                            title={`Clic para ver quiénes están libres u ocupados el ${day} a las ${slot}`}
                          >
                            {occ.percentageFree}% Libre
                            <div style={{ fontSize: '0.65rem', opacity: 0.85, fontWeight: 700, marginTop: '2px' }}>
                              {occ.freeCount}/{occ.total} alumnos
                            </div>
                          </div>
                        </td>
                      );
                    }

                    // MODE B: INDIVIDUAL VISUAL SCHEDULE (COLORED CHIPS)
                    const course = getIndividualSlotCourse(day, slot);

                    if (course) {
                      const color = getCourseColor(course.courseName);
                      return (
                        <td key={day} style={{ textAlign: 'center', padding: '4px' }}>
                          <div
                            onClick={() => handleCellClick(day, slot)}
                            style={{
                              background: color.bg,
                              color: color.text,
                              borderRadius: '10px',
                              padding: '8px 6px',
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                              transition: 'all 0.15s ease',
                              textAlign: 'left',
                              minHeight: '48px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.03)';
                              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                            }}
                            title={`Editar: ${course.courseName} (${course.startTime} - ${course.endTime})`}
                          >
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                              {course.courseName}
                            </div>
                            <div style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: 700, marginTop: '4px' }}>
                              🕒 {course.startTime} - {course.endTime}
                            </div>
                          </div>
                        </td>
                      );
                    }

                    // Free Slot for Individual Student
                    return (
                      <td key={day} style={{ textAlign: 'center', padding: '4px' }}>
                        <div
                          onClick={() => handleCellClick(day, slot)}
                          style={{
                            background: 'rgba(248, 250, 252, 0.6)',
                            border: '1px dashed #cbd5e1',
                            borderRadius: '10px',
                            padding: '10px 4px',
                            fontSize: '0.72rem',
                            color: 'var(--text-dim)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--primary-light)';
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.color = 'var(--primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(248, 250, 252, 0.6)';
                            e.currentTarget.style.borderColor = '#cbd5e1';
                            e.currentTarget.style.color = 'var(--text-dim)';
                          }}
                          title={`+ Agregar clase el ${day} a las ${slot}`}
                        >
                          + Libre
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

      {/* 4. TABLE VIEW (WHEN 'LISTA' IS TOGGLED ON INDIVIDUAL STUDENT) */}
      {selectedStudentFilter !== 'ALL' && displayMode === 'table' && (
        <div className="executive-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
              Tabla de Materias y Bloqueos de {currentIndividualStudent?.name}
            </h3>
            <span className="badge badge-emerald">
              {individualSchedules.length} Clases Registradas
            </span>
          </div>

          {individualSchedules.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Clock style={{ width: 36, height: 36, margin: '0 auto 12px auto', opacity: 0.4 }} />
              <div style={{ fontWeight: 700 }}>Sin horario registrado</div>
              <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>Usa "+ Agregar Bloqueo" o "Escanear IA Gemini".</div>
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>DÍA</th>
                  <th>HORARIO</th>
                  <th>MATERIA / BLOQUEO</th>
                  <th>PERIODO</th>
                  <th>VIGENCIA</th>
                  <th style={{ textAlign: 'right' }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {individualSchedules.map((sch) => (
                  <tr key={sch.id}>
                    <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{sch.dayOfWeek}</td>
                    <td style={{ fontWeight: 700 }}>{sch.startTime} - {sch.endTime} hs</td>
                    <td style={{ fontWeight: 600 }}>{sch.courseName}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{sch.periodName || 'Semestre Diciembre 2026'}</td>
                    <td>
                      <span className="badge badge-emerald">🟢 {sch.validUntil || '2026-12-15'}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenEditModal(sch)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                          title="Editar"
                        >
                          <Edit2 style={{ width: 16, height: 16 }} />
                        </button>
                        {onDeleteScheduleCourse && (
                          <button
                            onClick={() => onDeleteScheduleCourse(sch.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--rose-accent)', cursor: 'pointer' }}
                            title="Eliminar"
                          >
                            <Trash2 style={{ width: 16, height: 16 }} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 5. DETAILED SLOT AVAILABILITY MODAL (CLICK ON HEATMAP CELL) */}
      {slotDetail && (
        <div className="modal-backdrop">
          <div className="executive-card" style={{ width: '100%', maxWidth: '720px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)', padding: 0, overflow: 'hidden' }}>
            {/* Modal Header */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge badge-blue">DISPONIBILIDAD DETALLADA</span>
                  <span style={{
                    background: slotDetail.percentageFree >= 80 ? '#dcfce7' : slotDetail.percentageFree >= 40 ? '#fef9c3' : '#ffe4e6',
                    color: slotDetail.percentageFree >= 80 ? '#166534' : slotDetail.percentageFree >= 40 ? '#854d0e' : '#9f1239',
                    padding: '3px 8px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                  }}>
                    {slotDetail.percentageFree}% Libre ({slotDetail.freeStudents.length} de {filteredActiveStudents.length} alumnos)
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
                  {slotDetail.day} a las {slotDetail.timeSlot} hs
                </h3>
              </div>

              <button
                onClick={() => setSlotDetail(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
              >
                <X style={{ width: 22, height: 22 }} />
              </button>
            </div>

            {/* Filter Tabs */}
            <div style={{ padding: '12px 28px', background: 'var(--bg-dark)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setSlotFilterTab('all')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: slotFilterTab === 'all' ? 'var(--primary)' : 'transparent',
                  color: slotFilterTab === 'all' ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                Todos ({filteredActiveStudents.length})
              </button>
              <button
                onClick={() => setSlotFilterTab('free')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: slotFilterTab === 'free' ? '#10b981' : 'transparent',
                  color: slotFilterTab === 'free' ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                🟢 Libres ({slotDetail.freeStudents.length})
              </button>
              <button
                onClick={() => setSlotFilterTab('busy')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: slotFilterTab === 'busy' ? '#f43f5e' : 'transparent',
                  color: slotFilterTab === 'busy' ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                🔴 Con Clase ({slotDetail.busyStudents.length})
              </button>
            </div>

            {/* Modal Body: Scrollable Student Cards List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* FREE STUDENTS */}
              {(slotFilterTab === 'all' || slotFilterTab === 'free') && slotDetail.freeStudents.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🟢 ALUMNOS DISPONIBLES ({slotDetail.freeStudents.length})
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                    {slotDetail.freeStudents.map((student) => (
                      <div
                        key={student.id}
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                            {student.name.charAt(0)}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {student.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              <span style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>{student.matricula}</span> • {student.discipline} ({student.section})
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedStudentFilter(student.id);
                            setSlotDetail(null);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary)',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            flexShrink: 0,
                          }}
                          title="Ver Horario Gráfico Individual"
                        >
                          Ver Horario →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BUSY STUDENTS */}
              {(slotFilterTab === 'all' || slotFilterTab === 'busy') && slotDetail.busyStudents.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: slotFilterTab === 'all' ? '12px' : '0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🔴 ALUMNOS CON CLASE / OCUPADOS ({slotDetail.busyStudents.length})
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                    {slotDetail.busyStudents.map((item) => (
                      <div
                        key={item.student.id}
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid rgba(244, 63, 94, 0.25)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ffe4e6', color: '#9f1239', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                              {item.student.name.charAt(0)}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.student.name}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                <span style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>{item.student.matricula}</span> • {item.student.discipline}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedStudentFilter(item.student.id);
                              setSlotDetail(null);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--primary)',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              flexShrink: 0,
                            }}
                            title="Ver Horario Gráfico Individual"
                          >
                            Ver Horario →
                          </button>
                        </div>

                        <div style={{
                          background: 'rgba(244, 63, 94, 0.08)',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          fontSize: '0.75rem',
                          color: '#e11d48',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}>
                          <BookOpen style={{ width: 14, height: 14, flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.courseName} ({item.startTime} - {item.endTime} hs)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSlotDetail(null)} className="btn-primary">
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MULTI-DAY BULK BLOCKING MODAL */}
      {showAddClassModal && (
        <div className="modal-backdrop">
          <div className="executive-card" style={{ width: '100%', maxWidth: '520px', padding: '28px', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {editingCourseId ? 'Editar Bloqueo de Horario' : 'Cargar Bloqueo / Materia'}
              </h3>
              <button onClick={() => setShowAddClassModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSaveClassSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  NOMBRE DE LA MATERIA O MOTIVO DEL BLOQUEO *
                </label>
                <input
                  type="text"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  placeholder="Ej: Clases Bloqueadas / Laboratorio"
                  required
                  style={{ width: '100%', padding: '10px 14px' }}
                />
              </div>

              {/* Day Selection */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    DÍAS APLICABLES
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllWeekdays}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
                  >
                    ⚡ Lunes a Viernes
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {DAYS.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleDay(day)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '10px',
                          border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                          background: isSelected ? 'var(--primary-light)' : 'var(--bg-dark)',
                          color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Start & End Times */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    HORA DE INICIO
                  </label>
                  <select
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px' }}
                  >
                    {HALF_HOURLY_SLOTS.map((t) => (
                      <option key={t} value={t}>{t} hs</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    HORA DE TÉRMINO
                  </label>
                  <select
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px' }}
                  >
                    {HALF_HOURLY_SLOTS.map((t) => (
                      <option key={t} value={t}>{t} hs</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Expiration Date */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  VIGENCIA HASTA FECHA
                </label>
                <input
                  type="date"
                  value={newValidUntil}
                  onChange={(e) => setNewValidUntil(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowAddClassModal(false)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  <Save style={{ width: 16, height: 16 }} />
                  <span>Guardar Bloqueo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. GEMINI OCR UPLOAD MODAL */}
      {showUploadModal && (
        <div className="modal-backdrop">
          <div className="executive-card" style={{ width: '100%', maxWidth: '480px', padding: '28px', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles style={{ width: 20, height: 20, color: 'var(--primary)' }} />
                <span>Escanear Horario con IA Gemini</span>
              </h3>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
              Sube una captura de pantalla del horario de MiTec del alumno. La IA extraerá todas las materias y actualizará su horario semanal gráfico.
            </p>

            <label style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '36px 20px',
              border: '2px dashed var(--primary)',
              borderRadius: '16px',
              background: 'var(--primary-light)',
              cursor: 'pointer',
              textAlign: 'center',
              gap: '10px',
            }}>
              <Upload style={{ width: 32, height: 32, color: 'var(--primary)' }} />
              <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem' }}>
                {ocrLoading ? 'Procesando con Gemini Vision IA...' : 'Haz clic para seleccionar captura de MiTec'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Formatos soportados: PNG, JPG, JPEG
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} disabled={ocrLoading} />
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setShowUploadModal(false)} className="btn-secondary">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
