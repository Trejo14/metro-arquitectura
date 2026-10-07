import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { c4Levels, type C4Box, type C4Kind } from '../../data/c4'
import { SectionShell } from '../layout/SectionShell'
import { MetroMap } from '../map/MetroMap'

const ACCENT = '#1D7FD8'

/** Punto donde la recta entre centros corta el borde de la caja. */
function edgePoint(box: C4Box, towards: C4Box) {
  const cx = box.x + box.w / 2
  const cy = box.y + box.h / 2
  const dx = towards.x + towards.w / 2 - cx
  const dy = towards.y + towards.h / 2 - cy
  const t = Math.min(box.w / 2 / Math.abs(dx || 1e-6), box.h / 2 / Math.abs(dy || 1e-6))
  return { x: cx + dx * t, y: cy + dy * t }
}

const kindLabel: Record<C4Kind, string> = {
  person: 'Persona',
  system: 'Sistema',
  external: 'Sistema externo',
  container: 'Contenedor',
  component: 'Componente',
}

function Box({ box, onZoom, showMap }: { box: C4Box; onZoom?: () => void; showMap: boolean }) {
  const external = box.kind === 'external'
  const person = box.kind === 'person'
  const cx = box.x + box.w / 2
  const clickable = Boolean(box.zoomInto && onZoom)
  return (
    <g
      onClick={clickable ? onZoom : undefined}
      onKeyDown={clickable ? (e) => (e.key === 'Enter' || e.key === ' ') && onZoom?.() : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? `Acercar a ${box.label}` : undefined}
      style={{ cursor: clickable ? 'zoom-in' : 'default' }}
    >
      {person && <circle cx={cx} cy={box.y - 14} r={20} className="fill-ink" />}
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        rx={12}
        className={person ? 'fill-ink' : external ? 'fill-sunken stroke-muted' : 'fill-panel'}
        stroke={person || external ? undefined : ACCENT}
        strokeWidth={box.zoomInto ? 5 : 3}
        strokeDasharray={external ? '7 5' : undefined}
      />
      {showMap ? (
        <>
          <text x={cx} y={box.y + 34} textAnchor="middle" fontSize={24} fontWeight={700} className="fill-ink">
            {box.label}
          </text>
          <MetroMap decorative x={box.x + 14} y={box.y + 46} width={box.w - 28} height={box.h - 96} />
          <text x={cx} y={box.y + box.h - 36} textAnchor="middle" fontSize={14} className="fill-muted">
            {box.detail}
          </text>
        </>
      ) : (
        <>
          <text x={cx} y={box.y + 22} textAnchor="middle" fontSize={12} fontWeight={700} letterSpacing={1} className={person ? 'fill-bg' : 'fill-muted'} opacity={person ? 0.75 : 1}>
            {kindLabel[box.kind].toUpperCase()}
          </text>
          <text x={cx} y={box.y + box.h / 2 + 5} textAnchor="middle" fontSize={19} fontWeight={700} className={person ? 'fill-bg' : 'fill-ink'}>
            {box.label}
          </text>
          {box.detail && (
            <text x={cx} y={box.y + box.h / 2 + 26} textAnchor="middle" fontSize={13.5} className={person ? 'fill-bg' : 'fill-muted'} opacity={person ? 0.8 : 1}>
              {box.detail}
            </text>
          )}
        </>
      )}
      {box.zoomInto && (
        <g transform={`translate(${cx} ${box.y + box.h - 6})`}>
          <rect x={-58} y={-13} width={116} height={26} rx={13} fill={ACCENT} />
          <text textAnchor="middle" y={5} fontSize={14} fontWeight={700} fill="#fff">
            ⊕ Acercar
          </text>
        </g>
      )}
    </g>
  )
}

