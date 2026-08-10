import { TimeSlot, DayOfWeek } from '@organizarte/shared';

export const GEMINI_SCHEDULE_PROMPT = `
Eres un asistente experto en analizar horarios académicos universitarios del Tecnológico de Monterrey (MiTec / Canvas).
Se te proporcionará una imagen o documento PDF con el horario del alumno.

Tu objetivo es extraer con máxima precisión las clases ocupadas para cada día de la semana (LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO).

Devuelve EXCLUSIVAMENTE un arreglo JSON con la siguiente estructura sin bloques markdown ni texto adicional:
[
  {
    "day": "LUNES",
    "startTime": "09:00",
    "endTime": "11:00",
    "courseName": "Cálculo Multivariable"
  },
  ...
]

Reglas:
- Asegúrate de formatear la hora en formato militar 24 horas HH:mm (ej. "07:00", "13:30").
- Si el día indica L y J, crea una entrada para LUNES y otra para JUEVES.
- Si indica M y V, crea una entrada para MARTES y otra para VIERNES.
- Si indica Mi y S, crea una entrada para MIERCOLES y otra para SABADO.
`;

/**
 * Parses Gemini response text into structured TimeSlots
 */
export function parseGeminiScheduleResponse(rawJsonText: string): TimeSlot[] {
  try {
    const cleanedText = rawJsonText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleanedText);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item: any, index: number) => ({
      id: `slot-gemini-${index}-${Date.now()}`,
      day: (item.day?.toUpperCase() || 'LUNES') as DayOfWeek,
      startTime: item.startTime || '09:00',
      endTime: item.endTime || '11:00',
      courseName: item.courseName || 'Clase Tec',
      isAcademicClass: true,
    }));
  } catch (error) {
    console.error('Error parsing Gemini schedule output:', error);
    return [];
  }
}

/**
 * Calculates optimal free rehearsal slots given a list of student schedule slots
 */
export function computeGroupAvailabilityHeatmap(
  studentSchedules: { studentName: string; slots: TimeSlot[] }[]
) {
  const days: DayOfWeek[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
  const timeBlocks = [
    '07:00-09:00',
    '09:00-11:00',
    '11:00-13:00',
    '13:00-15:00',
    '15:00-17:00',
    '17:00-19:00',
    '19:00-21:00',
  ];

  const totalStudents = studentSchedules.length || 1;
  const heatmap: Record<string, Record<string, { busyCount: number; freeCount: number; freePercentage: number }>> = {};

  days.forEach((day) => {
    heatmap[day] = {};
    timeBlocks.forEach((block) => {
      const [blockStart, blockEnd] = block.split('-');

      let busyCount = 0;
      studentSchedules.forEach((student) => {
        const isBusy = student.slots.some(
          (s) => s.day === day && s.isAcademicClass && s.startTime < blockEnd && s.endTime > blockStart
        );
        if (isBusy) busyCount++;
      });

      const freeCount = totalStudents - busyCount;
      const freePercentage = Math.round((freeCount / totalStudents) * 100);

      heatmap[day][block] = {
        busyCount,
        freeCount,
        freePercentage,
      };
    });
  });

  return heatmap;
}
