/*
 * MODELO C4 (Simon Brown): cuatro niveles de zoom para dibujar una arquitectura.
 * Sistema de ejemplo: "MetroPase", la app para recargar y validar tarjetas de la red.
 * Lienzo de cada nivel: 900 × 400. x,y son la esquina superior izquierda de cada caja.
 */

export type C4Kind = 'person' | 'system' | 'external' | 'container' | 'component'

export interface C4Box {
  id: string
  kind: C4Kind
  label: string
  /** Tecnología o descripción breve */
  detail?: string
  x: number
  y: number
  w: number
  h: number
  /** Es la caja en la que "entramos" al acercar al siguiente nivel */
  zoomInto?: boolean
}

export interface C4Arrow {
  from: string
  to: string
  label?: string
}

export interface C4Level {
  id: 'contexto' | 'contenedores' | 'componentes' | 'codigo'
  number: number
  name: string
  /** Equivalente en el metro */
  metro: string
  question: string
  audience: string
  description: string
  /** Marco que rodea el diagrama (el elemento del nivel anterior que se amplió) */
  frame?: string
  boxes: C4Box[]
  arrows: C4Arrow[]
  code?: string
}

export const c4Levels: C4Level[] = [
  {
    id: 'contexto',
    number: 1,
    name: 'Contexto',
    metro: 'La red completa vista desde arriba',
    question: '¿Qué es el sistema, quién lo usa y con qué otros sistemas se conecta?',
    audience: 'Cualquier persona: clientes, directivos, equipo técnico.',
    description:
      'El sistema es una sola caja. No importa la tecnología: importan las personas y los sistemas vecinos. Es el mapa de toda la red, sin entrar a ninguna estación.',
    boxes: [
      { id: 'pasajero', kind: 'person', label: 'Pasajero', detail: 'Recarga su tarjeta', x: 30, y: 150, w: 170, h: 100 },
      { id: 'sistema', kind: 'system', label: 'MetroPase', detail: 'Sistema de recarga y validación de tarjetas', x: 300, y: 60, w: 320, h: 280, zoomInto: true },
      { id: 'pagos', kind: 'external', label: 'Pasarela de pagos', detail: 'Sistema externo', x: 710, y: 70, w: 170, h: 90 },
      { id: 'torniquetes', kind: 'external', label: 'Torniquetes', detail: 'Sistema externo', x: 710, y: 240, w: 170, h: 90 },
    ],
    arrows: [
      { from: 'pasajero', to: 'sistema', label: 'usa' },
      { from: 'sistema', to: 'pagos', label: 'cobra con' },
      { from: 'sistema', to: 'torniquetes', label: 'autoriza a' },
    ],
  },
  {
    id: 'contenedores',
    number: 2,
    name: 'Contenedores',
    metro: 'Las líneas y los grandes edificios de la red',
    question: '¿De qué grandes piezas ejecutables está hecho el sistema y cómo se comunican?',
    audience: 'Arquitectos, desarrolladores y operaciones.',
    description:
      'Abrimos la caja del sistema. Un contenedor es algo que se ejecuta o guarda datos por separado: una app móvil, una API, una base de datos. (No confundir con los contenedores de Docker.) Aquí se ven las decisiones de tecnología.',
    frame: 'MetroPase',
    boxes: [
      { id: 'app', kind: 'container', label: 'App móvil', detail: 'Kotlin / Swift', x: 40, y: 70, w: 180, h: 90 },
      { id: 'web', kind: 'container', label: 'Aplicación web', detail: 'React', x: 40, y: 240, w: 180, h: 90 },
      { id: 'api', kind: 'container', label: 'API', detail: 'Node.js · REST', x: 350, y: 140, w: 200, h: 120, zoomInto: true },
      { id: 'bd', kind: 'container', label: 'Base de datos', detail: 'PostgreSQL', x: 680, y: 70, w: 180, h: 90 },
      { id: 'cola', kind: 'container', label: 'Cola de eventos', detail: 'Kafka', x: 680, y: 240, w: 180, h: 90 },
    ],
    arrows: [
      { from: 'app', to: 'api', label: 'HTTPS / JSON' },
      { from: 'web', to: 'api', label: 'HTTPS / JSON' },
      { from: 'api', to: 'bd', label: 'lee y escribe' },
      { from: 'api', to: 'cola', label: 'publica eventos' },
    ],
  },
  {
    id: 'componentes',
    number: 3,
    name: 'Componentes',
    metro: 'El interior de una estación: andenes, taquillas, pasillos',
    question: '¿Cómo está organizado un contenedor por dentro?',
    audience: 'El equipo de desarrollo.',
    description:
      'Entramos a un contenedor (la API) y vemos sus bloques principales y sus responsabilidades. Aquí se reconocen los estilos de la Línea 4: capas, hexagonal, Clean Architecture.',
    frame: 'API',
    boxes: [
      { id: 'ctrl', kind: 'component', label: 'Controlador de recargas', detail: 'Recibe las peticiones HTTP', x: 40, y: 150, w: 210, h: 100 },
      { id: 'tarifas', kind: 'component', label: 'Servicio de tarifas', detail: 'Reglas de negocio', x: 345, y: 150, w: 210, h: 100, zoomInto: true },
      { id: 'repo', kind: 'component', label: 'Repositorio de tarjetas', detail: 'Acceso a la base de datos', x: 650, y: 60, w: 210, h: 100 },
      { id: 'cliente', kind: 'component', label: 'Cliente de pagos', detail: 'Habla con la pasarela', x: 650, y: 240, w: 210, h: 100 },
    ],
    arrows: [
      { from: 'ctrl', to: 'tarifas', label: 'invoca' },
      { from: 'tarifas', to: 'repo', label: 'usa' },
      { from: 'tarifas', to: 'cliente', label: 'usa' },
    ],
  },
  {
    id: 'codigo',
    number: 4,
    name: 'Código',
    metro: 'El plano de un torniquete (opcional)',
    question: '¿Cómo está implementado un componente?',
    audience: 'Quien programa ese componente.',
    description:
      'El nivel más detallado: clases, funciones, tablas. Casi nunca se dibuja a mano, porque cambia muy rápido y el propio código (o el IDE) ya lo muestra. Por eso C4 lo considera opcional.',
    frame: 'Servicio de tarifas',
    boxes: [],
    arrows: [],
    code: `interface RepositorioDeTarjetas {
  buscar(id: string): Promise<Tarjeta>
  guardar(tarjeta: Tarjeta): Promise<void>
}

class ServicioDeTarifas {
  constructor(
    private tarjetas: RepositorioDeTarjetas,
    private pagos: ClienteDePagos,
  ) {}

  async recargar(idTarjeta: string, monto: number) {
    if (monto <= 0) throw new Error('Monto inválido')
    const tarjeta = await this.tarjetas.buscar(idTarjeta)
    await this.pagos.cobrar(tarjeta.titular, monto)
    tarjeta.saldo += monto
    await this.tarjetas.guardar(tarjeta)
  }
}`,
  },
]
