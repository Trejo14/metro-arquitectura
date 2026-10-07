import { motion } from 'framer-motion'
import { lines } from '../../data/lines'
import { stations } from '../../data/stations'
import { MetroMap } from '../map/MetroMap'

const comoLeer = [
  { titulo: 'Línea', texto: 'Una familia de arquitecturas, con su propio color.' },
  { titulo: 'Estación', texto: 'Una arquitectura. Da clic para abrir su letrero.' },
  { titulo: 'Transbordo', texto: 'Doble círculo: conecta arquitecturas relacionadas de líneas distintas.' },
  { titulo: 'Trazo punteado', texto: 'Línea en construcción: las arquitecturas que más están creciendo.' },
  { titulo: 'Tren', texto: 'Una petición o un dato que viaja por el sistema.' },
  { titulo: 'Tarjeta de viaje', texto: 'En la esquina: se sella en cada estación que visitas.' },
]

export function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <motion.main
      className="mx-auto grid max-w-[100rem] gap-8 px-4 pb-28 pt-6 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:pt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="lg:col-span-6">
        <p className="eyebrow">Modelos arquitectónicos de software</p>
        <h1 className="mt-2 font-cond text-[clamp(2.5rem,12.5vw,6rem)] font-bold uppercase leading-[0.9] tracking-tight lg:text-[5.6rem] xl:text-[6.6rem]">
          Metro
          <br />
          Arquitectura
        </h1>
        <div className="mt-5 flex h-3 max-w-xl overflow-hidden rounded-full" aria-hidden>
          {lines.map((l) => (
            <span key={l.id} className="flex-1" style={{ background: l.color }} />
          ))}
        </div>

        <h2 className="mt-8 text-2xl font-bold">¿Qué es una arquitectura de software?</h2>
        <p className="mt-2 max-w-2xl text-xl leading-relaxed">
          Es el conjunto de <strong>decisiones estructurales</strong> de un sistema: en qué partes se divide, qué hace cada una y
          cómo se comunican. Son las decisiones más difíciles de cambiar después, igual que el trazado de una red de metro: mover
          una estación es fácil en el plano y carísimo cuando ya está construida.
        </p>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">
          Esta red tiene {lines.length} líneas y {stations.length} estaciones. No hay una estación mejor que otra: cada una te
          lleva a un destino distinto.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button type="button" className="btn-solid !px-6 !py-3 text-xl" onClick={onStart}>
            Entrar a la red →
          </button>
          <p className="text-muted">
            Usa <kbd className="rounded border border-rule bg-panel px-1.5 font-mono">←</kbd>{' '}
            <kbd className="rounded border border-rule bg-panel px-1.5 font-mono">→</kbd> para seguir el recorrido y{' '}
            <kbd className="rounded border border-rule bg-panel px-1.5 font-mono">F</kbd> para pantalla completa.
          </p>
        </div>
      </div>

      <div className="lg:col-span-6">
        <div className="card overflow-hidden">
          <MetroMap decorative className="block w-full" />
        </div>
        <h2 className="eyebrow mb-3 mt-6">Cómo leer el mapa</h2>
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {comoLeer.map((c) => (
            <div key={c.titulo} className="border-l-4 border-ink pl-3">
              <dt className="text-lg font-bold leading-tight">{c.titulo}</dt>
              <dd className="leading-snug text-muted">{c.texto}</dd>
            </div>
          ))}
        </dl>
      </div>
    </motion.main>
  )
}
