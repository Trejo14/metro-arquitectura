import type { StationId } from './types'

/* JUEGO "¿En qué estación te bajas?" — edita aquí escenarios, opciones y retroalimentación. */

export interface QuizQuestion {
  scenario: string
  options: StationId[]
  /** Una o varias respuestas válidas */
  correct: StationId[]
  feedback: string
}

export const quiz: QuizQuestion[] = [
  {
    scenario: 'Tienes 2 desarrolladores y 1 mes para lanzar.',
    options: ['microservicios', 'monolitica', 'cell-based', 'monolito-modular'],
    correct: ['monolitica', 'monolito-modular'],
    feedback:
      'Con poco tiempo y poca gente, lo simple gana: un solo despliegue. La Monolítica es la más rápida; el Monolito modular agrega orden por casi el mismo costo. Las dos estaciones son válidas.',
  },
  {
    scenario: 'Tu tráfico tiene picos impredecibles y quieres pagar solo por uso.',
    options: ['serverless', 'capas', 'soa', 'hexagonal'],
    correct: ['serverless'],
    feedback: 'Serverless escala sola (incluso a cero) y cobra únicamente por el tiempo de ejecución: los trenes solo salen cuando hay pasajeros.',
  },
  {
    scenario: 'Tienes muchos equipos independientes que despliegan a diario.',
    options: ['monolitica', 'mvc', 'microservicios', 'cliente-servidor'],
    correct: ['microservicios'],
    feedback: 'Con microservicios cada equipo es dueño de su servicio y lo despliega sin coordinarse con los demás.',
  },
  {
    scenario: 'Necesitas reaccionar en tiempo real a cambios de estado.',
    options: ['clean', 'event-driven', 'capas', 'monolitica'],
    correct: ['event-driven'],
    feedback: 'En una arquitectura dirigida por eventos, cada cambio se anuncia por el altavoz y los interesados reaccionan de inmediato.',
  },
  {
    scenario: 'Quieres un asistente que responda preguntas sobre tus documentos usando IA.',
    options: ['soa', 'edge', 'agentes-ia', 'mvc'],
    correct: ['agentes-ia'],
    feedback: 'RAG busca primero en tus documentos y le entrega al modelo los fragmentos relevantes para que responda con base en ellos.',
  },
  {
    scenario: 'Necesitas latencia mínima para usuarios en distintas regiones del mundo.',
    options: ['edge', 'monolitica', 'hexagonal', 'soa'],
    correct: ['edge'],
    feedback: 'Edge computing ejecuta el código en nodos cercanos a cada usuario: estaciones de barrio en lugar de un único centro.',
  },
]

export const quizVerdicts: { min: number; text: string }[] = [
  { min: 6, text: 'Recorrido perfecto: ya puedes dirigir la red.' },
  { min: 4, text: 'Buen viaje: conoces bien casi todas las estaciones.' },
  { min: 2, text: 'Te pasaste un par de estaciones. Vuelve al mapa y repasa sus letreros.' },
  { min: 0, text: 'Te subiste en dirección contraria. Date otra vuelta por el mapa.' },
]
