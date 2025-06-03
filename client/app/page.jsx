// client/app/page.jsx

import Link from 'next/link'

export default function Home() {
  return (
    <div className="main-menu-card">
      <header className="header">
        <h1 className="title">Mi App de Calendario</h1>
      </header>

      <div className="menu">
        <Link href="/calendario">
          <div className="action">Ver Calendario</div>
        </Link>

        <Link href="/import-export">
          <div className="action">Importar / Exportar Eventos</div>
        </Link>
      </div>
    </div>
  )
}
