import { useState } from 'react'
import { sim, simServices } from '../../data/rushHour'
import { SectionShell } from '../layout/SectionShell'

type Status = 'fluido' | 'limite' | 'saturada' | 'cerrada'

const statusText: Record<Status, string> = {
  fluido: 'Fluido',
  limite: 'Al límite',
  saturada: 'Saturada',
  cerrada: 'Cerrada',
}

function statusOf(util: number, closed: boolean): Status {
  if (closed) return 'cerrada'
  if (util > 1) return 'saturada'
  if (util >= sim.warnAt) return 'limite'
  return 'fluido'
}

interface LaneProps {
  name: string
  demand: number
  capacity: number
  closed: boolean
  color: string
  replicas?: number
  big?: boolean
  children?: React.ReactNode
}

/** Un carril: pasajeros que caminan hacia una estación con capacidad limitada. */
function Lane({ name, demand, capacity, closed, color, replicas = 1, big = false, children }: LaneProps) {
  const util = demand / capacity
  const status = statusOf(util, closed)
  const stopped = status === 'saturada' || status === 'cerrada'
  const dots = Math.max(1, Math.min(big ? 40 : 18, Math.round(demand * (big ? 3.2 : 4))))
  const rows = big ? 4 : 1
  const tone = stopped ? 'rgb(var(--bad))' : color

  return (
    <div className="grid grid-cols-[1fr_minmax(9rem,38%)] items-stretch gap-0">
      {/* Vía de acceso */}
      <div className={`relative overflow-hidden border-y-2 border-dashed border-rule ${big ? 'h-[13.5rem]' : 'h-12'}`} aria-hidden>
        {Array.from({ length: dots }, (_, i) => (
          <span
            key={i}
            className="absolute h-3 w-3 -translate-y-1/2 rounded-full"
            style={{
              top: `${((i % rows) + 0.5) * (100 / rows)}%`,
              background: tone,
              animation: `pasajero ${big ? 3.2 : 2.6}s linear infinite`,
              animationDelay: `${-(i * (big ? 3.2 : 2.6)) / dots}s`,
              animationPlayState: stopped ? 'paused' : 'running',
            }}
          />
        ))}
      </div>
      {/* Estación */}
      <div
        className="flex flex-col justify-center rounded-xl border-[3px] bg-panel px-3 py-1.5 transition-colors"
        style={{ borderColor: tone, opacity: status === 'cerrada' ? 0.6 : 1 }}
      >
        <div className="flex items-baseline justify-between gap-2">
          <span className={`font-bold leading-tight ${big ? 'text-xl' : 'text-lg'}`}>
            {name}
            {replicas > 1 && <span className="ml-1.5 font-cond text-base font-semibold text-muted">× {replicas}</span>}
          </span>
          <span
            className={`whitespace-nowrap font-cond text-base font-bold uppercase tracking-wide ${stopped ? 'text-bad' : status === 'limite' ? 'text-ink' : 'text-ok'}`}
          >
            {status === 'saturada' ? '⚠ ' : status === 'cerrada' ? '✕ ' : ''}
            {statusText[status]}
          </span>
        </div>
        {children}
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-rule" role="img" aria-label={`Ocupación ${Math.round(Math.min(util, 9.99) * 100)} por ciento`}>
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${closed ? 0 : Math.min(100, util * 100)}%`, background: tone }} />
        </div>
      </div>
    </div>
  )
}

function Verdict({ ok, total, text }: { ok: number; total: number; text: string }) {
  const tone = ok === total ? 'text-ok' : ok === 0 ? 'text-bad' : 'text-ink'
  return (
    <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-4 border-t border-rule pt-3">
      <p className={`font-cond text-5xl font-bold tabular-nums leading-none ${tone}`}>
        {ok}/{total}
      </p>
      <p className="text-lg leading-snug">
        <span className="eyebrow block">Funciones disponibles</span>
        {text}
      </p>
    </div>
  )
}

export function RushHour() {
  const [load, setLoad] = useState(sim.initialLoad)
  const [closed, setClosed] = useState<string | null>(null)
  const [autoscale, setAutoscale] = useState(false)
  const total = simServices.length
  const closedName = simServices.find((s) => s.id === closed)?.name

  // Monolito: una sola estación; si se satura o falla, se detiene completa.
  const monoStatus = statusOf(load / sim.monolithCapacity, closed !== null)
  const monoOk = monoStatus === 'saturada' || monoStatus === 'cerrada' ? 0 : total
  const monoText =
    monoStatus === 'cerrada'
      ? `La falla en ${closedName} tumbó el proceso completo: nadie puede hacer nada.`
      : monoStatus === 'saturada'
        ? 'La única estación se saturó: los cuatro módulos se detienen a la vez.'
        : monoStatus === 'limite'
          ? 'Todo funciona, pero la estación está al límite.'
          : 'Todo funciona. Con poco tráfico, el monolito es más que suficiente.'

  // Microservicios: cada estación tiene su propia capacidad (y, si se activa, sus propias réplicas).
  const services = simServices.map((s) => {
    const demand = load * s.share
    const replicas = autoscale ? Math.max(1, Math.ceil(demand / (sim.serviceCapacity * sim.warnAt))) : 1
    const capacity = sim.serviceCapacity * replicas
    return { ...s, demand, replicas, capacity, status: statusOf(demand / capacity, closed === s.id) }
  })
  const down = services.filter((s) => s.status === 'saturada' || s.status === 'cerrada')
  const microOk = total - down.length
  const microText =
    down.length === 0
      ? 'Los trenes se reparten entre las estaciones: ninguna se congestiona.'
      : `Solo ${down.map((s) => s.name).join(' y ')} ${down.length === 1 ? 'tiene' : 'tienen'} problemas; el resto de la red sigue funcionando.`

  return (
    <SectionShell
      eyebrow="Parada · Comunicar"
      title="Simulador: hora pico"
      lead="El mismo sistema, construido de dos formas. Sube los pasajeros o cierra una estación y observa qué pasa en cada arquitectura."
    >
      <div className="card mb-5 grid gap-x-8 gap-y-4 p-4 lg:grid-cols-[1.3fr_1fr] lg:p-5">
        <div>
          <label htmlFor="carga" className="flex items-baseline justify-between gap-3">
            <span className="eyebrow">Pasajeros (peticiones) por minuto</span>
            <span className="font-cond text-4xl font-bold tabular-nums leading-none">{(load * 1000).toLocaleString('es-MX')}</span>
          </label>
          <input
            id="carga"
            type="range"
            min={sim.minLoad}
            max={sim.maxLoad}
            step={0.5}
            value={load}
            onChange={(e) => setLoad(Number(e.target.value))}
            className="mt-2 h-3 w-full cursor-pointer accent-[rgb(var(--ink))]"
          />
          <div className="mt-1 flex justify-between text-sm text-muted">
            <span>Madrugada</span>
            <span>Hora pico</span>
          </div>
        </div>
        <div>
          <p className="eyebrow mb-2">Cerrar una estación (simular una falla)</p>
          <div className="flex flex-wrap gap-2">
            {simServices.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={closed === s.id}
                onClick={() => setClosed(closed === s.id ? null : s.id)}
                className={`btn !py-1.5 ${closed === s.id ? '!border-bad !bg-bad !text-white' : ''}`}
              >
                <span className="h-3 w-3 rounded-full" style={{ background: closed === s.id ? '#fff' : s.color }} />
                {closed === s.id ? `Reabrir ${s.name}` : s.name}
              </button>
            ))}
          </div>
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-lg">
            <input type="checkbox" className="h-5 w-5 accent-[rgb(var(--ink))]" checked={autoscale} onChange={(e) => setAutoscale(e.target.checked)} />
            Escalar cada microservicio por separado
          </label>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card p-4 lg:p-5">
          <h2 className="mb-3 flex items-center gap-2.5 text-2xl font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-[#E5383B] text-lg text-white">1</span>
            Monolítica
          </h2>
          <Lane name="Aplicación única" demand={load} capacity={sim.monolithCapacity} closed={closed !== null} color="rgb(var(--muted))" big>
            <ul className="my-2 grid grid-cols-2 gap-1.5">
              {simServices.map((s) => (
                <li key={s.id} className={`rounded-md bg-sunken px-2 py-1 font-semibold ${closed === s.id ? 'text-bad line-through' : ''}`}>
                  {s.name}
                </li>
              ))}
            </ul>
          </Lane>
          <Verdict ok={monoOk} total={total} text={monoText} />
        </section>

        <section className="card p-4 lg:p-5">
          <h2 className="mb-3 flex items-center gap-2.5 text-2xl font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-[#1D7FD8] text-lg text-white">2</span>
            Microservicios
          </h2>
          <div className="grid gap-2">
            {services.map((s) => (
              <Lane key={s.id} name={s.name} demand={s.demand} capacity={s.capacity} closed={closed === s.id} color={s.color} replicas={s.replicas} />
            ))}
          </div>
          <Verdict ok={microOk} total={total} text={microText} />
        </section>
      </div>

      <p className="mt-4 max-w-5xl text-sm leading-relaxed text-muted">
        Modelo simplificado para comunicar la idea. En la práctica, un monolito también puede replicarse completo detrás de un balanceador (escala todo, aunque solo una parte lo
        necesite), y los microservicios solo aíslan las fallas si se diseñan para ello (tiempos de espera, reintentos, colas). Además, cada microservicio extra cuesta operación.
      </p>
    </SectionShell>
  )
}
