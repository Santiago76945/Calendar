// client/app/layout.jsx

import '../styles/popup.css'
import '../styles/events.css'
import '../styles/unified.css'
import '../styles/globals.css'  // si tenés otros estilos

export const metadata = {
  title: 'Mi App de Calendario',
  description: 'Frontend para Google Calendar'
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
