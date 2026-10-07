import { motion } from 'framer-motion'
import { lineById } from '../../data/lines'
import { stations } from '../../data/stations'
import { eras, milestones } from '../../data/timeline'
import type { StationId } from '../../data/types'
import { SectionShell } from '../layout/SectionShell'

interface Stop {
  key: string
  year: number
  yearLabel: string
  label: string
  note: string
  color?: string
  stationId?: StationId
}

const stops: Stop[] = [
  ...stations.map((s) => ({
    key: s.id,
    year: s.year,
    yearLabel: s.yearLabel,
    label: s.shortName ?? s.name,
    note: s.yearNote,
    color: lineById[s.line].color,
    stationId: s.id,
  })),
  ...milestones.map((m) => ({ key: m.label, year: m.year, yearLabel: String(m.year), label: m.label, note: m.note })),
].sort((a, b) => a.year - b.year)

export function Timeline({ onOpen }: { onOpen: (id: StationId) => void }) {
  return (
    <SectionShell
      eyebrow="Parada · Historia de la red"
      title="De los mainframes a los agentes de IA"
      lead="Las estaciones en el orden en que se inauguraron. Cada arquitectura nació para resolver un problema que la anterior ya no podía."
    >
      <ol className="grid gap-5">
        {eras.map((era, e) => {
          const items = stops.filter((s) => s.year >= era.from && s.year <= era.to)
          return (
            <motion.li
              key={era.name}
              className="grid gap-3 lg:grid-cols-[15rem_1fr]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: e * 0.12 }}
            >
              <div>
                <p className="font-cond text-3xl font-bold leading-none tabular-nums">
                  {era.from}
                  {era.to > 2050 ? ' – hoy' : ` – ${era.to}`}
                </p>
                <p className="text-xl font-bold leading-tight">{era.name}</p>
                <p className="mt-1 text-sm leading-snug text-muted">{era.summary}</p>
              </div>
              <div className="overflow-x-auto pb-1">
                <ol className="relative grid min-w-max auto-cols-[minmax(8.5rem,1fr)] grid-flow-col pt-2">
                  <span className="absolute left-0 right-0 top-[1.05rem] h-2 rounded-full bg-rule" aria-hidden />
                  {items.map((s) => {
                    const dot = (
                      <span
                        className="relative block h-6 w-6 rounded-full border-[5px] bg-panel"
                        style={{ borderColor: s.color ?? 'rgb(var(--muted))', borderRadius: s.color ? undefined : '6px' }}
                        aria-hidden
                      />
                    )
                    const body = (
                      <>
                        <span className="mt-1.5 block font-cond text-lg font-bold leading-none text-muted">{s.yearLabel}</span>
                        <span className="block text-lg font-bold leading-tight">{s.label}</span>
                        <span className="mt-0.5 block text-sm leading-snug text-muted">{s.note}</span>
                      </>
                    )
                    return (
                      <li key={s.key} className="pr-4">
                        {s.stationId ? (
                          <button type="button" className="group block w-full max-w-[15rem] text-left" onClick={() => onOpen(s.stationId!)}>
                            <span className="block transition-transform group-hover:scale-125" style={{ transformOrigin: '0.75rem 0.75rem' }}>
                              {dot}
                            </span>
                            <span className="block group-hover:underline group-hover:decoration-2 group-hover:underline-offset-2">{body}</span>
                          </button>
                        ) : (
                          <div className="max-w-[15rem]">
                            {dot}
                            {body}
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ol>
              </div>
            </motion.li>
          )
        })}
      </ol>
      <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted">
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full border-4 border-muted" /> Estación de la red (clic para abrir su letrero)
        </span>
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-[4px] border-4 border-muted" /> Hito tecnológico
        </span>
        <span>Las fechas son aproximadas: indican cuándo surgió o se popularizó cada idea.</span>
      </p>
    </SectionShell>
  )
}
