// client/app/page.jsx

import Link from 'next/link'

export default function Home() {
  return (
    <div className="main-menu-card">
      <header className="header">
        <h1 className="title">Kalendario</h1>
        <h2>Una aplicación de Santiago Haspert</h2>
      </header>

      <div className="menu">
        <Link href="/calendario">
          <div className="action">Ver calendario</div>
        </Link>

        <Link href="/import-export">
          <div className="action">Importar y exportar eventos</div>
        </Link>
      </div>

      <h4>
        Prototipo de uso personal. Su reproducción total o parcial está prohibida. © 2025 Santiago Haspert. Todos los derechos reservados.
      </h4>
    </div>
  )
}
