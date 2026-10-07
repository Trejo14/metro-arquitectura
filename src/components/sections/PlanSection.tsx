import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { adrs } from '../../data/adrs'
import { evolutionModules, evolutionStages } from '../../data/evolution'
import { lineById, lines } from '../../data/lines'
import { ratingLabels, stationById, stations } from '../../data/stations'
import type { LineId, Ratings, StationId } from '../../data/types'
import { SectionShell } from '../layout/SectionShell'

type Tab = 'comparar' | 'adr' | 'ruta'
const tabs: { id: Tab; label: string }[] = [
  { id: 'comparar', label: 'Tabla comparativa' },
  { id: 'adr', label: 'Decisiones (ADR)' },
  { id: 'ruta', label: 'Ruta de evolución' },
]

// ───────────────────────────── Tabla comparativa ─────────────────────────────

type SortKey = 'recorrido' | 'year' | keyof Ratings

function CompareTable({ onOpen }: { onOpen: (id: StationId) => void }) {
  const [lineFilter, setLineFilter] = useState<LineId | 'todas'>('todas')
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: 'recorrido', desc: false })

  const rows = useMemo(() => {
    const list = stations.filter((s) => lineFilter === 'todas' || s.line === lineFilter)
    if (sort.key === 'recorrido') return list
    const value = (id: StationId) => (sort.key === 'year' ? stationById[id].year : stationById[id].ratings[sort.key as keyof Ratings])
    return [...list].sort((a, b) => (value(a.id) - value(b.id)) * (sort.desc ? -1 : 1))
  }, [lineFilter, sort])

  const toggle = (key: SortKey) => setSort((s) => (s.key === key ? { key, desc: !s.desc } : { key, desc: key !== 'year' }))
  const arrow = (key: SortKey) => (sort.key === key ? (sort.desc ? ' ↓' : ' ↑') : '')
  const ariaSort = (key: SortKey) => (sort.key === key ? (sort.desc ? 'descending' : 'ascending') : 'none')

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="eyebrow mr-1">Filtrar por línea</span>
        <button type="button" className={`btn !py-1 ${lineFilter === 'todas' ? '!bg-ink !text-bg' : ''}`} onClick={() => setLineFilter('todas')} aria-pressed={lineFilter === 'todas'}>
          Todas
        </button>
        {lines.map((l) => (
          <button
            key={l.id}
            type="button"
            className={`btn !py-1 ${lineFilter === l.id ? '!border-ink !bg-sunken' : ''}`}
            onClick={() => setLineFilter(l.id)}
            aria-pressed={lineFilter === l.id}
          >
            <span className="grid h-5 w-5 place-items-center rounded text-xs font-bold" style={{ background: l.color, color: l.ink }}>
              {l.number}
            </span>
            {l.name}
          </button>
        ))}
        {sort.key !== 'recorrido' && (
          <button type="button" className="ml-auto text-muted underline underline-offset-2 hover:text-ink" onClick={() => setSort({ key: 'recorrido', desc: false })}>
            Restablecer orden
          </button>
        )}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[52rem] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-ink align-bottom">
              <th className="px-3 py-2.5 font-cond text-base font-semibold uppercase tracking-wider">Estación</th>
              <th className="px-2 py-2.5" aria-sort={ariaSort('year')}>
                <button type="button" className="font-cond text-base font-semibold uppercase tracking-wider hover:underline" onClick={() => toggle('year')}>
                  Año{arrow('year')}
                </button>
              </th>
              {ratingLabels.map((r) => (
                <th key={r.key} className="px-2 py-2.5" aria-sort={ariaSort(r.key)} title={r.hint}>
                  <button type="button" className="text-left font-cond text-base font-semibold uppercase leading-tight tracking-wider hover:underline" onClick={() => toggle(r.key)}>
                    {r.label}
                    {arrow(r.key)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const line = lineById[s.line]
              return (
                <motion.tr layout key={s.id} className="cursor-pointer border-b border-rule last:border-0 hover:bg-sunken" onClick={() => onOpen(s.id)}>
                  <th scope="row" className="px-3 py-2 font-semibold">
                    <button type="button" className="flex items-center gap-2.5 text-left text-lg" onClick={() => onOpen(s.id)}>
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-sm font-bold" style={{ background: line.color, color: line.ink }}>
                        {line.number}
                      </span>
                      {s.shortName ?? s.name}
                    </button>
                  </th>
                  <td className="px-2 py-2 font-cond text-lg tabular-nums text-muted">{s.yearLabel}</td>
                  {ratingLabels.map((r) => {
                    const v = s.ratings[r.key]
                    return (
                      <td key={r.key} className="px-2 py-2">
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-20 overflow-hidden rounded-full bg-rule" aria-hidden>
                            <span className="block h-full rounded-full" style={{ width: `${v * 20}%`, background: sort.key === r.key ? line.color : 'rgb(var(--muted))' }} />
                          </span>
                          <span className="font-cond text-lg font-bold tabular-nums">{v}</span>
                        </span>
                      </td>
                    )
                  })}
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm text-muted">
        Da clic en un encabezado para ordenar y en una fila para abrir su letrero. Escala de 1 a 5; en Complejidad, Costo y Tamaño de equipo un valor alto significa más
        complejo, más caro y equipos más grandes.
      </p>
    </div>
  )
}

// ──────────────────────────────────── ADR ────────────────────────────────────

function Adrs({ onOpen }: { onOpen: (id: StationId) => void }) {
  const [current, setCurrent] = useState(0)
  const adr = adrs[current]
  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <p className="mb-3 text-lg leading-relaxed">
          Un <strong>ADR</strong> (Architecture Decision Record) es una nota breve que registra <strong>una</strong> decisión de arquitectura y, sobre todo, su porqué. Así, quien
          llegue después entiende por qué la red se trazó de esa manera.
        </p>
        <ul className="grid gap-2">
          {adrs.map((a, i) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-current={i === current ? 'true' : undefined}
                className={`w-full rounded-xl border p-3 text-left transition-colors ${i === current ? 'border-ink bg-ink text-bg' : 'border-rule bg-panel hover:bg-sunken'}`}
              >
                <span className="font-mono text-sm opacity-75">
                  {a.id} · {a.date}
                </span>
                <span className="block text-lg font-bold leading-snug">{a.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <motion.article key={adr.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="card p-5 lg:col-span-8 lg:p-6">
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-rule pb-3">
          <div>
            <p className="font-mono text-muted">{adr.id}</p>
            <h3 className="text-2xl font-bold leading-tight">{adr.title}</h3>
          </div>
          <span className="rounded-full border-2 border-ink px-3 py-0.5 font-cond font-bold uppercase tracking-wider">Estado: {adr.status}</span>
        </header>
        <div className="grid gap-4">
          <section>
            <h4 className="eyebrow mb-1">Contexto</h4>
            <p className="text-lg leading-relaxed">{adr.context}</p>
          </section>
          <section>
            <h4 className="eyebrow mb-1">Decisión</h4>
            <p className="text-lg font-semibold leading-relaxed">{adr.decision}</p>
          </section>
          <section>
            <h4 className="eyebrow mb-1">Alternativas consideradas</h4>
            <ul className="grid gap-1.5">
              {adr.alternatives.map((alt) => (
                <li key={alt.name} className="leading-snug">
                  <strong>{alt.name}.</strong> {alt.why}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h4 className="eyebrow mb-1">Consecuencias</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <ul className="grid content-start gap-1.5">
                {adr.positives.map((p) => (
                  <li key={p} className="grid grid-cols-[1.25rem_1fr] leading-snug">
                    <span className="font-bold text-ok">+</span>
                    {p}
                  </li>
                ))}
              </ul>
              <ul className="grid content-start gap-1.5">
                {adr.negatives.map((p) => (
                  <li key={p} className="grid grid-cols-[1.25rem_1fr] leading-snug">
                    <span className="font-bold text-bad">−</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <footer className="flex flex-wrap items-center gap-2 border-t border-rule pt-3">
            <span className="eyebrow">Estaciones relacionadas</span>
            {adr.stations.map((id) => {
              const s = stationById[id]
              const l = lineById[s.line]
              return (
                <button key={id} type="button" className="btn !py-1 text-sm" onClick={() => onOpen(id)}>
                  <span className="h-3 w-3 rounded-full" style={{ background: l.color }} />
                  {s.shortName ?? s.name}
                </button>
              )
            })}
          </footer>
        </div>
      </motion.article>
    </div>
  )
}

// ───────────────────────────── Ruta de evolución ─────────────────────────────

const MODULE_COLORS = ['#E5383B', '#1D7FD8', '#1FA35B', '#8E44C9']

/** Posición de cada módulo en cada etapa (lienzo 560 × 300). */
const moduleLayouts: { x: number; y: number; w: number; h: number }[][] = [
  // Monolítica: todo pegado, sin fronteras
  [
    { x: 160, y: 60, w: 120, h: 90 },
    { x: 280, y: 60, w: 120, h: 90 },
    { x: 160, y: 150, w: 120, h: 90 },
    { x: 280, y: 150, w: 120, h: 90 },
  ],
  // Monolito modular: mismos muros exteriores, andenes separados
  [
    { x: 150, y: 52, w: 122, h: 92 },
    { x: 288, y: 52, w: 122, h: 92 },
    { x: 150, y: 158, w: 122, h: 92 },
    { x: 288, y: 158, w: 122, h: 92 },
  ],
  // Microservicios: estaciones separadas unidas por un bus de eventos
  [
    { x: 20, y: 40, w: 118, h: 80 },
    { x: 154, y: 40, w: 118, h: 80 },
    { x: 288, y: 40, w: 118, h: 80 },
    { x: 422, y: 40, w: 118, h: 80 },
  ],
]

function EvolutionRoute({ onOpen }: { onOpen: (id: StationId) => void }) {
  const [stage, setStage] = useState(0)
  const [auto, setAuto] = useState(false)
  const data = evolutionStages[stage]
  const last = evolutionStages.length - 1

  useEffect(() => {
    if (!auto) return
    const t = window.setTimeout(() => {
      if (stage >= last) setAuto(false)
      else setStage((s) => s + 1)
    }, 4200)
    return () => window.clearTimeout(t)
  }, [auto, stage, last])

  const spring = { type: 'spring' as const, stiffness: 90, damping: 18 }

  return (
    <div>
      {/* Vía con las tres paradas */}
      <div className="relative mx-auto mb-6 max-w-5xl px-6 pt-10">
        <div className="h-3 rounded-full bg-rule" />
        <motion.div className="absolute left-6 top-10 h-3 rounded-full bg-ink" animate={{ width: `calc((100% - 3rem) * ${stage / last})` }} transition={spring} />
        <motion.div className="absolute top-[0.35rem] -ml-7" animate={{ left: `calc(1.5rem + (100% - 3rem) * ${stage / last})` }} transition={spring} aria-hidden>
          <svg width="56" height="30" viewBox="0 0 56 30">
            <rect x="1" y="3" width="54" height="22" rx="7" className="fill-ink" />
            <rect x="8" y="8" width="10" height="9" rx="2" className="fill-bg" />
            <rect x="23" y="8" width="10" height="9" rx="2" className="fill-bg" />
            <rect x="38" y="8" width="10" height="9" rx="2" className="fill-bg" />
          </svg>
        </motion.div>
        <ol className="relative -mt-[1.15rem] flex justify-between">
          {evolutionStages.map((s, i) => (
            <li key={s.title} className={`flex w-0 flex-col ${i === 0 ? 'items-start' : i === last ? 'items-end' : 'items-center'}`}>
              <button type="button" onClick={() => { setAuto(false); setStage(i) }} className="flex flex-col items-[inherit]" aria-current={i === stage ? 'step' : undefined}>
                <span className={`block h-6 w-6 rounded-full border-[5px] ${i <= stage ? 'border-ink bg-bg' : 'border-rule bg-panel'}`} />
                <span className={`mt-1.5 whitespace-nowrap text-lg leading-tight ${i === stage ? 'font-bold' : 'text-muted'}`}>{s.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-12">
        <div className="card overflow-hidden lg:col-span-7">
          <svg viewBox="0 0 560 300" className="block w-full bg-sunken/50" role="img" aria-label={`Estructura del sistema en la etapa ${data.title}`}>
            {/* Muros del despliegue único */}
            <motion.rect x={132} y={30} width={296} height={240} rx={16} className="fill-panel stroke-ink" strokeWidth={3} animate={{ opacity: stage < 2 ? 1 : 0 }} />
            <motion.text x={280} y={22} textAnchor="middle" fontSize={14} fontWeight={700} className="fill-muted" animate={{ opacity: stage < 2 ? 1 : 0 }}>
              UN SOLO DESPLIEGUE
            </motion.text>

            {/* Bus de eventos */}
            <motion.g animate={{ opacity: stage === 2 ? 1 : 0 }} transition={{ delay: stage === 2 ? 0.5 : 0 }}>
              {moduleLayouts[2].map((m, i) => (
                <line key={i} x1={m.x + m.w / 2} y1={m.y + m.h} x2={m.x + m.w / 2} y2={196} className="stroke-muted" strokeWidth={3} />
              ))}
              <rect x={20} y={196} width={520} height={34} rx={17} fill="#1FA35B" />
              <text x={280} y={219} textAnchor="middle" fontSize={16} fontWeight={700} fill="#fff">
                Bus de eventos
              </text>
              <text x={280} y={262} textAnchor="middle" fontSize={15} className="fill-muted">
                Cada servicio con su propia base de datos y su propio despliegue
              </text>
            </motion.g>

            {evolutionModules.map((name, i) => {
              const m = moduleLayouts[stage][i]
              return (
                <motion.g key={name} initial={false} animate={{ x: m.x, y: m.y }} transition={spring}>
                  <motion.rect
                    initial={false}
                    animate={{ width: m.w, height: m.h, fillOpacity: stage === 0 ? 0.1 : 0.16 }}
                    transition={spring}
                    rx={stage === 0 ? 0 : 10}
                    fill={stage === 0 ? 'rgb(var(--muted))' : MODULE_COLORS[i]}
                    stroke={stage === 0 ? 'none' : MODULE_COLORS[i]}
                    strokeWidth={3}
                  />
                  <text x={m.w / 2} y={m.h / 2 + 6} textAnchor="middle" fontSize={17} fontWeight={700} className="fill-ink">
                    {name}
                  </text>
                </motion.g>
              )
            })}
          </svg>
        </div>

        <motion.div key={stage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-5">
          <p className="eyebrow">
            Parada {stage + 1} de {evolutionStages.length}
          </p>
          <h3 className="text-3xl font-bold leading-tight">{data.title}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-md bg-sunken px-2.5 py-1 font-semibold">{data.users}</span>
            <span className="rounded-md bg-sunken px-2.5 py-1 font-semibold">Equipo: {data.team}</span>
          </div>
          <p className="mt-3 text-lg leading-relaxed">{data.description}</p>
          {data.pain && (
            <p className="mt-3 border-l-4 border-bad pl-3 text-lg leading-snug">
              <span className="eyebrow block">Lo que empuja a seguir el viaje</span>
              {data.pain}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn" disabled={stage === 0} onClick={() => { setAuto(false); setStage(stage - 1) }}>
              ← Anterior
            </button>
            <button type="button" className="btn" disabled={stage === last} onClick={() => { setAuto(false); setStage(stage + 1) }}>
              Siguiente →
            </button>
            <button type="button" className="btn-solid" onClick={() => { setStage(0); setAuto(true) }}>
              ▶ Ver el viaje completo
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">Abrir letrero:</span>
            {data.stations.map((id) => (
              <button key={id} type="button" className="btn !py-1 text-sm" onClick={() => onOpen(id)}>
                <span className="h-3 w-3 rounded-full" style={{ background: lineById[stationById[id].line].color }} />
                {stationById[id].shortName ?? stationById[id].name}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
      <p className="mt-4 text-sm text-muted">
        No es un camino obligatorio: muchos sistemas exitosos se quedan para siempre en la primera o en la segunda parada. Las cifras son ilustrativas.
      </p>
    </div>
  )
}

// ─────────────────────────────────── Sección ───────────────────────────────────

export function PlanSection({ onOpen }: { onOpen: (id: StationId) => void }) {
  const [tab, setTab] = useState<Tab>('comparar')
  return (
    <SectionShell eyebrow="Parada · Planificar" title="Elegir la ruta antes de construir" lead="Tres herramientas para decidir: comparar las estaciones, dejar por escrito cada decisión y planear cómo evolucionará el sistema.">
      <div role="tablist" aria-label="Herramientas de planificación" className="mb-5 flex flex-wrap gap-1 border-b-2 border-ink">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-t-lg px-4 py-2 text-lg font-bold transition-colors ${tab === t.id ? 'bg-ink text-bg' : 'text-muted hover:bg-sunken hover:text-ink'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'comparar' && <CompareTable onOpen={onOpen} />}
      {tab === 'adr' && <Adrs onOpen={onOpen} />}
      {tab === 'ruta' && <EvolutionRoute onOpen={onOpen} />}
    </SectionShell>
  )
}
