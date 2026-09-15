import '../css/variables.css'
import '../css/base.css'
import '../css/header.css'
import '../css/footer.css'
import '../css/share.css'

import { renderHeader } from '../components/header.js'
import { renderFooter } from '../components/footer.js'
import { renderShare } from '../components/share.js'
import { initSmoothScroll } from '../lib/smoothScroll.js'

const NAV_FLAG = 'fp:navigating'
// Tiempo mínimo que el loader entrante permanece visible antes del fade-out.
const LOADER_MIN_MS = 400

function initLoader() {
  // El elemento y su CSS los inyecta el plugin sharedShell (vite.config.js)
  // en el HTML estático; aquí sólo gestionamos el comportamiento.
  const loader = document.querySelector('.page-loader')
  if (!loader) return

  // Si venimos de una navegación interna, el <html> ya lleva .fp-incoming
  // (puesto por el script inline del head) y el loader nace visible.
  const html = document.documentElement
  const incoming = html.classList.contains('fp-incoming')
  if (incoming) {
    sessionStorage.removeItem(NAV_FLAG)
    loader.classList.add('is-active', 'no-transition')
    html.classList.remove('fp-incoming')

    const dismiss = () => {
      // Rehabilita la transición y fuerza un reflow antes de quitar is-active,
      // así el fade-out usa los 600ms del CSS. Sin rAF: en pestañas ocultas
      // no se dispara y el loader se quedaría clavado.
      loader.classList.remove('no-transition')
      void loader.offsetWidth
      loader.classList.remove('is-active')
    }
    // Esperamos a load + fuentes y garantizamos un tiempo mínimo en pantalla,
    // para que el loader tape por completo el pintado inicial de la página.
    const start = performance.now()
    const ready = () => {
      const fonts = document.fonts?.ready ?? Promise.resolve()
      fonts.then(() => {
        const wait = Math.max(0, LOADER_MIN_MS - (performance.now() - start))
        setTimeout(dismiss, wait)
      })
    }
    if (document.readyState === 'complete') ready()
    else window.addEventListener('load', ready, { once: true })
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]')
    if (!link) return

    const url = new URL(link.href, location.href)
    if (url.origin !== location.origin) return
    if (url.pathname === location.pathname) return
    if (link.target === '_blank') return

    e.preventDefault()
    sessionStorage.setItem(NAV_FLAG, '1')
    loader.classList.add('is-active')
    setTimeout(() => { location.href = link.href }, 300)
  })
}

export function initPageShell(current) {
  initSmoothScroll()
  renderHeader(document.querySelector('header'), { current })
  renderFooter(document.querySelector('footer'))
  renderShare(document.querySelector('[data-share]'))
  initLoader()
}
