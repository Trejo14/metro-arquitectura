/*
 * SIMULADOR "HORA PICO" — parámetros del modelo (simplificado a propósito).
 * La carga se mide en miles de pasajeros (peticiones) por minuto.
 */

export interface SimService {
  id: string
  name: string
  /** Fracción del tráfico total que recibe este servicio (deben sumar 1) */
  share: number
  color: string
}

export const simServices: SimService[] = [
  { id: 'catalogo', name: 'Catálogo', share: 0.45, color: '#1FA35B' },
  { id: 'pedidos', name: 'Pedidos', share: 0.25, color: '#F28C0F' },
  { id: 'pagos', name: 'Pagos', share: 0.2, color: '#1D7FD8' },
  { id: 'cuentas', name: 'Cuentas', share: 0.1, color: '#8E44C9' },
]

export const sim = {
  minLoad: 1,
  maxLoad: 12,
  initialLoad: 3,
  /** Capacidad total del monolito (una sola instancia) */
  monolithCapacity: 6,
  /** Capacidad de UNA instancia de cada microservicio */
  serviceCapacity: 3,
  /** A partir de esta utilización se considera "al límite" */
  warnAt: 0.8,
}
