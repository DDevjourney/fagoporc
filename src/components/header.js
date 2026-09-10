import logo from '../assets/Logos_Fagoporc-01-removebg.png'

const LINKS = [
  { href: 'index.html', label: 'Inicio', key: 'inicio', ready: true },
  { href: 'objetivos.html', label: 'Objetivos', key: 'objetivos', ready: false },
  { href: 'resultados.html', label: 'Resultados', key: 'resultados', ready: false },
  { href: 'participantes.html', label: 'Participantes', key: 'participantes', ready: false },
]

export function renderHeader(container, { current = 'inicio' } = {}) {
  if (!container) throw new Error('renderHeader: container is required')

  container.classList.add('header')
  container.innerHTML = `
    <div class="wrap header__inner">
      <a href="index.html" class="header__logo" aria-label="Fagoporc — inicio">
        <img src="${logo}" alt="" width="228" height="65">
      </a>

      <nav class="header__nav" aria-label="Principal">
        ${LINKS.map(({ href, label, key, ready }) => {
          const isCurrent = key === current
          const cls = `header__link${ready ? '' : ' header__link--disabled'}`
          const aria = isCurrent ? ' aria-current="page"' : ''
          const disabled = ready ? '' : ' aria-disabled="true" title="Próximamente"'
          const hrefAttr = ready ? `href="${href}"` : ''
          const tag = ready ? 'a' : 'span'
          return `<${tag} ${hrefAttr} class="${cls}"${aria}${disabled}>${label}</${tag}>`
        }).join('')}
      </nav>

      <button class="header__toggle" type="button" aria-label="Abrir menú" aria-expanded="false">
        <span></span><span></span>
      </button>
    </div>
  `

  const toggle = container.querySelector('.header__toggle')
  toggle.addEventListener('click', () => {
    const isOpen = container.classList.toggle('is-open')
    toggle.setAttribute('aria-expanded', String(isOpen))
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú')
  })

  const setStuck = () => {
    container.classList.toggle('is-stuck', window.scrollY > 24)
  }
  setStuck()
  window.addEventListener('scroll', setStuck, { passive: true })
}
