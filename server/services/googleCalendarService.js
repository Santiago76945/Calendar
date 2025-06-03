// server/services/googleCalendarService.js

const { google } = require('googleapis')
const {
  GCAL_CLIENT_ID,
  GCAL_CLIENT_SECRET,
  GCAL_REDIRECT_URI,
  GCAL_REFRESH_TOKEN,
  CALENDAR_ID,
  TIMEZONE
} = require('../config/config')

// 1. Configuramos OAuth2Client
const oAuth2Client = new google.auth.OAuth2(
  GCAL_CLIENT_ID,
  GCAL_CLIENT_SECRET,
  GCAL_REDIRECT_URI
)

// 2. Si ya tenés refresh token en .env, lo seteamos
if (GCAL_REFRESH_TOKEN) {
  oAuth2Client.setCredentials({ refresh_token: GCAL_REFRESH_TOKEN })
}

// 3. Instanciamos la API de Calendar con ese OAuth2Client
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

/**
 * Obtiene la lista de eventos próximos (hasta 50),
 * incluyendo explícitamente el campo `reminders`.
 */
async function obtenerEventos() {
  try {
    const res = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime',
      fields: 'items(id,summary,location,start,end,colorId,reminders)'
    })
    console.log('Eventos obtenidos (con reminders):', JSON.stringify(res.data.items, null, 2))
    return res.data.items
  } catch (error) {
    console.error('Error al obtener eventos:', error)
    throw error
  }
}

/**
 * Crea un nuevo evento.
 */
async function crearEvento(data) {
  try {
    const recurso = {
      summary: data.summary,
      description: data.description,
      location: data.location,
      start: {
        dateTime: data.start.dateTime,
        timeZone: data.start.timeZone || TIMEZONE
      },
      end: {
        dateTime: data.end.dateTime,
        timeZone: data.end.timeZone || TIMEZONE
      },
      // data.reminders debe venir ya en forma de:
      // { useDefault: boolean, overrides: [ { method, minutes }, ... ] }
      reminders: data.reminders,
      colorId: data.colorId
    }

    // Logueamos el recurso completo como JSON para que no se escondan los objetos anidados
    console.log('Evento a enviar a Google (recurso completo):\n', JSON.stringify(recurso, null, 2))

    const res = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: recurso
    })

    // Logueamos la respuesta completa de Google, incluyendo los reminders que guardó
    console.log('Respuesta de Google (evento creado):\n', JSON.stringify(res.data, null, 2))

    return res.data
  } catch (error) {
    console.error('Error al crear evento:', error)
    throw error
  }
}

/**
 * Actualiza un evento existente por su ID.
 */
async function actualizarEvento(id, data) {
  try {
    const recurso = {
      summary: data.summary,
      description: data.description,
      location: data.location,
      start: {
        dateTime: data.start.dateTime,
        timeZone: data.start.timeZone || TIMEZONE
      },
      end: {
        dateTime: data.end.dateTime,
        timeZone: data.end.timeZone || TIMEZONE
      },
      reminders: data.reminders,
      colorId: data.colorId
    }

    console.log('Evento a actualizar (recurso completo):\n', JSON.stringify(recurso, null, 2))

    const res = await calendar.events.update({
      calendarId: CALENDAR_ID,
      eventId: id,
      resource: recurso
    })

    console.log('Respuesta de Google (evento actualizado):\n', JSON.stringify(res.data, null, 2))

    return res.data
  } catch (error) {
    console.error('Error al actualizar evento:', error)
    throw error
  }
}

/**
 * Elimina un evento por su ID.
 */
async function eliminarEvento(id) {
  try {
    await calendar.events.delete({
      calendarId: CALENDAR_ID,
      eventId: id
    })
    return { success: true }
  } catch (error) {
    console.error('Error al eliminar evento:', error)
    throw error
  }
}

module.exports = {
  obtenerEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento
}
