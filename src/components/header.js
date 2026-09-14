import logo from '../assets/logo-fagoporc.png'
import { NAV_LINKS } from '../nav.js'

export function renderHeader(container, { current = 'inicio' } = {}) {
  if (!container) throw new Error('renderHeader: container is required')

  container.classList.add('header')
  container.innerHTML = `
    <div class="wrap header__inner">
      <a href="index.html" class="header__logo" aria-label="Fagoporc — inicio">
        <img src="${logo}" alt="" width="392" height="181">
      </a>

      <nav class="header__nav" id="nav-principal" aria-label="Principal">
        ${NAV_LINKS.map(({ href, label, key }) => {
          const aria = key === current ? ' aria-current="page"' : ''
          return `<a href="${href}" class="header__link"${aria}>${label}</a>`
        }).join('')}
      </nav>

      <button class="header__toggle" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav-principal">
        <span></span><span></span>
      </button>
    </div>
  `

  const toggle = container.querySelector('.header__toggle')
  const nav = container.querySelector('.header__nav')

  const setMenu = (open) => {
    container.classList.toggle('is-open', open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú')
    document.body.style.overflow = open ? 'hidden' : ''
  }

  const isOpen = () => container.classList.contains('is-open')

  toggle.addEventListener('click', () => setMenu(!isOpen()))

  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenu(false)
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      setMenu(false)
      toggle.focus()
    }
  })

  // The open panel covers the page, so focus reaching anything behind it means
  // the user has tabbed past the menu — close it rather than trap them.
  document.addEventListener('focusin', (e) => {
    if (isOpen() && !container.contains(e.target)) setMenu(false)
  })

  const desktop = window.matchMedia('(min-width: 721px)')
  desktop.addEventListener('change', (e) => {
    if (e.matches) setMenu(false)
  })

}
