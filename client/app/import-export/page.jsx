// client/app/import-export/page.jsx

'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ImportExportPage() {
  const [jsonInput, setJsonInput] = useState('')
  const [resultado, setResultado] = useState(null)
  const [errorParseo, setErrorParseo] = useState(null)
  const [importando, setImportando] = useState(false)
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(false)

  function validarEvento(obj) {
    if (typeof obj.summary !== 'string' || obj.summary.trim() === '') {
      return 'Falta campo "summary" o está vacío'
    }
    if (
      !obj.start ||
      typeof obj.start.dateTime !== 'string' ||
      obj.start.dateTime.trim() === ''
    ) {
      return 'Falta "start.dateTime" o está vacío'
    }
    if (
      !obj.end ||
      typeof obj.end.dateTime !== 'string' ||
      obj.end.dateTime.trim() === ''
    ) {
      return 'Falta "end.dateTime" o está vacío'
    }
    return null
  }

  async function handleImportar() {
    setErrorParseo(null)
    setResultado(null)

    let parsed
    try {
      parsed = JSON.parse(jsonInput)
    } catch (err) {
      setErrorParseo('JSON inválido: ' + err.message)
      return
    }

    const eventosArray = Array.isArray(parsed) ? parsed : [parsed]
    setImportando(true)

    const exitos = []
    const errores = []

    for (let i = 0; i < eventosArray.length; i++) {
      const ev = eventosArray[i]
      const msgValidacion = validarEvento(ev)
      if (msgValidacion) {
        errores.push({
          index: i,
          mensaje: msgValidacion
        })
        continue
      }

      // Construimos remindersField aceptando array o ya un objeto completo
      let remindersField = undefined

      if (Array.isArray(ev.reminders)) {
        remindersField = {
          useDefault: false,
          overrides: ev.reminders.filter(
            r =>
              r &&
              (r.method === 'popup' || r.method === 'email') &&
              typeof r.minutes === 'number'
          )
        }
      } else if (
        ev.reminders &&
        typeof ev.reminders === 'object' &&
        typeof ev.reminders.useDefault === 'boolean' &&
        (Array.isArray(ev.reminders.overrides) || ev.reminders.useDefault === true)
      ) {
        // Asume que ev.reminders ya tiene { useDefault, overrides }
        remindersField = {
          useDefault: ev.reminders.useDefault,
          overrides: Array.isArray(ev.reminders.overrides)
            ? ev.reminders.overrides.filter(
                r =>
                  r &&
                  (r.method === 'popup' || r.method === 'email') &&
                  typeof r.minutes === 'number'
              )
            : []
        }
      }

      const cuerpo = {
        summary: ev.summary,
        description:
          typeof ev.description === 'string' ? ev.description : undefined,
        location: typeof ev.location === 'string' ? ev.location : undefined,
        start: {
          dateTime: ev.start.dateTime,
          timeZone: ev.start.timeZone || undefined
        },
        end: {
          dateTime: ev.end.dateTime,
          timeZone: ev.end.timeZone || undefined
        },
        reminders: remindersField,
        colorId: ev.colorId || undefined
      }

      // Eliminar keys undefined
      Object.keys(cuerpo).forEach((key) => {
        if (cuerpo[key] === undefined) delete cuerpo[key]
      })
      if (cuerpo.start && !cuerpo.start.timeZone) delete cuerpo.start.timeZone
      if (cuerpo.end && !cuerpo.end.timeZone) delete cuerpo.end.timeZone

      try {
        console.log('Cuerpo enviado al backend:', cuerpo)
        const res = await fetch('/api/eventos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cuerpo)
        })
        if (!res.ok) {
          const errText = await res.text().catch(() => res.statusText)
          errores.push({
            index: i,
            mensaje: `HTTP ${res.status}: ${errText}`
          })
        } else {
          const creado = await res.json()
          exitos.push({ index: i, id: creado.id })
        }
      } catch (err) {
        errores.push({
          index: i,
          mensaje: err.message
        })
      }
    }

    setResultado({ exitos, errores })
    setImportando(false)
  }

  return (
    <div className="flex-col p-md">
      <header className="flex justify-between items-center m-b-md">
        <div className="flex items-center gap-md">
          <h2 className="title">Importar / Exportar Eventos</h2>
          <Link href="/" className="btn btn-secondary">
            ← Volver al Menú
          </Link>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => setMostrarInstrucciones(true)}
        >
          Ver Instrucciones
        </button>
      </header>

      <div className="card p-md">
        <p className="text-muted m-b-md">
          Pega aquí uno o varios objetos JSON de eventos. Cada objeto puede
          tener estos campos:
        </p>
        <ul className="text-muted m-b-md">
          <li>
            <strong>summary</strong> (obligatorio)
          </li>
          <li>
            <strong>description</strong> (opcional)
          </li>
          <li>
            <strong>location</strong> (opcional)
          </li>
          <li>
            <strong>start</strong>: objeto con <code>dateTime</code>{' '}
            (obligatorio) y <code>timeZone</code> (opcional)
          </li>
          <li>
            <strong>end</strong>: objeto con <code>dateTime</code> (obligatorio)
            y <code>timeZone</code> (opcional)
          </li>
          <li>
            <strong>reminders</strong>: objeto o arreglo (opcional). Puede ser:
            <ul className="m-l-md">
              <li>
                Un arreglo: <code>[ { '{ method: "popup"|"email", minutes: número }' } ]</code>
                {' '}→ se convertirá en <code>{'{ useDefault: false, overrides: [...] }'}</code>
              </li>
              <li>
                Un objeto ya completo: <code>{'{ useDefault: boolean, overrides: [...] }'}</code>
              </li>
            </ul>
          </li>
          <li>
            <strong>colorId</strong>: código del 1 al 11 (opcional)
          </li>
        </ul>

        <textarea
          className="import-textarea m-b-md"
          placeholder="Pega tu JSON aquí..."
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />

        {errorParseo && (
          <p className="text-muted m-b-sm" style={{ color: '#c00' }}>
            {errorParseo}
          </p>
        )}

        <button
          className="btn btn-primary"
          disabled={importando}
          onClick={handleImportar}
        >
          {importando ? 'Importando...' : 'Importar Eventos'}
        </button>
      </div>

      {resultado && (
        <div className="m-t-lg">
          {resultado.exitos.length > 0 && (
            <div className="card card-primary p-md m-b-md">
              <p className="m-b-xs">
                <strong>Éxitos:</strong>
              </p>
              <ul className="text-muted">
                {resultado.exitos.map((e) => (
                  <li key={e.index}>
                    Evento #{e.index + 1} creado con ID: {e.id}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {resultado.errores.length > 0 && (
            <div className="card card-accent p-md">
              <p className="m-b-xs" style={{ color: '#c00' }}>
                <strong>Errores:</strong>
              </p>
              <ul className="text-muted">
                {resultado.errores.map((e) => (
                  <li key={e.index}>
                    Evento #{e.index + 1}: {e.mensaje}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {resultado.exitos.length === 0 &&
            resultado.errores.length === 0 && (
              <p className="text-muted">No se procesaron eventos.</p>
            )}
        </div>
      )}

      {mostrarInstrucciones && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close-btn"
              onClick={() => setMostrarInstrucciones(false)}
              aria-label="Cerrar instrucciones"
            >
              ×
            </button>

            <h3 className="m-b-md">Instrucciones para JSON</h3>
            <p className="text-muted m-b-md">Ejemplo de un solo evento:</p>
            <pre className="text-muted card-nested m-b-md p-sm">
{`{
  "summary": "Reunión con Cliente",
  "description": "Discutir proyecto",
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
}`}
            </pre>

            <p className="text-muted m-b-md">Ejemplo de múltiples eventos:</p>
            <pre className="text-muted card-nested p-sm">
{`[
  {
    "summary": "Evento A",
    "start": {
      "dateTime": "2025-06-11T09:00:00",
      "timeZone": "America/Argentina/Cordoba"
    },
    "end": {
      "dateTime": "2025-06-11T10:00:00",
      "timeZone": "America/Argentina/Cordoba"
    },
    "reminders": {
      "useDefault": false,
      "overrides": [
        { "method": "popup", "minutes": 15 }
      ]
    }
  },
  {
    "summary": "Evento B",
    "start": { "dateTime": "2025-06-12T11:00:00" },
    "end": { "dateTime": "2025-06-12T12:30:00" }
  }
]`}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
