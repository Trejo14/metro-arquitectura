import type { StationId } from './types'

/*
 * ADR = Architecture Decision Record (registro de decisión de arquitectura).
 * Formato basado en la plantilla de Michael Nygard: contexto, decisión, alternativas y consecuencias.
 * Los tres ejemplos son ficticios y describen al mismo sistema ("MetroPase") en distintos momentos.
 */

export interface Adr {
  id: string
  title: string
  status: 'Aceptada' | 'Propuesta' | 'Reemplazada'
  date: string
  context: string
  decision: string
  alternatives: { name: string; why: string }[]
  positives: string[]
  negatives: string[]
  /** Estaciones relacionadas */
  stations: StationId[]
}

export const adrs: Adr[] = [
  {
    id: 'ADR-001',
    title: 'Iniciar con un monolito modular',
    status: 'Aceptada',
    date: 'Mes 1 del proyecto',
    context:
      'Somos 4 desarrolladores y debemos lanzar la primera versión en 3 meses. Todavía no conocemos bien el dominio: los módulos y sus fronteras van a cambiar. No tenemos a nadie dedicado a infraestructura.',
    decision:
      'Construiremos una sola aplicación desplegable, dividida en módulos (Tarjetas, Recargas, Viajes, Cuentas). Cada módulo expone una interfaz pública y es dueño de sus tablas; ningún módulo consulta las tablas de otro.',
    alternatives: [
      { name: 'Microservicios desde el inicio', why: 'Descartada: demasiada complejidad operativa para 4 personas y fronteras aún inciertas.' },
      { name: 'Monolito sin módulos', why: 'Descartada: más rápida al principio, pero el acoplamiento haría muy cara una futura separación.' },
    ],
    positives: [
      'Un solo despliegue y una sola base de datos: operación sencilla.',
      'Las fronteras quedan listas por si un módulo debe extraerse.',
      'Refactorizar entre módulos es barato mientras aprendemos el dominio.',
    ],
    negatives: [
      'Todo escala junto, aunque solo un módulo reciba carga.',
      'Las fronteras dependen de la disciplina del equipo: agregaremos pruebas que las verifiquen.',
    ],
    stations: ['monolito-modular', 'monolitica', 'microservicios'],
  },
  {
    id: 'ADR-002',
    title: 'Comunicar los módulos mediante eventos para notificaciones y analítica',
    status: 'Aceptada',
    date: 'Mes 8 del proyecto',
    context:
      'Cada recarga debe generar un comprobante, una notificación y un registro para analítica. Hoy el módulo de Recargas llama a los tres de forma directa: si el correo tarda, la recarga tarda; si la analítica falla, la recarga falla.',
    decision:
      'El módulo de Recargas publicará el evento "RecargaRealizada" en un broker de mensajes. Comprobantes, Notificaciones y Analítica se suscribirán y lo procesarán de forma asíncrona.',
    alternatives: [
      { name: 'Mantener las llamadas directas', why: 'Descartada: acopla la recarga a servicios que no son críticos para completarla.' },
      { name: 'Tareas programadas que revisan la base de datos', why: 'Descartada: introduce retrasos y consultas costosas.' },
    ],
    positives: [
      'La recarga responde rápido aunque un consumidor esté lento o caído.',
      'Agregar un nuevo consumidor no requiere modificar el módulo de Recargas.',
      'La cola absorbe los picos de la hora pico.',
    ],
    negatives: [
      'Consistencia eventual: el comprobante puede llegar unos segundos después.',
      'Hay que manejar eventos duplicados (consumidores idempotentes).',
      'Una pieza más que operar y monitorear: el broker.',
    ],
    stations: ['event-driven', 'monolito-modular'],
  },
  {
    id: 'ADR-003',
    title: 'Extraer Recargas como microservicio independiente',
    status: 'Propuesta',
    date: 'Año 2 del proyecto',
    context:
      'El equipo creció a 25 personas en 4 equipos. El módulo de Recargas recibe 20 veces más tráfico que el resto en hora pico y cambia todas las semanas. Cada despliegue obliga a publicar la aplicación completa y los equipos se bloquean entre sí.',
    decision:
      'Extraeremos el módulo de Recargas como un servicio con su propia base de datos y su propio ciclo de despliegue. Se comunicará con el resto mediante su API y los eventos ya existentes. Los demás módulos permanecen en el monolito modular.',
    alternatives: [
      { name: 'Replicar el monolito completo', why: 'Descartada: funciona, pero escala todos los módulos aunque solo uno lo necesita, y no resuelve el bloqueo entre equipos.' },
      { name: 'Migrar todo a microservicios', why: 'Descartada: costo y riesgo altos sin un beneficio claro para los módulos estables.' },
    ],
    positives: [
      'Recargas escala y se despliega sin afectar al resto.',
      'El equipo de Recargas gana autonomía.',
      'Una falla en Recargas ya no tira las consultas de viajes.',
    ],
    negatives: [
      'Aparecen llamadas de red, con latencia y fallas parciales.',
      'Se necesitan trazabilidad distribuida y despliegues automatizados.',
      'Las operaciones que antes eran una transacción ahora requieren compensaciones.',
    ],
    stations: ['microservicios', 'event-driven', 'monolito-modular'],
  },
]
