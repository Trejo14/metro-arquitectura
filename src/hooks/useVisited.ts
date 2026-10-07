import { useCallback, useEffect, useState } from 'react'
import type { StationId } from '../data/types'
import { loadStored, saveStored } from './storage'

/** Estaciones "selladas" en la tarjeta de metro. Se guardan en el navegador. */
export function useVisited() {
  const [visited, setVisited] = useState<StationId[]>(() => loadStored<StationId[]>('metro-visitadas', []))

  useEffect(() => saveStored('metro-visitadas', visited), [visited])

  const stamp = useCallback((id: StationId) => {
    setVisited((v) => (v.includes(id) ? v : [...v, id]))
  }, [])

  const reset = useCallback(() => setVisited([]), [])

  return { visited, stamp, reset }
}
