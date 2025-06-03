# Mi App de Calendario

Una aplicación full-stack para gestionar eventos usando Google Calendar.  
El frontend está construido con Next.js (v15) y Tailwind CSS; el backend utiliza Express y la API de Google Calendar.

---

## 📦 Estructura del proyecto

```

/
├── client/                 # Frontend Next.js
│   ├── public/
│   ├── src/ (o app/)       # Páginas, componentes, estilos, etc.
│   ├── package.json
│   ├── tailwind.config.js
│   └── …
│
├── server/                 # Backend Express + Google Calendar Service
│   ├── config/
│   │   └── config.js       # Variables de entorno: CLIENT\_ID, CLIENT\_SECRET, etc.
│   ├── controllers/
│   │   └── calendarController.js
│   ├── middlewares/
│   │   └── authMiddleware.js  # (si aplica para rutas protegidas)
│   ├── routes/
│   │   └── calendarRoutes.js  # CRUD de `/api/eventos`
│   ├── services/
│   │   └── googleCalendarService.js  # Lógica de interacción con Google Calendar
│   ├── app.js               # Servidor Express
│   ├── package.json
│   └── …
│
├── .gitignore
├── README.md                # ← (este archivo)
└── package.json             # Scripts raíz (concurrently, instalación unificada)

````

---

## 🔧 Prerrequisitos

1. **Node.js** ≥ 18.x
2. **npm** (incluido con Node.js)  
3. Cuenta de Google con acceso a Google Calendar.
4. Proyecto en Google Cloud Console habilitando la API de Calendar y obteniendo:
   - `CLIENT_ID`
   - `CLIENT_SECRET`
   - `REFRESH_TOKEN` (se genera intercambiando un código OAuth)
   - `CALENDAR_ID` (por ejemplo, tu correo u otro ID de calendario)
   - `REDIRECT_URI` (e.g., `http://localhost:4000/oauth2callback`)

---

## ⚙️ Configuración de variables de entorno

En la raíz del proyecto (junto a este README), creá un archivo `.env` con estas variables:

```dotenv
# backend (server/.env)
GCAL_CLIENT_ID=tu_client_id_de_google
GCAL_CLIENT_SECRET=tu_client_secret_de_google
GCAL_REDIRECT_URI=http://localhost:4000/oauth2callback
GCAL_REFRESH_TOKEN=tu_refresh_token
CALENDAR_ID=tu_calendar_id
TIMEZONE=America/Argentina/Cordoba

# (si tenés otras configuraciones, agrégalas aquí)
````

> **Cómo obtener el `REFRESH_TOKEN`:**
>
> 1. En Google Cloud Console, creá credenciales OAuth 2.0 para aplicación de escritorio o web.
> 2. Poné en “Authorized redirect URIs”: `http://localhost:4000/oauth2callback`.
> 3. Usá el endpoint `/oauth2callback?code=…` para intercambiar el código y copiar el `refresh_token`.
> 4. Pega ese `refresh_token` en este `.env`.

---

## 📥 Instalación

Desde la raíz del proyecto, ejecutá:

```bash
# 1. Instalar dependencias raíz (concurrently, express, cors, googleapis)
npm install

# 2. Instalar dependencias del frontend (Next.js, React, Tailwind)
npm install --prefix client

# 3. Instalar dependencias del backend (Express, dotenv, googleapis, cors)
npm install --prefix server
```

> **Explicación:**
>
> * `npm install` en la raíz instala las dependencias que están definidas en `package.json` principal (como `concurrently`).
> * Luego, instalamos por separado en `client/` y `server/` para asegurarnos de que cada parte tenga sus propias librerías.

---

## 🚀 Scripts disponibles

Desde la raíz (carpeta `/Calendar`):

```bash
# Levantar ambos servidores (frontend y backend) en paralelo
npm run dev
```

* **Frontend** correrá en `http://localhost:3000`.
* **Backend** correrá en `http://localhost:4000`.

Si preferís correr cada uno por separado:

```bash
# Solo frontend
npm run dev --prefix client

# Solo backend
npm run dev --prefix server
```

