import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

let instance = null

export function initSmoothScroll() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return null

  instance = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
    autoRaf: true,
  })

  if (import.meta.env?.DEV) {
    window.__lenis = instance
  }

  // Anchors internos (#seccion, #contenido): delegamos a lenis para que el
  // scroll siga siendo suave y coherente con el resto de la página.
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]')
    if (!link) return
    const hash = link.getAttribute('href')
    if (hash === '#' || hash.length < 2) return
    const target = document.querySelector(hash)
    if (!target) return
    e.preventDefault()
    instance.scrollTo(target, { offset: 0 })
    history.pushState(null, '', hash)
  })

  return instance
}

export function scrollToTop() {
  if (instance) instance.scrollTo(0)
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
