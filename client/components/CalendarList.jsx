// client/components/CalendarList.jsx

'use client'

import React from 'react'

export default function CalendarList({ eventos, onEditar, onEliminar }) {
  if (!Array.isArray(eventos) || eventos.length === 0) {
    return <p className="text-muted">No hay eventos próximos.</p>
  }

  // Mapeo de colorId → { label, hex }
  const colorMap = {
    '1':  { label: 'Lavender',   hex: '#a4bdfc' },
    '2':  { label: 'Sage',       hex: '#7ae7bf' },
    '3':  { label: 'Grape',      hex: '#dbadff' },
    '4':  { label: 'Flamingo',   hex: '#ff887c' },
    '5':  { label: 'Banana',     hex: '#fbd75b' },
    '6':  { label: 'Tangerine',  hex: '#ffb878' },
    '7':  { label: 'Peacock',    hex: '#46d6db' },
    '8':  { label: 'Graphite',   hex: '#e1e1e1' },
    '9':  { label: 'Blueberry',  hex: '#5484ed' },
    '10': { label: 'Basil',      hex: '#51b749' },
    '11': { label: 'Tomato',     hex: '#dc2127' }
  }

  // Convierte minutos a un formato legible: días, horas, minutos
  function formatMinutes(minutosTotal) {
    const dias = Math.floor(minutosTotal / 1440)
    const restoDespuesDias = minutosTotal % 1440
    const horas = Math.floor(restoDespuesDias / 60)
    const minutos = restoDespuesDias % 60

    const partes = []
    if (dias > 0) {
      partes.push(dias === 1 ? '1 día' : `${dias} días`)
    }
    if (horas > 0) {
      partes.push(horas === 1 ? '1 hora' : `${horas} horas`)
    }
    if (minutos > 0) {
      partes.push(minutos === 1 ? '1 minuto' : `${minutos} minutos`)
    }

    // Si no hay días ni horas, y minutos = 0 (caso 0), mostrar "0 minutos"
    if (partes.length === 0) {
      partes.push('0 minutos')
    }

    return partes.join(' ')
  }

  return (
    <ul className="list-reset">
      {eventos.map(ev => {
        const colorInfo = colorMap[ev.colorId] || { label: 'Default', hex: '#ffffff' }
        const overrides = ev.reminders?.overrides || []

        return (
          <li
            key={ev.id}
            className="card flex justify-between items-start m-b-sm"
            style={{
              backgroundColor: '#ffffff',
              borderLeft: `4px solid ${colorInfo.hex}`
            }}
          >
            <div className="flex-col">
              <h3 className="m-b-xs">{ev.summary}</h3>
              <p className="text-muted">
                {new Date(ev.start.dateTime).toLocaleString()} –{' '}
                {new Date(ev.end.dateTime).toLocaleString()}
              </p>
              {ev.location && (
                <p className="text-muted">Lugar: {ev.location}</p>
              )}
              <p className="text-muted">Color del evento: {colorInfo.label}</p>

              {overrides.length > 0 ? (
                <div className="m-t-xs">
                  <p className="text-muted"><strong>Recordatorios:</strong></p>
                  <ul className="text-muted m-l-md">
                    {overrides.map((r, idx) => (
                      <li key={idx}>
                        {`${formatMinutes(r.minutes)} antes`} ({r.method})
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-muted m-t-xs">
                  Recordatorios: No hay recordatorios configurados
                </p>
              )}
            </div>

            <div className="flex items-center">
              <button
                className="btn btn-secondary m-r-xs"
                onClick={() => onEditar(ev)}
              >
                Editar
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => onEliminar(ev.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
