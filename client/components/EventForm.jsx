// client/components/EventForm.jsx

'use client'

import { useState, useEffect } from 'react'

export default function EventForm({ evento, onCerrar, onGuardar, onEliminarLocal }) {
  // Reordenamos colores: verde (Basil), amarillo (Banana), rojo (Tomato), luego el resto
  const colorOptions = [
    { id: '10', label: 'Basil (Verde)', hex: '#51b749' },
    { id: '5', label: 'Banana (Amarillo)', hex: '#fbd75b' },
    { id: '11', label: 'Tomato (Rojo)', hex: '#dc2127' },
    { id: '1', label: 'Lavender', hex: '#a4bdfc' },
    { id: '2', label: 'Sage', hex: '#7ae7bf' },
    { id: '3', label: 'Grape', hex: '#dbadff' },
    { id: '4', label: 'Flamingo', hex: '#ff887c' },
    { id: '6', label: 'Tangerine', hex: '#ffb878' },
    { id: '7', label: 'Peacock', hex: '#46d6db' },
    { id: '8', label: 'Graphite', hex: '#e1e1e1' },
    { id: '9', label: 'Blueberry', hex: '#5484ed' }
  ]

  const [form, setForm] = useState({
    summary: '',
    description: '',
    location: '',
    start: { dateTime: '', timeZone: 'America/Argentina/Cordoba' },
    end: { dateTime: '', timeZone: 'America/Argentina/Cordoba' },
    reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 30 }] },
    colorId: '10' // predeterminado: verde (Basil)
  })

  useEffect(() => {
    if (evento) {
      setForm({
        summary: evento.summary || '',
        description: evento.description || '',
        location: evento.location || '',
        start: {
          dateTime: evento.start?.dateTime || '',
          timeZone: evento.start?.timeZone || 'America/Argentina/Cordoba'
        },
        end: {
          dateTime: evento.end?.dateTime || '',
          timeZone: evento.end?.timeZone || 'America/Argentina/Cordoba'
        },
        reminders: evento.reminders || { useDefault: false, overrides: [] },
        colorId: evento.colorId || '10'
      })
    }
  }, [evento])

  function handleChange(e) {
    const { name, value } = e.target

    if (['summary', 'description', 'location'].includes(name)) {
      setForm(prev => ({ ...prev, [name]: value }))
    }

    if (name === 'start') {
      setForm(prev => ({
        ...prev,
        start: { ...prev.start, dateTime: value }
      }))
    }

    if (name === 'end') {
      setForm(prev => ({
        ...prev,
        end: { ...prev.end, dateTime: value }
      }))
    }
  }

  function handleColorChange(e) {
    setForm(prev => ({ ...prev, colorId: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const method = evento ? 'PUT' : 'POST'
    const url = evento ? `/api/eventos/${evento.id}` : '/api/eventos'

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        onGuardar(data)
      })
      .catch(err => console.error('Error al guardar evento:', err))
  }

  function handleEliminar() {
    if (!evento) return
    fetch(`/api/eventos/${evento.id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          onEliminarLocal(evento.id)
          onCerrar()
        } else {
          console.error('No se pudo eliminar en backend')
        }
      })
      .catch(err => console.error(err))
  }

  return (
    <div className="card p-lg">
      <h3 className="m-b-md">{evento ? 'Editar Evento' : 'Crear Evento'}</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título</label>
          <input
            type="text"
            name="summary"
            className="form-input"
            value={form.summary}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            name="description"
            className="form-input"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Lugar</label>
          <input
            type="text"
            name="location"
            className="form-input"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 grid-gap-md">
          <div className="form-group">
            <label>Inicio</label>
            <input
              type="datetime-local"
              name="start"
              className="form-input"
              value={form.start.dateTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Fin</label>
            <input
              type="datetime-local"
              name="end"
              className="form-input"
              value={form.end.dateTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Color</label>
          <select
            name="colorId"
            className="form-input"
            value={form.colorId}
            onChange={handleColorChange}
          >
            {colorOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between items-center m-t-md">
          <button type="submit" className="btn btn-success">
            {evento ? 'Actualizar' : 'Crear'}
          </button>

          {evento && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleEliminar}
            >
              Eliminar
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCerrar}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
