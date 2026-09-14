import { defineConfig } from 'vite'
import { resolve } from 'path'
import { NAV_LINKS } from './src/nav.js'

const PAGES = ['index', 'objetivos', 'resultados', 'participantes']

/** Injects the markup every page shares — common head tags, the skip link and
 *  the no-JS navigation — so it lives in one place instead of four HTML files.
 *  The noscript nav is built from NAV_LINKS, the same list the header renders. */
function sharedShell() {
  return {
    name: 'fagoporc-shared-shell',
    transformIndexHtml() {
      return [
        { tag: 'meta', attrs: { charset: 'UTF-8' }, injectTo: 'head-prepend' },
        {
          tag: 'meta',
          attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
          injectTo: 'head',
        },
        {
          tag: 'link',
          // Sirve desde public/ (Vite copia public/* a la raíz de dist sin
          // hashing). Los tags inyectados no pasan por el URL rewriting de
          // Vite, así que apuntar a src/assets/… fallaba en build.
          attrs: { rel: 'icon', type: 'image/png', href: './favicon-escudo.png' },
          injectTo: 'head',
        },
        {
          tag: 'a',
          attrs: { class: 'skip-link', href: '#contenido' },
          children: 'Saltar al contenido',
          injectTo: 'body-prepend',
        },
        {
          tag: 'noscript',
          injectTo: 'body-prepend',
          children: [
            {
              tag: 'nav',
              attrs: { class: 'noscript-nav', 'aria-label': 'Navegación' },
              children: NAV_LINKS.map(({ href, label }) => ({
                tag: 'a',
                attrs: { href },
                children: label,
              })),
            },
          ],
        },
      ]
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [sharedShell()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(PAGES.map((p) => [p, resolve(__dirname, `${p}.html`)])),
    },
  },
})
