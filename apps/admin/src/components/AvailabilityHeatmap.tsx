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

  // View Mode: 'heatmap' vs 'inspector'
  const [activeSubTab, setActiveSubTab] = useState<'heatmap' | 'inspector'>('heatmap');

  // Interactive Slot Detail Modal State
  const [slotDetail, setSlotDetail] = useState<SlotDetailModalData | null>(null);
  const [slotFilterTab, setSlotFilterTab] = useState<'all' | 'free' | 'busy'>('all');
  const [disciplineFilter, setDisciplineFilter] = useState<string>('ALL');

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

  // Selected student object
  const selectedStudentObj = activeStudents.find((s) => s.id === selectedStudentId) || activeStudents[0];

  // Current student schedules (filtered strictly by studentId UUID match)
  const currentStudentSchedules = schedules.filter((sch) => {
    if (!selectedStudentObj) return false;
    return sch.studentId === selectedStudentObj.id;
  });

  const activeTimeSlots = timeGranularity === 'HOURLY' ? HOURLY_SLOTS : HALF_HOURLY_SLOTS;

  // Compute Heatmap Matrix Occupancy
  const getOccupancyForSlot = (day: string, timeSlot: string) => {
    if (activeStudents.length === 0) return { busyCount: 0, freeCount: 0, percentageFree: 100, total: 0 };

    const busyCount = activeStudents.filter((student) => {
      const studentSch = schedules.filter((sch) => sch.studentId === student.id);
      return studentSch.some((sch) => {
        if (sch.dayOfWeek.toLowerCase() !== day.toLowerCase()) return false;
        return timeSlot >= sch.startTime && timeSlot < sch.endTime;
      });
    }).length;

    const freeCount = activeStudents.length - busyCount;
    const percentageFree = Math.round((freeCount / activeStudents.length) * 100);

    return { busyCount, freeCount, percentageFree, total: activeStudents.length };
  };

  // Open Interactive Slot Details by Student Name
  const handleCellClick = (day: string, slot: string) => {
    const freeStudents: StudentProfile[] = [];
    const busyStudents: { student: StudentProfile; courseName: string; startTime: string; endTime: string }[] = [];

    activeStudents.forEach((student) => {
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

    const percentageFree = activeStudents.length > 0
      ? Math.round((freeStudents.length / activeStudents.length) * 100)
      : 100;

    setSlotDetail({
      day,
      timeSlot: slot,
      freeStudents,
      busyStudents,
      percentageFree,
    });
    setSlotFilterTab('all');
    setDisciplineFilter('ALL');
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
    if (!newCourseName.trim() || !selectedStudentObj) return;

    if (editingCourseId && onDeleteScheduleCourse) {
      onDeleteScheduleCourse(editingCourseId);
    }

    if (onSaveScheduleCourse) {
      selectedDays.forEach((day) => {
        onSaveScheduleCourse(
          selectedStudentObj.id,
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
    if (!file || !selectedStudentObj) return;

    setOcrLoading(true);
    setOcrResult(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const result = await parseScheduleImageWithGemini(base64);
        setOcrResult(result);

        if (result.courses && result.courses.length > 0 && onUploadStudentSchedule) {
          onUploadStudentSchedule(selectedStudentObj.id, result.courses);
        }
      } catch (err) {
        console.error('Error procesando imagen de horario:', err);
      } finally {
        setOcrLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Filtered Students for the Modal
  const getFilteredSlotStudents = () => {
    if (!slotDetail) return { free: [], busy: [] };

    let free = slotDetail.freeStudents;
    let busy = slotDetail.busyStudents;

    if (disciplineFilter !== 'ALL') {
      free = free.filter((s) => s.discipline === disciplineFilter);
      busy = busy.filter((b) => b.student.discipline === disciplineFilter);
    }

    return { free, busy };
  };

  const { free: modalFilteredFree, busy: modalFilteredBusy } = getFilteredSlotStudents();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
      {/* Top Header & View Mode Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-blue">DISPONIBILIDAD & COMPATIBILIDAD</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {activeStudents.length} Alumnos Activos
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Matriz de Horarios Escolares
          </h2>
        </div>

        {/* View Controls & Granularity Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* SubTab Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-dark)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setActiveSubTab('heatmap')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeSubTab === 'heatmap' ? 'var(--bg-surface)' : 'transparent',
                color: activeSubTab === 'heatmap' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: activeSubTab === 'heatmap' ? 800 : 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: activeSubTab === 'heatmap' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              🗺️ Mapa de Calor General
            </button>
            <button
              onClick={() => setActiveSubTab('inspector')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeSubTab === 'inspector' ? 'var(--bg-surface)' : 'transparent',
                color: activeSubTab === 'inspector' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: activeSubTab === 'inspector' ? 800 : 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: activeSubTab === 'inspector' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              🔍 Inspector por Alumno
            </button>
          </div>

          {/* Granularity Switcher */}
          <button
            onClick={() => setTimeGranularity(timeGranularity === 'HOURLY' ? 'HALF_HOURLY' : 'HOURLY')}
            className="btn-secondary"
            style={{ fontSize: '0.82rem' }}
          >
            <SlidersHorizontal style={{ width: 14, height: 14 }} />
            <span>{timeGranularity === 'HOURLY' ? '⏰ Cada 1 Hora' : '⏱️ Cada 30 Minutos'}</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: HEATMAP GRID */}
      {activeSubTab === 'heatmap' && (
        <div className="executive-card" style={{ padding: '24px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Porcentaje de Disponibilidad Libre</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                👉 <strong>Haz clic en cualquier bloque horario</strong> para ver la lista con nombres de alumnos disponibles y ocupados con clase.
              </p>
            </div>

            {/* Legend */}
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
          </div>

          <table className="custom-table" style={{ width: '100%', minWidth: '700px' }}>
            <thead>
              <tr>
                <th style={{ width: '100px' }}>HORA</th>
                {DAYS.map((day) => (
                  <th key={day} style={{ textAlign: 'center' }}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeTimeSlots.map((slot) => (
                <tr key={slot}>
                  <td style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{slot}</td>
                  {DAYS.map((day) => {
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
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUBTAB 2: INSPECTOR BY STUDENT */}
      {activeSubTab === 'inspector' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Student Selector Card */}
          <div className="executive-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck style={{ width: 22, height: 22 }} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                  ALUMNO SELECCIONADO
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    outline: 'none',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {activeStudents.map((s) => (
                    <option key={s.id} value={s.id} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
                      {s.name} ({s.matricula}) — {s.companyName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={handleOpenAddModal} className="btn-primary">
                <Plus style={{ width: 16, height: 16 }} />
                <span>+ Bloqueo Masivo</span>
              </button>

              <button onClick={() => setShowUploadModal(true)} className="btn-secondary">
                <Sparkles style={{ width: 16, height: 16, color: 'var(--primary)' }} />
                <span>Escanear IA Gemini</span>
              </button>

              {onClearStudentSchedules && selectedStudentObj && (
                <button
                  onClick={() => {
                    if (confirm(`¿Vaciar todo el horario de ${selectedStudentObj.name}?`)) {
                      onClearStudentSchedules(selectedStudentObj.id);
                    }
                  }}
                  className="btn-secondary"
                  style={{ color: 'var(--rose-accent)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                >
                  <Trash2 style={{ width: 16, height: 16 }} />
                  <span>Vaciar Horario</span>
                </button>
              )}
            </div>
          </div>

          {/* Student Schedule Items Table */}
          <div className="executive-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                Horario Registrado de {selectedStudentObj?.name}
              </h3>
              <span className="badge badge-emerald">
                {currentStudentSchedules.length} Clases / Bloqueos
              </span>
            </div>

            {currentStudentSchedules.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Clock style={{ width: 36, height: 36, margin: '0 auto 12px auto', opacity: 0.4 }} />
                <div style={{ fontWeight: 700 }}>Sin horario o bloqueos registrados</div>
                <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>Utiliza "+ Bloqueo Masivo" o "Escanear IA Gemini" para agregar materias.</div>
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
                  {currentStudentSchedules.map((sch) => (
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
        </div>
      )}

      {/* DETAILED SLOT AVAILABILITY MODAL (CLICK ON HEATMAP CELL) */}
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
                    {slotDetail.percentageFree}% Libre ({slotDetail.freeStudents.length} de {activeStudents.length} alumnos)
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

            {/* Filter Bar */}
            <div style={{ padding: '12px 28px', background: 'var(--bg-dark)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: '6px' }}>
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
                  Todos ({activeStudents.length})
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

              {/* Discipline Filter */}
              <select
                value={disciplineFilter}
                onChange={(e) => setDisciplineFilter(e.target.value)}
                style={{ padding: '6px 12px', fontSize: '0.78rem', fontWeight: 700 }}
              >
                <option value="ALL">Todas las Disciplinas</option>
                <option value="MUSICA">🎺 Música</option>
                <option value="CANTO">🎤 Canto</option>
                <option value="DANZA">💃 Danza</option>
                <option value="ACTUACION">🎭 Actuación</option>
                <option value="STAFF">🛠️ Staff</option>
              </select>
            </div>

            {/* Modal Body: Scrollable Student Cards List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* 1. FREE STUDENTS SECTION */}
              {(slotFilterTab === 'all' || slotFilterTab === 'free') && modalFilteredFree.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🟢 ALUMNOS DISPONIBLES ({modalFilteredFree.length})
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                    {modalFilteredFree.map((student) => (
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
                            setSelectedStudentId(student.id);
                            setActiveSubTab('inspector');
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
                          title="Inspeccionar horario completo"
                        >
                          Ver Horario →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. BUSY STUDENTS SECTION */}
              {(slotFilterTab === 'all' || slotFilterTab === 'busy') && modalFilteredBusy.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: slotFilterTab === 'all' ? '12px' : '0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🔴 ALUMNOS CON CLASE / OCUPADOS ({modalFilteredBusy.length})
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                    {modalFilteredBusy.map((item) => (
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
                              setSelectedStudentId(item.student.id);
                              setActiveSubTab('inspector');
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
                            title="Inspeccionar horario completo"
                          >
                            Ver Horario →
                          </button>
                        </div>

                        {/* Busy Course Details Badge */}
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

              {modalFilteredFree.length === 0 && modalFilteredBusy.length === 0 && (
                <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Users style={{ width: 36, height: 36, margin: '0 auto 8px auto', opacity: 0.4 }} />
                  <div style={{ fontWeight: 700 }}>No hay alumnos que coincidan con los filtros seleccionados</div>
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

      {/* Multi-day Bulk Blocking Modal */}
      {showAddClassModal && (
        <div className="modal-backdrop">
          <div className="executive-card" style={{ width: '100%', maxWidth: '520px', padding: '28px', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {editingCourseId ? 'Editar Bloqueo' : 'Cargar Bloqueo / Materia Masiva'}
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
                  placeholder="Ej: Clases Bloqueadas / Trabajo de Laboratorio"
                  required
                  style={{ width: '100%', padding: '10px 14px' }}
                />
              </div>

              {/* Day Chips Selection */}
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

      {/* Gemini OCR Upload Modal */}
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
              Sube una captura de pantalla del horario de MiTec del alumno. La Inteligencia Artificial extraerá automáticamente el listado de materias y reemplazará su horario anterior.
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
                {ocrLoading ? 'Procesando con Gemini Vision IA...' : 'Haz clic para seleccionar imagen de MiTec'}
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
