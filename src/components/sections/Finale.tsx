import { useState } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { conclusion, credits, publicUrl } from '../../data/credits'
import { lines } from '../../data/lines'
import { stations } from '../../data/stations'
import type { StationId } from '../../data/types'

const defaultUrl = () => publicUrl || window.location.href.split('#')[0]

export function Finale({ visited }: { visited: StationId[] }) {
  const [url, setUrl] = useState(defaultUrl)

  return (
    <motion.main className="mx-auto max-w-[100rem] px-4 pb-28 pt-6 sm:px-6 lg:pt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <p className="eyebrow">Fin del recorrido · Estación terminal</p>
      <motion.h1
        className="mt-2 max-w-6xl text-5xl font-bold leading-[1.02] tracking-tight lg:text-7xl"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {conclusion.quote}
      </motion.h1>
      <div className="mt-5 flex h-3 max-w-3xl overflow-hidden rounded-full" aria-hidden>
        {lines.map((l) => (
          <span key={l.id} className="flex-1" style={{ background: l.color }} />
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-5">
          <h2 className="eyebrow mb-3">Lo que nos llevamos</h2>
          <ol className="grid gap-3">
            {conclusion.points.map((p, i) => (
              <li key={p} className="grid grid-cols-[2.5rem_1fr] items-start gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-md font-cond text-xl font-bold" style={{ background: lines[i % lines.length].color, color: lines[i % lines.length].ink }}>
                  {i + 1}
                </span>
                <span className="text-xl leading-snug">{p}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-lg text-muted">
            Tu tarjeta de viaje: <strong className="text-ink">{visited.length} de {stations.length}</strong> estaciones visitadas.
          </p>
        </section>

        <section className="card p-5 lg:col-span-4">
          <h2 className="eyebrow mb-3">Llévate el mapa</h2>
          <div className="mx-auto w-fit rounded-xl bg-white p-4">
            {/* Siempre oscuro sobre blanco: así lo leen las cámaras, también en modo oscuro */}
            <QRCodeSVG value={url || ' '} size={240} level="M" bgColor="#ffffff" fgColor="#14181f" title="Código QR de la página" />
          </div>
          <label htmlFor="qr-url" className="mt-4 block text-sm font-semibold text-muted">
            Dirección que abre el código
          </label>
          <input
            id="qr-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            spellCheck={false}
            className="mt-1 w-full rounded-lg border border-rule bg-bg px-3 py-2 font-mono text-sm"
          />
          <button type="button" className="mt-2 text-sm text-muted underline underline-offset-2 hover:text-ink" onClick={() => setUrl(defaultUrl())}>
            Usar la dirección actual
          </button>
        </section>

        <section className="lg:col-span-3">
          <h2 className="eyebrow mb-3">Equipo</h2>
          <ul className="grid gap-1.5">
            {credits.team.map((name) => (
              <li key={name} className="text-xl font-semibold leading-tight">
                {name}
              </li>
            ))}
          </ul>
          <dl className="mt-5 grid gap-2 text-lg">
            {[
              ['Materia', credits.course],
              ['Docente', credits.teacher],
              ['Institución', credits.school],
              ['Fecha', credits.date],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow">{k}</dt>
                <dd className="leading-tight">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-2xl font-bold">¡Gracias por viajar con nosotros!</p>
        </section>
      </div>
    </motion.main>
  )
}
