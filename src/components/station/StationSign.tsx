import { useEffect, useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { lineById } from '../../data/lines'
import { stationById, stations } from '../../data/stations'
import type { Station, StationId } from '../../data/types'
import { FlowDiagram } from './FlowDiagram'
import { Ratings } from './Ratings'

interface Props {
  station: Station
  onClose: () => void
  onGo: (id: StationId) => void
}

function Block({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={className}>
      <h3 className="eyebrow mb-2">{title}</h3>
      {children}
    </section>
  )
}

function Bullets({ items, mark, tone }: { items: string[]; mark: string; tone: string }) {
  return (
    <ul className="grid gap-1.5">
      {items.map((t) => (
        <li key={t} className="grid grid-cols-[1.25rem_1fr] gap-1.5 leading-snug">
          <span className={`font-bold ${tone}`} aria-hidden>
            {mark}
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}

/** Letrero de estación: plantilla única para todas las arquitecturas. */
export function StationSign({ station, onClose, onGo }: Props) {
  const line = lineById[station.line]
  const sameLine = stations.filter((s) => s.line === station.line)
  const position = sameLine.findIndex((s) => s.id === station.id) + 1
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
    scroller.current?.focus()
  }, [station.id])

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-start justify-center bg-black/55 p-0 backdrop-blur-[2px] sm:p-4 lg:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={scroller}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Estación ${station.name}`}
        className="max-h-screen w-full max-w-[92rem] overflow-y-auto bg-panel shadow-2xl outline-none sm:max-h-[calc(100vh-2rem)] sm:rounded-2xl lg:max-h-[calc(100vh-3rem)]"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera tipo señalética */}
        <header className="sticky top-0 z-10" style={{ background: line.color, color: line.ink }}>
          <div className="flex items-center gap-4 px-5 py-4 sm:px-8">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-white/95 text-4xl font-bold" style={{ color: line.color }}>
              {line.number}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-cond text-base font-semibold uppercase tracking-[0.16em] opacity-90">
                Línea {line.number} · {line.name}
                {line.underConstruction ? ' · en construcción' : ''} · Estación {position} de {sameLine.length}
              </p>
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{station.name}</h2>
            </div>
            <div className="hidden text-right sm:block">
              <p className="font-cond text-sm font-semibold uppercase tracking-[0.16em] opacity-90">Inauguración</p>
              <p className="font-cond text-3xl font-bold leading-none lg:text-4xl">{station.yearLabel}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-black/20 text-2xl font-bold transition-colors hover:bg-black/35"
              aria-label="Cerrar letrero y volver al mapa"
            >
              ×
            </button>
          </div>
        </header>

        <div className="grid gap-x-10 gap-y-7 px-5 py-6 sm:px-8 lg:grid-cols-12">
          <div className="grid content-start gap-6 lg:col-span-7">
            <div className="border-l-[6px] pl-4" style={{ borderColor: line.color }}>
              <p className="eyebrow mb-1">En el metro</p>
              <p className="text-2xl font-semibold leading-snug lg:text-3xl">{station.metaphor}</p>
            </div>

            <Block title="Definición">
              <p className="text-lg leading-relaxed">{station.definition}</p>
            </Block>

            <Block title="Recorrido de una petición">
              <FlowDiagram key={station.id} diagram={station.diagram} color={line.color} />
              <p className="mt-2 text-sm text-muted">Pasa el cursor sobre un componente para ver qué hace; da clic para llevar el tren ahí.</p>
            </Block>

            <div className="grid gap-6 sm:grid-cols-2">
              <Block title="Ventajas">
                <Bullets items={station.pros} mark="+" tone="text-ok" />
              </Block>
              <Block title="Desventajas">
                <Bullets items={station.cons} mark="−" tone="text-bad" />
              </Block>
            </div>
          </div>

          <div className="grid content-start gap-6 lg:col-span-5">
            <Block title="Indicadores (1 a 5)" className="card p-4">
              <Ratings ratings={station.ratings} color={line.color} />
              <p className="mt-3 text-sm text-muted">Valoración orientativa del equipo, para comparar estaciones entre sí.</p>
            </Block>

            <Block title="Cuándo usarla">
              <Bullets items={station.useWhen} mark="✓" tone="text-ok" />
            </Block>
            <Block title="Cuándo no">
              <Bullets items={station.avoidWhen} mark="✕" tone="text-bad" />
            </Block>

            <Block title="Ejemplos reales">
              <p className="mb-1.5 text-sm font-semibold text-muted">Quién la usa</p>
              <ul className="mb-3 flex flex-wrap gap-1.5">
                {station.companies.map((c) => (
                  <li key={c} className="rounded-md border border-rule bg-sunken px-2 py-0.5 font-semibold">
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mb-1.5 text-sm font-semibold text-muted">Tecnologías</p>
              <ul className="flex flex-wrap gap-1.5">
                {station.tech.map((c) => (
                  <li key={c} className="rounded-md border border-rule px-2 py-0.5">
                    {c}
                  </li>
                ))}
              </ul>
            </Block>

            <Block title="Año de inauguración">
              <p className="leading-snug">
                <strong className="font-cond text-xl">{station.yearLabel}.</strong> {station.yearNote}
              </p>
            </Block>

            <Block title="Transbordos">
              <ul className="grid gap-2">
                {station.transfers.map((t) => {
                  const target = stationById[t.to]
                  const tl = lineById[target.line]
                  return (
                    <li key={t.to}>
                      <button
                        type="button"
                        onClick={() => onGo(t.to)}
                        className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-rule p-2.5 text-left transition-colors hover:bg-sunken"
                      >
                        <span className="grid h-8 w-8 place-items-center rounded-md font-bold" style={{ background: tl.color, color: tl.ink }}>
                          {tl.number}
                        </span>
                        <span className="leading-snug">
                          <strong className="block">{target.shortName ?? target.name}</strong>
                          <span className="text-sm text-muted">{t.note}</span>
                        </span>
                        <span aria-hidden className="text-xl text-muted">
                          →
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </Block>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
