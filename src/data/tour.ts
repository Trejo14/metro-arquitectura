import { stations } from './stations'

/*
 * ORDEN DEL RECORRIDO
 * Las flechas ← → del teclado avanzan por esta lista, en este orden.
 * Cada entrada es una ruta (lo que va después de "#/" en la URL).
 */

export interface Section {
  route: string
  label: string
  /** Etiqueta corta para la barra superior */
  short: string
}

export const sections: Section[] = [
  { route: 'bienvenida', label: 'Bienvenida a la red', short: 'Inicio' },
  { route: 'mapa', label: 'Mapa principal', short: 'Mapa' },
  { route: 'c4', label: 'Visualizar: modelo C4', short: 'Visualizar' },
  { route: 'planificar', label: 'Planificar', short: 'Planificar' },
  { route: 'hora-pico', label: 'Comunicar: simulador "Hora pico"', short: 'Hora pico' },
  { route: 'historia', label: 'Historia de la red', short: 'Historia' },
  { route: 'juego', label: 'Juego: ¿En qué estación te bajas?', short: 'Juego' },
  { route: 'fin', label: 'Fin del recorrido', short: 'Fin' },
]

export const stationRoute = (id: string) => `estacion/${id}`

export const tour: string[] = [
  'bienvenida',
  'mapa',
  ...stations.map((s) => stationRoute(s.id)),
  'c4',
  'planificar',
  'hora-pico',
  'historia',
  'juego',
  'fin',
]
