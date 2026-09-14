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

function initLoader() {
  const loader = document.createElement('div')
  loader.className = 'page-loader'
  loader.setAttribute('aria-hidden', 'true')
  loader.innerHTML = '<div class="lds-dual-ring"></div>'

  // Si venimos de una navegación interna, el loader arranca ya visible y hace
  // fade-out cuando la página termina de cargar — para que la salida sea tan
  // gradual como la entrada.
  const incoming = sessionStorage.getItem(NAV_FLAG) === '1'
  if (incoming) {
    loader.classList.add('is-active', 'no-transition')
    sessionStorage.removeItem(NAV_FLAG)
  }
  document.body.appendChild(loader)

  if (incoming) {
    const dismiss = () => {
      // Rehabilita la transición justo antes de quitar is-active,
      // así el fade-out usa los 600ms del CSS.
      requestAnimationFrame(() => {
        loader.classList.remove('no-transition')
        requestAnimationFrame(() => loader.classList.remove('is-active'))
      })
    }
    if (document.readyState === 'complete') dismiss()
    else window.addEventListener('load', dismiss, { once: true })
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
    setTimeout(() => { location.href = link.href }, 600)
  })
}

export function initPageShell(current) {
  initSmoothScroll()
  renderHeader(document.querySelector('header'), { current })
  renderFooter(document.querySelector('footer'))
  renderShare(document.querySelector('[data-share]'))
  initLoader()
}
