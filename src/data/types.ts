export type LineId = 'L1' | 'L2' | 'L3' | 'L4' | 'L5'

export interface Line {
  id: LineId
  number: number
  name: string
  description: string
  color: string
  /** Color del texto sobre el color de la línea */
  ink: string
  underConstruction?: boolean
}

export type StationId =
  | 'monolitica'
  | 'capas'
  | 'mvc'
  | 'cliente-servidor'
  | 'soa'
  | 'microservicios'
  | 'event-driven'
  | 'serverless'
  | 'hexagonal'
  | 'clean'
  | 'monolito-modular'
  | 'agentes-ia'
  | 'edge'
  | 'cell-based'

export interface DiagramNode {
  id: string
  label: string
  /** Centro del nodo dentro de un lienzo de 640 × 300 */
  x: number
  y: number
  w?: number
  h?: number
  shape?: 'box' | 'hex' | 'db'
  /** Texto que aparece al pasar el cursor o dar clic */
  desc: string
}

export interface DiagramZone {
  label: string
  x: number
  y: number
  w: number
  h: number
}

export interface Diagram {
  zones?: DiagramZone[]
  nodes: DiagramNode[]
  edges: [string, string][]
  /** Recorrido del tren: en qué nodo está y qué ocurre en ese paso */
  flow: { at: string; text: string }[]
}

export interface Ratings {
  escalabilidad: number
  complejidad: number
  costo: number
  velocidad: number
  equipo: number
}

export interface Transfer {
  to: StationId
  note: string
}

export interface Station {
  id: StationId
  line: LineId
  name: string
  shortName?: string
  /** Año usado para ordenar la línea del tiempo */
  year: number
  /** Texto visible del "año de inauguración" */
  yearLabel: string
  yearNote: string
  metaphor: string
  definition: string
  pros: string[]
  cons: string[]
  useWhen: string[]
  avoidWhen: string[]
  companies: string[]
  tech: string[]
  ratings: Ratings
  transfers: Transfer[]
  diagram: Diagram
}
