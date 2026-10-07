import type { Line, LineId } from './types'

// Cambia aquí nombres y colores de las líneas. El color se usa en todo el sitio.
export const lines: Line[] = [
  {
    id: 'L1',
    number: 1,
    name: 'Clásicas',
    description: 'Los estilos con los que empezó casi todo el software.',
    color: '#E5383B',
    ink: '#ffffff',
  },
  {
    id: 'L2',
    number: 2,
    name: 'Distribuidas',
    description: 'El sistema se reparte entre varias máquinas que se comunican por red.',
    color: '#1D7FD8',
    ink: '#ffffff',
  },
  {
    id: 'L3',
    number: 3,
    name: 'Eventos y nube',
    description: 'Componentes que reaccionan a sucesos y cómputo que se paga por uso.',
    color: '#1FA35B',
    ink: '#ffffff',
  },
  {
    id: 'L4',
    number: 4,
    name: 'Diseño interno',
    description: 'Cómo organizar el código por dentro para proteger la lógica de negocio.',
    color: '#8E44C9',
    ink: '#ffffff',
  },
  {
    id: 'L5',
    number: 5,
    name: 'Futuro',
    description: 'Línea en construcción: las arquitecturas con mayor crecimiento.',
    color: '#F28C0F',
    ink: '#1a1200',
    underConstruction: true,
  },
]

export const lineById = Object.fromEntries(lines.map((l) => [l.id, l])) as Record<LineId, Line>
