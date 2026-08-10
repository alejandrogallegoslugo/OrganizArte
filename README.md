# 🎭 OrganizArte - Sistema de Gestión para la Compañía Artística (Tec de Monterrey)

Plataforma monorepo para administración, coordinación y gestión de integrantes de la Compañía Artística del Tecnológico de Monterrey (Ensamble Musical, Comedia Musical, Grupo de Baile, Teatro y Staff).

---

## ⚡ Stack Tecnológico

- **Monorepo**: Turborepo + npm workspaces (`apps/admin`, `apps/student`, `packages/*`).
- **Portal Administrador**: Vite + React + TypeScript + Glassmorphism UI (Puerto `3000`).
- **Portal Alumno (PWA Móvil)**: Vite + React + TypeScript + PWA + Service Worker Push (Puerto `3001`).
- **Base de Datos**: Neon Postgres (Drizzle ORM en `packages/db`).
- **Autenticación**: Neon Auth (con control de estado `PENDING_APPROVAL` / `ACTIVE`).
- **Inteligencia Artificial OCR**: Google Gemini 2.5 Flash (`packages/ai-parser`) para extracción automática de materias y horarios a partir de capturas o PDFs de MiTec.
- **Notificaciones**: Web Push API (PWA iOS 16.4+ & Android) + Resend Transaccional (`packages/notifications`).
- **Almacenamiento**: Cloudflare R2 (PDFs de partituras y guías de audio).

---

## 📁 Estructura del Proyecto

```text
OrganizArte/
├── apps/
│   ├── admin/             # Dashboard para Directores y Staff
│   └── student/           # PWA Móvil para Alumnos e Integrantes
├── packages/
│   ├── shared/            # Tipos de dominio, DTOs y validaciones
│   ├── db/                # Drizzle ORM + Neon Postgres Schemas
│   ├── ai-parser/         # Integración OCR con Google Gemini 2.5 Flash
│   └── notifications/     # Resend email & Web Push helpers
├── package.json
└── README.md
```

---

## 🚀 Cómo Ejecutar en Desarrollo

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar Portal Administrador** (http://localhost:3000):
   ```bash
   npm run dev:admin
   ```

3. **Ejecutar Portal Alumno PWA Móvil** (http://localhost:3001):
   ```bash
   npm run dev:student
   ```

4. **Compilar Monorepo Completo**:
   ```bash
   npm run build
   ```

---

## ⚙️ Variables de Entorno Recomendadas (`.env`)

```env
# Neon Postgres
DATABASE_URL="postgres://user:password@ep-cool-name.neon.tech/organizarte?sslmode=require"

# Google Gemini Vision API (Lectura de Horarios MiTec)
GEMINI_API_KEY="AIzaSy..."

# Resend API Key (Correos Transaccionales y Recordatorios)
RESEND_API_KEY="re_123456789..."

# Cloudflare R2 Bucket (Partituras & Audio)
CLOUDFLARE_R2_ACCOUNT_ID="..."
CLOUDFLARE_R2_ACCESS_KEY="..."
CLOUDFLARE_R2_SECRET_KEY="..."
```
