import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { MetroCard } from './components/layout/MetroCard'
import { TopBar } from './components/layout/TopBar'
import { C4Section } from './components/sections/C4Section'
import { Finale } from './components/sections/Finale'
import { MapSection } from './components/sections/MapSection'
import { PlanSection } from './components/sections/PlanSection'
import { Quiz } from './components/sections/Quiz'
import { RushHour } from './components/sections/RushHour'
import { Timeline } from './components/sections/Timeline'
import { Welcome } from './components/sections/Welcome'
import { StationSign } from './components/station/StationSign'
import { stationById } from './data/stations'
import { stationRoute } from './data/tour'
import type { StationId } from './data/types'
import { usePresentation } from './hooks/usePresentation'
import { useRoute } from './hooks/useRoute'
import { useTheme } from './hooks/useTheme'
import { useVisited } from './hooks/useVisited'

export default function App() {
  const [route, navigate] = useRoute()
  const [theme, toggleTheme] = useTheme()
  const { visited, stamp, reset } = useVisited()
  const presentation = usePresentation(route, navigate)

  const stationId = route.startsWith('estacion/') ? (route.slice('estacion/'.length) as StationId) : null
  const station = stationId ? stationById[stationId] : undefined
  const openStation = (id: StationId) => navigate(stationRoute(id))

  // Sellar la tarjeta al llegar a una estación
  useEffect(() => {
    if (station) stamp(station.id)
  }, [station, stamp])

  // Cada parada empieza arriba
  useEffect(() => {
    if (!route.startsWith('estacion/')) window.scrollTo({ top: 0 })
  }, [route])

  const page = (() => {
    switch (route) {
      case 'bienvenida':
        return <Welcome onStart={() => navigate('mapa')} />
      case 'c4':
        return <C4Section />
      case 'planificar':
        return <PlanSection onOpen={openStation} />
      case 'hora-pico':
        return <RushHour />
      case 'historia':
        return <Timeline onOpen={openStation} />
      case 'juego':
        return <Quiz onOpen={openStation} />
      case 'fin':
        return <Finale visited={visited} />
      default:
        // "mapa", "estacion/…" y cualquier ruta desconocida muestran el mapa
        return <MapSection visited={visited} active={station?.id ?? null} onSelect={openStation} />
    }
  })()

  return (
    <>
      <TopBar route={route} navigate={navigate} theme={theme} toggleTheme={toggleTheme} {...presentation} />
      {page}
      <AnimatePresence>
        {station && <StationSign key="letrero" station={station} onClose={() => navigate('mapa')} onGo={openStation} />}
      </AnimatePresence>
      <MetroCard visited={visited} onGo={openStation} onReset={reset} />
    </>
  )
}
