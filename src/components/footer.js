import fagoLogo from '../assets/Logos_Fagoporc-02-cropped.png'
import { NAV_LINKS } from '../nav.js'

const LEGAL = [
  { label: 'Aviso legal', href: 'https://observatorioagroalimentario.com/proyectos/GOS/aviso-legal' },
  { label: 'Política de privacidad', href: 'https://observatorioagroalimentario.com/proyectos/GOS/politica-de-privacidad' },
  { label: 'Política de cookies', href: 'https://observatorioagroalimentario.com/proyectos/GOS/politica-de-cookies' },
]

export function renderFooter(container) {
  if (!container) throw new Error('renderFooter: container is required')

  container.classList.add('footer')
  container.innerHTML = `
    <div class="wrap footer__main">
      <div class="footer__brand">
        <img class="footer__logo" src="${fagoLogo}" alt="Fagoporc" width="392" height="181">
        <p class="footer__tagline">
          Grupo Operativo Supraautonómico para el aislamiento y validación de
          cócteles de bacteriófagos en producción porcina.
        </p>
      </div>

      <div class="footer__nav-area">
        <nav class="footer__nav-group" aria-label="Navegación">
          <p class="footer__nav-heading">Secciones</p>
          ${NAV_LINKS.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
        </nav>
        <div class="footer__nav-group">
          <p class="footer__nav-heading">Legal</p>
          ${LEGAL.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
        </div>
      </div>
    </div>

    <div class="wrap footer__bottom">
      <span>© ${new Date().getFullYear()} G.O. Fagoporc</span>
      <button class="footer__top-btn" type="button" aria-label="Volver al inicio de la página">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>
  `

  const topBtn = container.querySelector('.footer__top-btn')
  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}
