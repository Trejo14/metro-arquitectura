import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Diagram, DiagramNode } from '../../data/types'

interface Props {
  diagram: Diagram
  color: string
}

const W = 640
const H = 300
const STEP_MS = 2400

function wrap(label: string, width: number): string[] {
  const max = Math.max(6, Math.floor((width - 14) / 8.2))
  const out: string[] = []
  let cur = ''
  for (const word of label.split(' ')) {
    if (cur && (cur + ' ' + word).length > max) {
      out.push(cur)
      cur = word
    } else {
      cur = cur ? `${cur} ${word}` : word
    }
  }
  if (cur) out.push(cur)
  return out
}

const size = (n: DiagramNode) => ({ w: n.w ?? 130, h: n.h ?? 44 })

function NodeShape({ n, stroke, strokeWidth }: { n: DiagramNode; stroke: string; strokeWidth: number }) {
  const { w, h } = size(n)
  const x = n.x - w / 2
  const y = n.y - h / 2
  if (n.shape === 'hex') {
    const q = w / 4
    const pts = `${x + q},${y} ${x + w - q},${y} ${x + w},${n.y} ${x + w - q},${y + h} ${x + q},${y + h} ${x},${n.y}`
    return <polygon points={pts} className="fill-panel" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
  }
  if (n.shape === 'db') {
    const e = 6
    return (
      <g className="fill-panel" stroke={stroke} strokeWidth={strokeWidth}>
        <path d={`M${x} ${y + e} a${w / 2} ${e} 0 0 1 ${w} 0 v${h - 2 * e} a${w / 2} ${e} 0 0 1 ${-w} 0 z`} />
        <path d={`M${x} ${y + e} a${w / 2} ${e} 0 0 0 ${w} 0`} fill="none" />
      </g>
    )
  }
  return <rect x={x} y={y} width={w} height={h} rx={9} className="fill-panel" stroke={stroke} strokeWidth={strokeWidth} />
}

/** Diagrama de componentes con un tren que recorre el flujo de una petición. */
export function FlowDiagram({ diagram, color }: Props) {
  const reduceMotion = useReducedMotion()
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(!reduceMotion)
  const [inspect, setInspect] = useState<string | null>(null)

  const byId = useMemo(() => Object.fromEntries(diagram.nodes.map((n) => [n.id, n])), [diagram])
  const total = diagram.flow.length
  const current = diagram.flow[step]
  const node = byId[current.at]
  const prevAt = step > 0 ? diagram.flow[step - 1].at : null

  useEffect(() => {
    if (!playing) return
    const t = window.setTimeout(() => setStep((s) => (s + 1) % total), STEP_MS)
    return () => window.clearTimeout(t)
  }, [playing, step, total])

  const inspected = inspect ? byId[inspect] : null
  const trainY = node.y - size(node).h / 2

  return (
    <div className="card overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full bg-sunken/60" role="img" aria-label="Diagrama del flujo de una petición">
        {diagram.zones?.map((z) => (
          <g key={z.label}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={12} fill={color} fillOpacity={0.07} stroke={color} strokeOpacity={0.7} strokeWidth={1.5} strokeDasharray="6 5" />
            <text x={z.x + 10} y={z.y + 18} fontSize={12.5} fontWeight={700} letterSpacing={0.6} className="fill-muted">
              {z.label.toUpperCase()}
            </text>
          </g>
        ))}

        {diagram.edges.map(([a, b]) => {
          const na = byId[a]
          const nb = byId[b]
          const on = prevAt !== null && ((prevAt === a && current.at === b) || (prevAt === b && current.at === a))
          return (
            <line
              key={`${a}-${b}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke={on ? color : 'rgb(var(--muted))'}
              strokeOpacity={on ? 1 : 0.55}
              strokeWidth={on ? 4.5 : 2.5}
              strokeLinecap="round"
              style={{ transition: 'stroke .3s, stroke-width .3s' }}
            />
          )
        })}

        {diagram.nodes.map((n) => {
          const here = n.id === current.at
          const linesTxt = wrap(n.label, size(n).w)
          return (
            <g
              key={n.id}
              tabIndex={0}
              role="button"
              aria-label={`${n.label}: ${n.desc}`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setInspect(n.id)}
              onMouseLeave={() => setInspect(null)}
              onFocus={() => setInspect(n.id)}
              onBlur={() => setInspect(null)}
              onClick={() => {
                const i = diagram.flow.findIndex((f) => f.at === n.id)
                if (i >= 0) {
                  setPlaying(false)
                  setStep(i)
                }
              }}
            >
              <NodeShape n={n} stroke={here || inspect === n.id ? color : 'rgb(var(--ink))'} strokeWidth={here ? 4 : 2} />
              <text x={n.x} y={n.y - (linesTxt.length - 1) * 8 + 5} textAnchor="middle" fontSize={14.5} fontWeight={600} className="fill-ink" pointerEvents="none">
                {linesTxt.map((t, i) => (
                  <tspan key={i} x={n.x} dy={i === 0 ? 0 : 16}>
                    {t}
                  </tspan>
                ))}
              </text>
            </g>
          )
        })}

        {/* El tren (la petición) */}
        <motion.g
          initial={false}
          animate={{ x: node.x, y: trainY }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.95, ease: [0.45, 0, 0.2, 1] }}
          pointerEvents="none"
        >
          <rect x={-19} y={-10} width={38} height={20} rx={6} fill={color} className="stroke-panel" strokeWidth={2.5} />
          <rect x={-13} y={-5} width={7} height={7} rx={1.5} fill="#fff" />
          <rect x={-3.5} y={-5} width={7} height={7} rx={1.5} fill="#fff" />
          <rect x={6} y={-5} width={7} height={7} rx={1.5} fill="#fff" />
        </motion.g>
      </svg>

      <div className="flex min-h-[5.2rem] items-start gap-3 border-t border-rule px-4 py-3">
        <span
          className="mt-0.5 grid h-8 min-w-[2rem] shrink-0 place-items-center rounded-md px-1.5 font-cond text-lg font-bold"
          style={{ background: color, color: '#fff' }}
        >
          {inspected ? '?' : step + 1}
        </span>
        <p className="text-lg leading-snug" aria-live="polite">
          {inspected ? (
            <>
              <strong>{inspected.label}.</strong> {inspected.desc}
            </>
          ) : (
            current.text
          )}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-rule px-4 py-2.5">
        <button type="button" className="btn !px-3 !py-1.5 text-sm" onClick={() => setPlaying((p) => !p)}>
          {playing ? '❚❚ Pausar' : '▶ Reproducir'}
        </button>
        <button
          type="button"
          className="btn !px-3 !py-1.5 text-sm"
          onClick={() => {
            setPlaying(false)
            setStep((s) => (s + 1) % total)
          }}
        >
          Siguiente paso
        </button>
        <button
          type="button"
          className="btn !px-3 !py-1.5 text-sm"
          onClick={() => {
            setStep(0)
            setPlaying(true)
          }}
        >
          Reiniciar
        </button>
        <span className="ml-auto flex items-center gap-1" aria-hidden>
          {diagram.flow.map((_, i) => (
            <span key={i} className="h-1.5 w-3.5 rounded-full" style={{ background: i <= step ? color : 'rgb(var(--rule))' }} />
          ))}
        </span>
      </div>
    </div>
  )
}
