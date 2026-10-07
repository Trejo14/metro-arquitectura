import type { StationId } from './types'

/* RUTA DE EVOLUCIÓN: cómo cambia la arquitectura de un sistema conforme crece. Cifras ilustrativas. */

export interface EvolutionStage {
  stations: StationId[]
  title: string
  users: string
  team: string
  description: string
  /** El dolor que empuja a pasar a la siguiente parada */
  pain?: string
}

export const evolutionStages: EvolutionStage[] = [
  {
    stations: ['monolitica'],
    title: 'Monolítica',
    users: 'Cientos de usuarios',
    team: '2 a 5 personas',
    description:
      'Se empieza por lo simple: una aplicación, una base de datos, un despliegue. Lo importante es lanzar y aprender qué necesita el negocio.',
    pain: 'El código crece y todo depende de todo: cada cambio rompe algo en otra parte.',
  },
  {
    stations: ['monolito-modular'],
    title: 'Monolito modular',
    users: 'Miles de usuarios',
    team: '5 a 20 personas',
    description:
      'Sin cambiar el despliegue, se trazan fronteras internas: módulos con interfaz pública y datos propios. Se recupera el orden sin pagar el costo de un sistema distribuido.',
    pain: 'Un módulo recibe mucho más tráfico que los demás y varios equipos se estorban al desplegar.',
  },
  {
    stations: ['microservicios', 'event-driven'],
    title: 'Microservicios + Event-driven',
    users: 'Cientos de miles de usuarios',
    team: 'Varios equipos',
    description:
      'Solo los módulos que lo necesitan se extraen como servicios independientes, con su propia base de datos, y se comunican mediante eventos. Se gana escala y autonomía a cambio de complejidad operativa.',
  },
]

export const evolutionModules = ['Pedidos', 'Pagos', 'Catálogo', 'Cuentas']
