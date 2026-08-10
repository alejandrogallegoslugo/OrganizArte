/**
 * Resend Email & Web Push Notifications Helper
 */

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendActivationEmail(toName: string, toEmail: string, companyName: string, discipline: string) {
  const subject = `🎉 ¡Tu cuenta en OrganizArte ha sido activada!`;
  const html = `
    <div style="font-family: sans-serif; background-color: #0f172a; color: #f8fafc; padding: 32px; border-radius: 12px;">
      <h2 style="color: #38bdf8;">¡Bienvenido(a) a OrganizArte, ${toName}!</h2>
      <p>Un administrador del Tec de Monterrey ha aprobado tu registro en la plataforma.</p>
      <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Compañía:</strong> ${companyName}</p>
        <p style="margin: 4px 0;"><strong>Disciplina:</strong> ${discipline}</p>
      </div>
      <p>Ahora puedes ingresar a la PWA móvil, subir tu horario con Inteligencia Artificial, revisar partituras/materiales y confirmar tu asistencia a los ensayos.</p>
      <a href="https://organizarte.tec.mx" style="display: inline-block; background: #0284c7; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 12px;">Ingresar a OrganizArte PWA</a>
    </div>
  `;
  console.log(`[Resend Mock Email Sent] to: ${toEmail}, subject: ${subject}`);
  return { success: true };
}

export async function sendRehearsalReminderEmail(toEmail: string, rehearsalTitle: string, date: string, time: string, location: string) {
  const subject = `🎺 Recordatorio de Ensayo: ${rehearsalTitle}`;
  const html = `
    <div style="font-family: sans-serif; background-color: #0f172a; color: #f8fafc; padding: 32px; border-radius: 12px;">
      <h2 style="color: #fbbf24;">Recordatorio de Ensayo Próximo</h2>
      <p>Tienes un ensayo programado:</p>
      <ul>
        <li><strong>Evento:</strong> ${rehearsalTitle}</li>
        <li><strong>Fecha:</strong> ${date} a las ${time}</li>
        <li><strong>Lugar:</strong> ${location}</li>
      </ul>
      <p>No olvides llevar tu celular con la PWA lista para escanear el código QR de asistencia.</p>
    </div>
  `;
  console.log(`[Resend Mock Email Sent] to: ${toEmail}, subject: ${subject}`);
  return { success: true };
}

export async function sendWebPushNotification(subscription: any, payload: { title: string; body: string; icon?: string }) {
  console.log('[WebPush Sent]', payload);
  return { success: true };
}
