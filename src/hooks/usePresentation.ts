import { useCallback, useEffect, useState } from 'react'
import { tour } from '../data/tour'

/** Modo presentación: flechas del teclado siguiendo el recorrido + pantalla completa. */
export function usePresentation(route: string, navigate: (r: string) => void) {
  const index = Math.max(0, tour.indexOf(route))
  const prev = index > 0 ? tour[index - 1] : null
  const next = index < tour.length - 1 ? tour[index + 1] : null

  const [fullscreen, setFullscreen] = useState(false)

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.().catch(() => {})
  }, [])

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      // No robar las flechas a controles que las usan (deslizadores, campos de texto, listas).
      const el = e.target as HTMLElement | null
      if (el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))) return

      if ((e.key === 'ArrowRight' || e.key === 'PageDown') && next) {
        e.preventDefault()
        navigate(next)
      } else if ((e.key === 'ArrowLeft' || e.key === 'PageUp') && prev) {
        e.preventDefault()
        navigate(prev)
      } else if (e.key === 'Home') {
        navigate(tour[0])
      } else if (e.key === 'End') {
        navigate(tour[tour.length - 1])
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen()
      } else if (e.key.toLowerCase() === 'm') {
        navigate('mapa')
      } else if (e.key === 'Escape' && route.startsWith('estacion/')) {
        navigate('mapa')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, route, navigate, toggleFullscreen])

  return { index, total: tour.length, prev, next, fullscreen, toggleFullscreen }
}
