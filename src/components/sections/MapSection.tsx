import { useState } from 'react'
import { lineById } from '../../data/lines'
import type { LineId, StationId } from '../../data/types'
import { SectionShell } from '../layout/SectionShell'
import { Legend } from '../map/Legend'
import { MetroMap } from '../map/MetroMap'

interface Props {
  visited: StationId[]
  active: StationId | null
  onSelect: (id: StationId) => void
}

export function MapSection({ visited, active, onSelect }: Props) {
  const [focusLine, setFocusLine] = useState<LineId | null>(null)
  return (
    <SectionShell
      eyebrow="Parada 2 · Mapa principal"
      title="La red completa"
      lead={
        focusLine
          ? `Línea ${lineById[focusLine].number} · ${lineById[focusLine].name}: ${lineById[focusLine].description}`
          : 'Cada línea es una familia de arquitecturas y cada estación, una arquitectura. Da clic en una estación para abrir su letrero.'
      }
    >
      <div className="card overflow-hidden">
        <MetroMap
          className="block max-h-[calc(100vh-19rem)] min-h-[20rem] w-full"
          onSelect={onSelect}
          visited={visited}
          active={active}
          focusLine={focusLine}
        />
      </div>
      <div className="mt-4">
        <Legend focusLine={focusLine} onFocusLine={setFocusLine} />
      </div>
    </SectionShell>
  )
}
