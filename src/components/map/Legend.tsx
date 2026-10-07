import { lines } from '../../data/lines'
import type { LineId } from '../../data/types'

interface Props {
  focusLine?: LineId | null
  onFocusLine?: (id: LineId | null) => void
}

/** Leyenda del mapa: líneas (filtrables al pasar el cursor o dar clic) y símbolos. */
export function Legend({ focusLine = null, onFocusLine }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
      <ul className="flex flex-wrap gap-2">
        {lines.map((l) => (
          <li key={l.id}>
            <button
              type="button"
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left transition-colors ${
                focusLine === l.id ? 'border-ink bg-sunken' : 'border-rule bg-panel hover:bg-sunken'
              }`}
              aria-pressed={focusLine === l.id}
              onClick={() => onFocusLine?.(focusLine === l.id ? null : l.id)}
            >
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-base font-bold"
                style={{ background: l.color, color: l.ink }}
              >
                {l.number}
              </span>
              <span className="font-semibold leading-tight">
                {l.name}
                {l.underConstruction && <span className="ml-1.5 font-cond text-xs uppercase tracking-wider text-muted">en construcción</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
        <li className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
            <circle cx="11" cy="11" r="7" className="fill-panel stroke-muted" strokeWidth="3.5" />
          </svg>
          Estación
        </li>
        <li className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
            <circle cx="13" cy="13" r="10" className="fill-panel stroke-ink" strokeWidth="3" />
            <circle cx="13" cy="13" r="4.5" fill="none" className="stroke-muted" strokeWidth="2.5" />
          </svg>
          Transbordo
        </li>
        <li className="flex items-center gap-2">
          <svg width="34" height="12" viewBox="0 0 34 12" aria-hidden>
            <rect x="1" y="1" width="32" height="10" rx="3.5" className="fill-ink" />
            <rect x="5" y="3.5" width="5" height="4" rx="1" className="fill-panel" />
            <rect x="14.5" y="3.5" width="5" height="4" rx="1" className="fill-panel" />
            <rect x="24" y="3.5" width="5" height="4" rx="1" className="fill-panel" />
          </svg>
          Tren = petición
        </li>
      </ul>
    </div>
  )
}