export function C4Section() {
  const [[index, dir], setState] = useState<[number, number]>([0, 1])
  const level = c4Levels[index]
  const go = (i: number) => {
    if (i < 0 || i >= c4Levels.length || i === index) return
    setState([i, i > index ? 1 : -1])
  }
  const byId = Object.fromEntries(level.boxes.map((b) => [b.id, b]))

  return (
    <SectionShell
      eyebrow="Parada · Visualizar"
      title="El modelo C4: un mapa con cuatro niveles de zoom"
      lead="Igual que un mapa en línea, una arquitectura se dibuja a distintas escalas. C4 (Simon Brown) propone cuatro: Contexto, Contenedores, Componentes y Código."
    >
      <div className="grid gap-5 lg:grid-cols-12">
        <ol className="grid content-start gap-2 lg:col-span-3">
          {c4Levels.map((l, i) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={i === index ? 'step' : undefined}
                className={`grid w-full grid-cols-[auto_1fr] items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                  i === index ? 'border-ink bg-ink text-bg' : 'border-rule bg-panel hover:bg-sunken'
                }`}
              >
                <span className="grid h-11 w-11 place-items-center rounded-lg font-cond text-2xl font-bold" style={{ background: ACCENT, color: '#fff' }}>
                  {l.number}
                </span>
                <span>
                  <span className="block text-xl font-bold leading-tight">{l.name}</span>
                  <span className={`block text-sm leading-snug ${i === index ? 'opacity-80' : 'text-muted'}`}>{l.metro}</span>
                </span>
              </button>
            </li>
          ))}
          <li className="mt-1 flex gap-2">
            <button type="button" className="btn flex-1" disabled={index === 0} onClick={() => go(index - 1)}>
              ⊖ Alejar
            </button>
            <button type="button" className="btn-solid flex-1" disabled={index === c4Levels.length - 1} onClick={() => go(index + 1)}>
              ⊕ Acercar
            </button>
          </li>
        </ol>

        <div className="lg:col-span-9">
          <div className="card relative aspect-[9/4] min-h-[16rem] overflow-hidden bg-sunken/50">
            <AnimatePresence custom={dir} initial={false}>
              <motion.div
                key={level.id}
                custom={dir}
                className="absolute inset-0"
                variants={{
                  enter: (d: number) => ({ opacity: 0, scale: d > 0 ? 0.5 : 1.7 }),
                  center: { opacity: 1, scale: 1 },
                  exit: (d: number) => ({ opacity: 0, scale: d > 0 ? 1.9 : 0.5 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              >
                {level.code ? (
                  <div className="flex h-full flex-col p-4">
                    <p className="eyebrow mb-2">Dentro de: {level.frame}</p>
                    <pre className="flex-1 overflow-auto rounded-lg bg-ink p-4 font-mono text-[0.8rem] leading-relaxed text-bg">{level.code}</pre>
                  </div>
                ) : (
                  <svg viewBox="0 0 900 400" className="h-full w-full" role="img" aria-label={`Diagrama C4 de nivel ${level.number}: ${level.name}`}>
                    <defs>
                      <marker id="c4-flecha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                        <path d="M0 0 L10 5 L0 10 z" className="fill-muted" />
                      </marker>
                    </defs>
                    {level.frame && (
                      <>
                        <rect x={8} y={8} width={884} height={384} rx={16} fill="none" stroke={ACCENT} strokeWidth={2} strokeDasharray="9 7" />
                        <text x={24} y={34} fontSize={16} fontWeight={700} fill={ACCENT}>
                          Dentro de: {level.frame}
                        </text>
                      </>
                    )}
                    {level.arrows.map((a) => {
                      const p1 = edgePoint(byId[a.from], byId[a.to])
                      const p2 = edgePoint(byId[a.to], byId[a.from])
                      return (
                        <g key={`${a.from}-${a.to}`}>
                          <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} className="stroke-muted" strokeWidth={2.5} markerEnd="url(#c4-flecha)" />
                          {a.label && (
                            <text
                              x={(p1.x + p2.x) / 2}
                              y={(p1.y + p2.y) / 2 - 7}
                              textAnchor="middle"
                              fontSize={14}
                              fontWeight={600}
                              className="fill-ink stroke-bg"
                              strokeWidth={5}
                              paintOrder="stroke"
                            >
                              {a.label}
                            </text>
                          )}
                        </g>
                      )
                    })}
                    {level.boxes.map((b) => (
                      <Box key={b.id} box={b} onZoom={() => go(index + 1)} showMap={level.id === 'contexto' && b.kind === 'system'} />
                    ))}
                  </svg>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <p className="eyebrow">
                Nivel {level.number} · {level.name}
              </p>
              <p className="mt-1 text-2xl font-bold leading-snug">{level.question}</p>
              <p className="mt-2 text-lg leading-relaxed">{level.description}</p>
            </div>
            <div className="grid content-start gap-3">
              <div className="border-l-4 pl-3" style={{ borderColor: ACCENT }}>
                <p className="eyebrow">En el metro</p>
                <p className="text-lg font-semibold leading-snug">{level.metro}</p>
              </div>
              <div className="border-l-4 border-rule pl-3">
                <p className="eyebrow">¿Para quién?</p>
                <p className="leading-snug">{level.audience}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
