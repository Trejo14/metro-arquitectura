import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { lineById } from '../../data/lines'
import { quiz, quizVerdicts } from '../../data/quiz'
import { stationById } from '../../data/stations'
import type { StationId } from '../../data/types'
import { SectionShell } from '../layout/SectionShell'

export function Quiz({ onOpen }: { onOpen: (id: StationId) => void }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<(StationId | null)[]>(() => quiz.map(() => null))
  const finished = index >= quiz.length
  const score = answers.filter((a, i) => a !== null && quiz[i].correct.includes(a)).length

  const restart = () => {
    setAnswers(quiz.map(() => null))
    setIndex(0)
  }

  if (finished) {
    const verdict = quizVerdicts.find((v) => score >= v.min) ?? quizVerdicts[quizVerdicts.length - 1]
    return (
      <SectionShell eyebrow="Parada · Juego" title="¿En qué estación te bajas?">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card mx-auto max-w-4xl p-6 text-center lg:p-10">
          <p className="eyebrow">Puntaje final</p>
          <p className="font-cond text-[7rem] font-bold leading-none tabular-nums">
            {score}
            <span className="text-muted">/{quiz.length}</span>
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-2xl font-semibold leading-snug">{verdict.text}</p>
          <ol className="mx-auto mt-6 grid max-w-3xl gap-2 text-left">
            {quiz.map((q, i) => {
              const ok = answers[i] !== null && q.correct.includes(answers[i]!)
              return (
                <li key={q.scenario} className="grid grid-cols-[1.75rem_1fr_auto] items-center gap-2 rounded-lg border border-rule px-3 py-2">
                  <span className={`text-xl font-bold ${ok ? 'text-ok' : 'text-bad'}`}>{ok ? '✓' : '✕'}</span>
                  <span className="leading-snug">{q.scenario}</span>
                  <button type="button" className="btn !py-1 text-sm" onClick={() => onOpen(q.correct[0])}>
                    {stationById[q.correct[0]].shortName ?? stationById[q.correct[0]].name} →
                  </button>
                </li>
              )
            })}
          </ol>
          <button type="button" className="btn-solid mt-6 !px-6 !py-3 text-xl" onClick={restart}>
            Volver a jugar
          </button>
        </motion.div>
      </SectionShell>
    )
  }

  const q = quiz[index]
  const answer = answers[index]
  const answered = answer !== null
  const right = answered && q.correct.includes(answer)

  return (
    <SectionShell eyebrow="Parada · Juego" title="¿En qué estación te bajas?" lead="Seis viajeros, seis destinos. Elige la estación que más le conviene a cada uno.">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center gap-3">
          <ol className="flex flex-1 gap-1.5" aria-label={`Pregunta ${index + 1} de ${quiz.length}`}>
            {quiz.map((item, i) => {
              const a = answers[i]
              const bg = a === null ? (i === index ? 'rgb(var(--ink))' : 'rgb(var(--rule))') : item.correct.includes(a) ? 'rgb(var(--ok))' : 'rgb(var(--bad))'
              return <li key={i} className="h-2.5 flex-1 rounded-full" style={{ background: bg }} />
            })}
          </ol>
          <span className="font-cond text-xl font-bold tabular-nums">
            {index + 1}/{quiz.length} · {score} pts
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.22 }}>
            <p className="eyebrow">Escenario {index + 1}</p>
            <h2 className="mt-1 text-3xl font-bold leading-tight lg:text-5xl">«{q.scenario}»</h2>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {q.options.map((id) => {
                const s = stationById[id]
                const line = lineById[s.line]
                const isCorrect = q.correct.includes(id)
                const chosen = answer === id
                const state = !answered ? 'idle' : isCorrect ? 'right' : chosen ? 'wrong' : 'dim'
                return (
                  <li key={id}>
                    <button
                      type="button"
                      disabled={answered}
                      onClick={() => setAnswers((a) => a.map((v, i) => (i === index ? id : v)))}
                      className={`grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border-[3px] bg-panel p-4 text-left transition-all ${
                        state === 'idle'
                          ? 'border-rule hover:-translate-y-0.5 hover:border-ink'
                          : state === 'right'
                            ? 'border-ok'
                            : state === 'wrong'
                              ? 'border-bad'
                              : 'border-rule opacity-45'
                      }`}
                    >
                      <span className="grid h-11 w-11 place-items-center rounded-lg text-2xl font-bold" style={{ background: line.color, color: line.ink }}>
                        {line.number}
                      </span>
                      <span className="text-2xl font-bold leading-tight">{s.shortName ?? s.name}</span>
                      <span className={`text-3xl font-bold ${state === 'right' ? 'text-ok' : 'text-bad'}`} aria-hidden>
                        {state === 'right' ? '✓' : state === 'wrong' ? '✕' : ''}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="mt-5 min-h-[8rem]" aria-live="polite">
              {answered && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`border-l-[6px] pl-4 ${right ? 'border-ok' : 'border-bad'}`}>
                  <p className={`text-2xl font-bold ${right ? 'text-ok' : 'text-bad'}`}>{right ? '¡Aquí te bajas!' : 'Te pasaste de estación.'}</p>
                  <p className="mt-1 max-w-4xl text-xl leading-snug">{q.feedback}</p>
                  <button type="button" className="btn-solid mt-3 !px-5 !py-2.5 text-lg" onClick={() => setIndex(index + 1)}>
                    {index === quiz.length - 1 ? 'Ver puntaje final' : 'Siguiente escenario →'}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionShell>
  )
}
