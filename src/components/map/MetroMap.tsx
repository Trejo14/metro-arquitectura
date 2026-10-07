import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { lines, lineById } from '../../data/lines'
import { stations } from '../../data/stations'
import { MAP_H, MAP_W, connectors, interchangeStations, lineGeometry, stationPos } from '../../data/mapLayout'
import type { LineId, StationId } from '../../data/types'

interface Props {
  onSelect?: (id: StationId) => void
  visited?: StationId[]
  active?: StationId | null
  /** Si se indica, las demás líneas se atenúan */
  focusLine?: LineId | null
  /** Oculta trenes y desactiva la interacción (para miniaturas) */
  decorative?: boolean
  className?: string
  /** Para incrustar el mapa dentro de otro SVG */
  x?: number
  y?: number
  width?: number
  height?: number
}

function labelProps(id: StationId) {
  const p = stationPos[id]
  const n = p.text.length
  const lh = 23
  switch (p.label) {
    case 'top':
      return { x: p.x, y: p.y - 26 - (n - 1) * lh, anchor: 'middle' as const, lh }
    case 'bottom':
      return { x: p.x, y: p.y + 40, anchor: 'middle' as const, lh }
    case 'left':
      return { x: p.x - 24, y: p.y + 7 - ((n - 1) * lh) / 2, anchor: 'end' as const, lh }
    default:
      return { x: p.x + 24, y: p.y + 7 - ((n - 1) * lh) / 2, anchor: 'start' as const, lh }
  }
}

export function MetroMap({ onSelect, visited = [], active = null, focusLine = null, decorative = false, className, ...frame }: Props) {
  const [hover, setHover] = useState<StationId | null>(null)
  const reduceMotion = useReducedMotion()
  const dim = (line: LineId) => (focusLine && focusLine !== line ? 0.18 : 1)

  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      className={className}
      {...frame}
      role={decorative ? 'img' : 'group'}
      aria-label="Mapa de la red Metro Arquitectura"
    >
      {/* Pasillos de transbordo */}
      {connectors.map(([a, b]) => {
        const pa = stationPos[a]
        const pb = stationPos[b]
        return (
          <g key={`${a}-${b}`} opacity={focusLine ? 0.25 : 1}>
            <line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} className="stroke-ink" strokeWidth={11} strokeLinecap="round" />
            <line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} className="stroke-panel" strokeWidth={5} strokeLinecap="round" />
          </g>
        )
      })}

      {/* Líneas */}
      {lines.map((line) => {
        const g = lineGeometry[line.id]
        return (
          <g key={line.id} opacity={dim(line.id)} style={{ transition: 'opacity .3s' }}>
            {line.underConstruction && (
              <path d={g.path} fill="none" stroke={line.color} strokeOpacity={0.22} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
            )}
            <path
              d={g.path}
              fill="none"
              stroke={line.color}
              strokeWidth={12}
              strokeLinejoin="round"
              strokeLinecap={line.underConstruction ? 'butt' : 'round'}
              strokeDasharray={line.underConstruction ? '20 12' : undefined}
            />
            {/* Distintivo de la línea */}
            <g transform={`translate(${g.badge.x} ${g.badge.y})`}>
              <rect x={-17} y={-17} width={34} height={34} rx={8} fill={line.color} />
              <text textAnchor="middle" y={8} fontSize={23} fontWeight={700} fill={line.ink}>
                {line.number}
              </text>
            </g>
          </g>
        )
      })}

      {/* Flecha de evolución SOA → Microservicios */}
      <g opacity={dim('L2')} transform="translate(950 150) rotate(45)">
        <path d="M-9 -7 L3 0 L-9 7" fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x={972} y={140} fontSize={15} fontWeight={600} className="fill-muted" opacity={dim('L2')}>
        evolución
      </text>

      <text
        x={560}
        y={556}
        textAnchor="middle"
        fontSize={15}
        fontWeight={700}
        letterSpacing={2.5}
        fill={lineById.L5.color}
        opacity={dim('L5')}
      >
        EN CONSTRUCCIÓN
      </text>

      {/* Trenes: representan peticiones viajando por el sistema */}
      {!decorative &&
        !reduceMotion &&
        lines.map((line) => {
          const g = lineGeometry[line.id]
          return (
            <g key={line.id} opacity={dim(line.id)} pointerEvents="none">
              <g>
                <rect x={-17} y={-8} width={34} height={16} rx={5} className="fill-ink" />
                <rect x={-12} y={-4} width={7} height={6} rx={1.5} className="fill-panel" />
                <rect x={-3.5} y={-4} width={7} height={6} rx={1.5} className="fill-panel" />
                <rect x={5} y={-4} width={7} height={6} rx={1.5} className="fill-panel" />
                <animateMotion
                  dur={`${g.trainSeconds * 2}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                  path={g.path}
                  keyPoints="0;1;0"
                  keyTimes="0;0.5;1"
                  calcMode="linear"
                />
              </g>
            </g>
          )
        })}

      {/* Estaciones */}
      {stations.map((s) => {
        const p = stationPos[s.id]
        const line = lineById[s.line]
        const l = labelProps(s.id)
        const isHover = hover === s.id
        const isActive = active === s.id
        const isVisited = visited.includes(s.id)
        const inter = interchangeStations.has(s.id)
        const r = inter ? 15 : 11
        return (
          <g
            key={s.id}
            opacity={dim(s.line)}
            style={{ cursor: decorative ? 'default' : 'pointer', transition: 'opacity .3s' }}
            role={decorative ? undefined : 'button'}
            tabIndex={decorative ? undefined : 0}
            aria-label={decorative ? undefined : `Estación ${s.name}, línea ${line.number}${isVisited ? ', visitada' : ''}`}
            onClick={() => onSelect?.(s.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect?.(s.id)
              }
            }}
            onMouseEnter={() => !decorative && setHover(s.id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => !decorative && setHover(s.id)}
            onBlur={() => setHover(null)}
          >
            {/* Área de clic generosa */}
            <circle cx={p.x} cy={p.y} r={30} fill="transparent" />
            {(isHover || isActive) && <circle cx={p.x} cy={p.y} r={r + 9} fill={line.color} opacity={0.28} />}
            <g
              style={{
                transform: `scale(${isHover || isActive ? 1.18 : 1})`,
                transformOrigin: `${p.x}px ${p.y}px`,
                transition: 'transform .18s ease-out',
              }}
            >
              {inter ? (
                <>
                  <circle cx={p.x} cy={p.y} r={15} className="fill-panel stroke-ink" strokeWidth={4.5} />
                  <circle cx={p.x} cy={p.y} r={7.5} fill={isVisited ? line.color : 'none'} stroke={line.color} strokeWidth={3.5} />
                </>
              ) : (
                <>
                  <circle cx={p.x} cy={p.y} r={11} className="fill-panel" stroke={line.color} strokeWidth={5} />
                  {isVisited && <circle cx={p.x} cy={p.y} r={4.5} fill={line.color} />}
                </>
              )}
            </g>
            <text
              x={l.x}
              y={l.y}
              textAnchor={l.anchor}
              fontSize={21}
              fontWeight={isHover || isActive ? 700 : 600}
              className="fill-ink stroke-bg"
              strokeWidth={6}
              strokeLinejoin="round"
              paintOrder="stroke"
            >
              {p.text.map((t, i) => (
                <tspan key={t} x={l.x} dy={i === 0 ? 0 : l.lh}>
                  {t}
                </tspan>
              ))}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
