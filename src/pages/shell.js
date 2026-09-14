import '../css/variables.css'
import '../css/base.css'
import '../css/header.css'
import '../css/footer.css'
import '../css/share.css'

import { renderHeader } from '../components/header.js'
import { renderFooter } from '../components/footer.js'
import { renderShare } from '../components/share.js'

function initLoader() {
  const loader = document.createElement('div')
  loader.className = 'page-loader'
  loader.setAttribute('aria-hidden', 'true')
  loader.innerHTML = '<div class="lds-dual-ring"></div>'
  document.body.appendChild(loader)

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]')
    if (!link) return

    const url = new URL(link.href, location.href)
    if (url.origin !== location.origin) return
    if (url.pathname === location.pathname) return
    if (link.target === '_blank') return

    e.preventDefault()
    loader.classList.add('is-active')
    setTimeout(() => { location.href = link.href }, 300)
  })
}

export function initPageShell(current) {
  renderHeader(document.querySelector('header'), { current })
  renderFooter(document.querySelector('footer'))
  renderShare(document.querySelector('[data-share]'))
  initLoader()
  document.body.classList.remove('is-loading')
}
