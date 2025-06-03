// server/app.js

require('dotenv').config()            // 1. Cargar .env
const express = require('express')
const cors = require('cors')
const { google } = require('googleapis')

const {
  GCAL_CLIENT_ID,
  GCAL_CLIENT_SECRET,
  GCAL_REDIRECT_URI,
  GCAL_REFRESH_TOKEN
} = require('./config/config')        // 2. Leer credenciales desde config/config.js

const calendarRoutes = require('./routes/calendarRoutes') // 3. Importar rutas CRUD para eventos

const app = express()
app.use(cors())
app.use(express.json())

/**
 * 4. Ruta opcional para intercambiar "code" por tokens.
 *    Solo se usa la primera vez para obtener el refresh_token.
 */
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code
  if (!code) {
    return res.status(400).send('Falta el parámetro ?code')
  }

  try {
    // Crear un cliente OAuth2 para intercambiar el "code"
    const oAuth2Client = new google.auth.OAuth2(
      GCAL_CLIENT_ID,
      GCAL_CLIENT_SECRET,
      GCAL_REDIRECT_URI
    )

    const { tokens } = await oAuth2Client.getToken(code)
    // tokens.refresh_token es lo que luego pegás en tu .env
    return res.json(tokens)
  } catch (err) {
    console.error('Error en /oauth2callback:', err)
    return res.status(500).send('Error al intercambiar code por token')
  }
})

/**
 * 5. Montar las rutas de eventos en /api/eventos.
 *    Estas rutas (calendarRoutes) harán GET, POST, PUT, DELETE
 *    usando googleCalendarService.js para comunicarse con Google Calendar.
 */
app.use('/api/eventos', calendarRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
