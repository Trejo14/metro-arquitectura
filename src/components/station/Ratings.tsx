import { ratingLabels } from '../../data/stations'
import type { Ratings as RatingsData } from '../../data/types'

/** Indicadores de 1 a 5, dibujados como tramos de vía. */
export function Ratings({ ratings, color }: { ratings: RatingsData; color: string }) {
  return (
    <dl className="grid gap-2.5">
      {ratingLabels.map(({ key, label, hint }) => {
        const v = ratings[key]
        return (
          <div key={key} className="grid grid-cols-[1fr_auto] items-center gap-x-3" title={hint}>
            <dt className="font-semibold leading-tight">{label}</dt>
            <dd className="flex items-center gap-2">
              <span className="flex gap-1" role="img" aria-label={`${v} de 5`}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className="h-3.5 w-6 rounded-sm"
                    style={{ background: i <= v ? color : 'rgb(var(--rule))' }}
                  />
                ))}
              </span>
              <span className="w-4 text-right font-cond text-lg font-bold tabular-nums">{v}</span>
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
