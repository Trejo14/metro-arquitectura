import { sections } from '../../data/tour'

interface Props {
  route: string
  navigate: (r: string) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
  index: number
  total: number
  prev: string | null
  next: string | null
  fullscreen: boolean
  toggleFullscreen: () => void
}

export function TopBar({ route, navigate, theme, toggleTheme, index, total, prev, next, fullscreen, toggleFullscreen }: Props) {
  const current = route.startsWith('estacion/') ? 'mapa' : route
  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-bg/90 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-[100rem] items-center gap-3 px-3 py-2 sm:px-5">
        <button type="button" onClick={() => navigate('bienvenida')} className="flex shrink-0 items-center gap-2" aria-label="Metro Arquitectura: ir al inicio">
          <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden>
            <rect width="64" height="64" rx="14" className="fill-ink" />
            <path d="M12 44 H26 L38 20 H52" fill="none" stroke="#E5383B" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="44" r="6" className="fill-bg stroke-ink" strokeWidth="3" />
            <circle cx="52" cy="20" r="6" className="fill-bg stroke-ink" strokeWidth="3" />
          </svg>
          <span className="hidden font-cond text-xl font-bold uppercase tracking-wide xl:block">Metro Arquitectura</span>
        </button>

        <nav className="min-w-0 flex-1 overflow-x-auto" aria-label="Secciones">
          <ul className="flex gap-1">
            {sections.map((s) => (
              <li key={s.route}>
                <button
                  type="button"
                  onClick={() => navigate(s.route)}
                  aria-current={current === s.route ? 'page' : undefined}
                  title={s.label}
                  className={`whitespace-nowrap rounded-md px-2.5 py-1.5 font-semibold transition-colors ${
                    current === s.route ? 'bg-ink text-bg' : 'text-muted hover:bg-sunken hover:text-ink'
                  }`}
                >
                  {s.short}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <button type="button" className="btn !px-3" disabled={!prev} onClick={() => prev && navigate(prev)} aria-label="Parada anterior (flecha izquierda)">
            ←
          </button>
          <span className="hidden w-14 text-center font-cond text-lg font-bold tabular-nums sm:block" title="Parada actual del recorrido">
            {index + 1}/{total}
          </span>
          <button type="button" className="btn !px-3" disabled={!next} onClick={() => next && navigate(next)} aria-label="Siguiente parada (flecha derecha)">
            →
          </button>
          <button type="button" className="btn !px-3" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'} title="Modo claro / oscuro">
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <button type="button" className="btn hidden !px-3 sm:inline-flex" onClick={toggleFullscreen} aria-label={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'} title="Pantalla completa (F)">
            {fullscreen ? '⤡' : '⛶'}
          </button>
        </div>
      </div>
      {/* Avance del recorrido */}
      <div className="h-1 bg-rule" aria-hidden>
        <div className="h-full bg-ink transition-[width] duration-300" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
    </header>
  )
}
