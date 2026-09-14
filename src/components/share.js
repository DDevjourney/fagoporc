const ICONS = {
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8.5h2.9l.4-3.4h-3.3V7.9c0-1 .3-1.7 1.7-1.7h1.8V3.1C16.6 3 15.6 3 14.5 3c-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3.4h2.9V22h2.9z"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 3h3l-6.6 7.5L21.8 21h-6l-4.7-6.2L5.7 21H2.6l7.1-8L2 3h6.1l4.3 5.7L17.5 3zm-1 16h1.7L7.5 4.8H5.7L16.5 19z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.2-1.3c1.4.8 3 1.2 4.7 1.2h.1c5.5 0 10-4.5 10-10S17.5 2 12 2zm5.8 14.1c-.3.7-1.4 1.3-2 1.4-.5.1-1.2.1-2-.1-.4-.2-1-.4-1.8-.7-3.1-1.3-5.1-4.4-5.3-4.6-.2-.2-1.3-1.7-1.3-3.3s.8-2.4 1.2-2.7c.3-.3.7-.4.9-.4h.6c.2 0 .5-.1.7.5.3.7 1 2.3 1 2.5.1.1.1.3 0 .5-.1.2-.2.3-.3.5s-.3.4-.4.5c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 2 1.1.9 2 1.2 2.3 1.4.3.1.5.1.7-.1.2-.2.8-.9.9-1.2.1-.3.3-.3.5-.2.2.1 1.5.7 1.7.8.3.1.5.2.5.3.2.1.2.7-.1 1.3z"/></svg>',
  telegram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.6 15.3l-.4 4c.5 0 .8-.2 1.1-.5l2.6-2.5 5.4 4c1 .5 1.7.3 2-.9L23 4.5c.3-1.4-.5-2-1.5-1.6L2.8 10.2c-1.4.5-1.4 1.3-.2 1.7l4.7 1.5 10.9-6.9c.5-.3 1-.1.6.2L9.6 15.3z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 3H3.6C3.3 3 3 3.3 3 3.7v16.6c0 .4.3.7.6.7h16.8c.3 0 .6-.3.6-.7V3.7c0-.4-.3-.7-.6-.7zM8.3 18.3H5.7V9.7h2.7v8.6zM7 8.5c-.9 0-1.6-.7-1.6-1.6S6.1 5.3 7 5.3s1.6.7 1.6 1.6-.7 1.6-1.6 1.6zm11.4 9.8h-2.7v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.3H10V9.7h2.6v1.2c.4-.7 1.3-1.4 2.6-1.4 2.7 0 3.2 1.8 3.2 4.1v4.7z"/></svg>',
}

const NETS = [
  { key: 'facebook', label: 'Compartir en Facebook', url: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  { key: 'x',        label: 'Compartir en X',        url: (u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
  { key: 'whatsapp', label: 'Compartir en WhatsApp', url: (u, t) => `https://wa.me/?text=${t}%20${u}` },
  { key: 'telegram', label: 'Compartir en Telegram', url: (u, t) => `https://t.me/share/url?url=${u}&text=${t}` },
  { key: 'linkedin', label: 'Compartir en LinkedIn', url: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
]

export function renderShare(container) {
  if (!container) return

  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(document.title)

  container.classList.add('share')
  container.innerHTML = `
    <div class="wrap share__inner">
      <p class="share__label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/>
          <polyline points="16 6 12 2 8 6"/>
          <line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
        Compartir
      </p>
      <ul class="share__list">
        ${NETS.map(n => `
          <li>
            <a class="share__link share__link--${n.key}"
               href="${n.url(url, title)}"
               target="_blank"
               rel="noopener noreferrer"
               aria-label="${n.label}">
              ${ICONS[n.key]}
            </a>
          </li>
        `).join('')}
      </ul>
    </div>
  `
}
