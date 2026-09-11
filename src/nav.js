/** Single source of truth for site navigation: consumed by the runtime header
 *  and, at build time, by the <noscript> fallback in vite.config.js. */
export const NAV_LINKS = [
  { href: 'index.html', label: 'Inicio', key: 'inicio' },
  { href: 'objetivos.html', label: 'Objetivos', key: 'objetivos' },
  { href: 'resultados.html', label: 'Resultados', key: 'resultados' },
  { href: 'participantes.html', label: 'Participantes', key: 'participantes' },
]
