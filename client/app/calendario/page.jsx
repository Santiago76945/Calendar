// client/app/calendario/page.jsx

'use client'

import { useEffect, useState } from 'react'
import CalendarList from '../../components/CalendarList'
import EventForm from '../../components/EventForm'

export default function CalendarioPage() {
  const [eventos, setEventos] = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [eventoEditar, setEventoEditar] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setCargando(true)
    setError(null)

    fetch('http://localhost:4000/api/eventos')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          setEventos(data)
        } else {
          console.error('Respuesta inesperada de la API:', data)
          setEventos([])
          setError('La respuesta del servidor no era un arreglo de eventos.')
        }
      })
      .catch(err => {
        console.error('Error al cargar eventos:', err)
        setEventos([])
        setError('No se pudieron cargar los eventos.')
      })
      .finally(() => {
        setCargando(false)
      })
  }, [])

  const handleEliminarLocal = (id) => {
    setEventos(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="flex-col p-md">
      <header className="flex justify-between items-center m-b-md">
        <h2 className="title">Agenda de Eventos</h2>
        <a href="/" className="btn btn-secondary">
          ← Volver al Menú
        </a>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEventoEditar(null)
            setMostrarForm(true)
          }}
        >
          Añadir evento
        </button>
      </header>

      {cargando && <p className="text-muted">Cargando eventos...</p>}
      {error && <p className="text-muted">{error}</p>}

      {!cargando && !error && (
        <div className="events-container">
          <CalendarList
            eventos={eventos}
            onEditar={(ev) => {
              setEventoEditar(ev)
              setMostrarForm(true)
            }}
            onEliminar={(id) => {
              fetch(`http://localhost:4000/api/eventos/${id}`, { method: 'DELETE' })
                .then(res => {
                  if (res.ok) handleEliminarLocal(id)
                  else console.error('No se pudo eliminar')
                })
                .catch(err => console.error(err))
            }}
          />
        </div>
      )}

      {mostrarForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Botón de cerrar (esquina superior derecha) */}
            <button
              className="modal-close-btn"
              onClick={() => setMostrarForm(false)}
              aria-label="Cerrar modal"
            >
              ×
            </button>

            <EventForm
              evento={eventoEditar}
              onCerrar={() => setMostrarForm(false)}
              onGuardar={(nuevoOActualizado) => {
                setEventos(prev => {
                  const idx = prev.findIndex(e => e.id === nuevoOActualizado.id)
                  if (idx > -1) {
                    const copia = [...prev]
                    copia[idx] = nuevoOActualizado
                    return copia
                  }
                  return [...prev, nuevoOActualizado]
                })
                setMostrarForm(false)
              }}
              onEliminarLocal={handleEliminarLocal}
            />
          </div>
        </div>
      )}
    </div>
  )
}
