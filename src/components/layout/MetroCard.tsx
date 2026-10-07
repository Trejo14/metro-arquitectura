import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { lineById } from '../../data/lines'
import { stations } from '../../data/stations'
import type { StationId } from '../../data/types'

interface Props {
  visited: StationId[]
  onGo: (id: StationId) => void
  onReset: () => void
}

/** Tarjeta de metro: se sella en cada estación visitada y muestra el avance del recorrido. */
export function MetroCard({ visited, onGo, onReset }: Props) {
  const [open, setOpen] = useState(false)
  const total = stations.length
  const count = visited.length
  const done = count === total

  return (
    <div className="fixed bottom-3 right-3 z-30 print:hidden sm:bottom-4 sm:right-4">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="mb-2 w-[19rem] origin-bottom-right overflow-hidden rounded-2xl border border-rule bg-panel shadow-xl"
          >
            <div className="bg-ink px-4 py-3 text-bg">
              <p className="font-cond text-xs font-semibold uppercase tracking-[0.2em] opacity-75">Tarjeta de viaje</p>
              <p className="text-lg font-bold leading-tight">Metro Arquitectura</p>
            </div>
            <ul className="grid grid-cols-2 gap-1.5 p-3">
              {stations.map((s) => {
                const line = lineById[s.line]
                const on = visited.includes(s.id)
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => onGo(s.id)}
                      className="flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left text-sm hover:bg-sunken"
                    >
                      <span
                        className="grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 text-[0.65rem] font-bold"
                        style={{ borderColor: line.color, background: on ? line.color : 'transparent', color: line.ink }}
                        aria-hidden
                      >
                        {on ? '✓' : ''}
                      </span>
                      <span className={on ? 'font-semibold' : 'text-muted'}>{s.shortName ?? s.name}</span>
                      <span className="sr-only">{on ? '(sellada)' : '(pendiente)'}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="flex items-center justify-between border-t border-rule px-4 py-2.5 text-sm">
              <span className="font-semibold">{done ? '¡Recorrido completo!' : `Faltan ${total - count} estaciones`}</span>
              <button type="button" className="text-muted underline underline-offset-2 hover:text-ink" onClick={onReset}>
                Borrar sellos
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Tarjeta de viaje: ${count} de ${total} estaciones visitadas`}
        className="ml-auto flex w-[13.5rem] flex-col gap-1.5 rounded-xl bg-ink px-3.5 py-2.5 text-left text-bg shadow-lg transition-transform hover:-translate-y-0.5"
      >
        <span className="flex items-baseline justify-between">
          <span className="font-cond text-xs font-semibold uppercase tracking-[0.2em] opacity-75">Tarjeta de viaje</span>
          <motion.span key={count} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="font-cond text-xl font-bold tabular-nums">
            {count}/{total}
          </motion.span>
        </span>
        <span className="flex gap-[3px]" aria-hidden>
          {stations.map((s) => (
            <span
              key={s.id}
              className="h-2.5 flex-1 rounded-[2px]"
              style={{ background: visited.includes(s.id) ? lineById[s.line].color : 'rgb(var(--bg) / 0.22)' }}
            />
          ))}
        </span>
      </button>
    </div>
  )
}
