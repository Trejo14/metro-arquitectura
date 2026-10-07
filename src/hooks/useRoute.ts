import { useCallback, useEffect, useState } from 'react'

const read = () => window.location.hash.replace(/^#\/?/, '') || 'bienvenida'

/** Enrutador mínimo basado en el hash (#/mapa, #/estacion/mvc…). Funciona en hosting estático. */
export function useRoute(): [string, (route: string) => void] {
  const [route, setRoute] = useState(read)

  useEffect(() => {
    const onHash = () => setRoute(read())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = useCallback((next: string) => {
    window.location.hash = `/${next}`
  }, [])

  return [route, navigate]
}
