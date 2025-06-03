// server/routes/calendarRoutes.js

const express = require('express')
const router = express.Router()
const {
  obtenerEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento
} = require('../services/googleCalendarService')

// GET /api/eventos
router.get('/', async (req, res) => {
  try {
    const eventos = await obtenerEventos()
    res.json(eventos)
  } catch (error) {
    res.status(500).json({ error: 'Error al listar eventos' })
  }
})

// POST /api/eventos
router.post('/', async (req, res) => {
  console.log('POST recibido:', req.body)
  try {
    // req.body.reminders ya debe ser { useDefault, overrides } o undefined
    const nuevo = await crearEvento(req.body)
    res.status(201).json(nuevo)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear evento' })
  }
})

// PUT /api/eventos/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const actualizado = await actualizarEvento(id, req.body)
    res.json(actualizado)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar evento' })
  }
})

// DELETE /api/eventos/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    await eliminarEvento(id)
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar evento' })
  }
})

module.exports = router