Dentro de **client/**:

```bash
cd client
npm run dev     # Levanta Next.js en modo desarrollo (puerto 3000)
npm run build   # Compila Next.js para producción
npm run start   # Corre Next.js en modo producción (requiere haber hecho build)
```

Dentro de **server/**:

```bash
cd server
npm run dev     # (si definiste un script "dev": "node app.js") 
```

---

## 📝 Descripción general del funcionamiento

1. **Frontend (Next.js)**

   * Contiene dos vistas principales:

     * **/calendario:** Muestra lista de eventos próximos, con opciones para crear, editar o eliminar.
     * **/import-export:** Permite pegar JSON de uno o varios eventos para importarlos a Google Calendar vía API.
   * Usa componentes como `CalendarList.jsx` y `EventForm.jsx` para interactuar con la API REST en `/api/eventos`.

2. **Backend (Express + Google Calendar API)**

   * Expone rutas en `/api/eventos` para:

     * `GET /api/eventos` → obtener próximos 50 eventos del calendario.
     * `POST /api/eventos` → crear un evento nuevo (JSON en body).
     * `PUT /api/eventos/:id` → actualizar evento existente.
     * `DELETE /api/eventos/:id` → eliminar evento.
   * En `googleCalendarService.js` se maneja la lógica de OAuth2 y llamadas a `google.calendar(...)`.
   * `config/config.js` lee las variables de entorno.

---

## 📅 Ejemplo de JSON para crear/actualizar un evento

```jsonc
{
  "summary": "Reunión de Prueba",
  "description": "Revisar avances del proyecto",
  "location": "Zoom",
  "start": {
    "dateTime": "2025-06-10T14:00:00",
    "timeZone": "America/Argentina/Cordoba"
  },
  "end": {
    "dateTime": "2025-06-10T15:00:00",
    "timeZone": "America/Argentina/Cordoba"
  },
  "reminders": {
    "useDefault": false,
    "overrides": [
      { "method": "popup", "minutes": 30 },
      { "method": "email", "minutes": 1440 }
    ]
  },
  "colorId": "5"
}
```

* Campos obligatorios:

  * `summary` (título)
  * `start.dateTime`
  * `end.dateTime`

* Campos opcionales:

  * `description`, `location`, `reminders`, `colorId`.

---

## 📑 Configuración de `.gitignore`

Asegurate de tener un `.gitignore` en la raíz con al menos:

```gitignore
# Ignorar node_modules en cualquier subfolder
**/node_modules/

# Ignorar compilados de Next.js
**/.next/
**/out/
**/.vercel/

# Archivos de entorno
*.env
**/*.env

# Logs
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

# Archivos del sistema y editores
.DS_Store
Thumbs.db
.vscode/
.idea/

# Build folders
build/
dist/
```

De esta forma nunca subirás dependencias ni archivos de configuración locales.

---

## 🛠️ Cómo usar la aplicación

1. Corroborar que las variables en `.env` estén correctamente configuradas.

2. Ejecutar en terminales separadas (o con `npm run dev` en raíz):

   ```bash
   # Terminal 1: Frontend
   npm run dev --prefix client

   # Terminal 2: Backend
   npm run dev --prefix server
   ```

3. Abrir el navegador en `http://localhost:3000`.

4. Navegar a “Ver Calendario” para listar/agregar/editar/eliminar eventos.

5. O ir a “Importar / Exportar Eventos” para pegar JSON y hacer import masivo.

---

## 📝 Notas finales

* Asegurate de que tu `REFRESH_TOKEN` tenga permisos (scope) para leer y escribir eventos.
* El backend por defecto corre en puerto `4000`. Si cambiaslo, ajustá las llamadas `fetch('/api/eventos')` en el frontend a la URL correcta (e.g., `http://localhost:4000/api/eventos`).
* Para producción, construí el frontend con `npm run build --prefix client` y luego `npm run start --prefix client`. Podés desplegar el backend en algún servidor Node.js (Heroku, Vercel Serverless Functions u otro).

