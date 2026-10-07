import type { LineId, StationId } from './types'

/*
 * GEOMETRÍA DEL MAPA (lienzo de 1200 × 650)
 * Las líneas solo usan tramos a 90° y 45°. Si mueves una estación,
 * ajusta también el trazo ("path") de su línea para que pase por ella.
 */

export const MAP_W = 1200
export const MAP_H = 650

export interface StationPos {
  x: number
  y: number
  /** Dónde va la etiqueta respecto al círculo */
  label: 'top' | 'bottom' | 'left' | 'right'
  /** Texto de la etiqueta, una entrada por renglón */
  text: string[]
}

export const stationPos: Record<StationId, StationPos> = {
  // Línea 1
  monolitica: { x: 160, y: 180, label: 'top', text: ['Monolítica'] },
  capas: { x: 380, y: 180, label: 'top', text: ['En capas'] },
  mvc: { x: 660, y: 240, label: 'right', text: ['MVC'] },
  // Línea 2
  'cliente-servidor': { x: 740, y: 100, label: 'top', text: ['Cliente-servidor'] },
  soa: { x: 900, y: 100, label: 'top', text: ['SOA'] },
  microservicios: { x: 1000, y: 290, label: 'right', text: ['Microservicios'] },
  // Línea 3
  'event-driven': { x: 1000, y: 380, label: 'right', text: ['Event-driven'] },
  serverless: { x: 720, y: 470, label: 'bottom', text: ['Serverless'] },
  // Línea 4
  hexagonal: { x: 680, y: 360, label: 'bottom', text: ['Hexagonal'] },
  clean: { x: 380, y: 300, label: 'bottom', text: ['Clean', 'Architecture'] },
  // Línea 5
  'monolito-modular': { x: 160, y: 290, label: 'right', text: ['Monolito', 'modular'] },
  'agentes-ia': { x: 430, y: 580, label: 'bottom', text: ['Agentes de IA y RAG'] },
  edge: { x: 690, y: 580, label: 'bottom', text: ['Edge computing'] },
  'cell-based': { x: 940, y: 580, label: 'bottom', text: ['Cell-based'] },
}

export interface LineGeometry {
  path: string
  /** Posición del distintivo con el número de línea */
  badge: { x: number; y: number }
  /** Segundos que tarda el tren en ir de un extremo al otro */
  trainSeconds: number
}

export const lineGeometry: Record<LineId, LineGeometry> = {
  L1: { path: 'M160 180 H520 L580 240 H660', badge: { x: 106, y: 180 }, trainSeconds: 9 },
  L2: { path: 'M740 100 H900 L1000 200 V290', badge: { x: 686, y: 100 }, trainSeconds: 8 },
  L3: { path: 'M1000 380 H900 L810 470 H720', badge: { x: 1054, y: 432 }, trainSeconds: 7 },
  L4: { path: 'M380 300 H520 L580 360 H680', badge: { x: 326, y: 300 }, trainSeconds: 7 },
  L5: { path: 'M160 290 V500 L240 580 H940', badge: { x: 994, y: 580 }, trainSeconds: 14 },
}

/** Pasillos de transbordo dibujados en el mapa (entre estaciones de líneas distintas). */
export const connectors: [StationId, StationId][] = [
  ['monolitica', 'monolito-modular'],
  ['capas', 'clean'],
  ['microservicios', 'event-driven'],
]

/** Estaciones que se dibujan con doble círculo. */
export const interchangeStations = new Set<StationId>(connectors.flat())
