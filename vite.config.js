import { defineConfig } from 'vite'
import { resolve } from 'path'
import { NAV_LINKS } from './src/nav.js'

const PAGES = ['index', 'objetivos', 'resultados', 'participantes']

/** Base pública absoluta del sitio (sin barra final), p. ej.
 *  VITE_SITE_URL=https://fagoporc.es npm run build
 *  Open Graph exige URLs absolutas para og:image / og:url; sin ella, las
 *  previews en redes salen sin imagen. */
const SITE_URL = (process.env.VITE_SITE_URL || '').replace(/\/$/, '')

const OG_IMAGE = { file: 'og-image.jpg', width: 1200, height: 630 }

/** Clave compartida con src/pages/shell.js. */
const NAV_FLAG = 'fp:navigating'

const LOADER_CSS = `
.page-loader{position:fixed;inset:0;z-index:999;display:flex;align-items:center;justify-content:center;background:#fff;opacity:0;pointer-events:none;transition:opacity 300ms cubic-bezier(.2,.7,.2,1)}
.page-loader.is-active{opacity:1;pointer-events:auto}
.page-loader.no-transition{transition:none}
html.fp-incoming .page-loader{opacity:1;pointer-events:auto;transition:none}
.lds-dual-ring{display:inline-block;width:80px;height:80px}
.lds-dual-ring:after{content:" ";display:block;box-sizing:border-box;width:64px;height:64px;margin:8px;border-radius:50%;border:6.4px solid #593260;border-color:#593260 transparent #593260 transparent;animation:lds-dual-ring 1.2s linear infinite;animation-delay:var(--spin-offset,0ms)}
@keyframes lds-dual-ring{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.page-loader{transition:none}.lds-dual-ring:after{animation:none}}
@view-transition{navigation:auto}
.page-loader{view-transition-name:page-loader}
::view-transition-group(page-loader),::view-transition-old(page-loader),::view-transition-new(page-loader){animation-duration:0s}
`.trim()

/** Periodo del giro del spinner (ms); debe coincidir con la animación de LOADER_CSS. */
const SPIN_MS = 1200

/** Arranque inline: activa el loader si venimos de otra página y sincroniza
 *  la fase del giro con el reloj, para que el anillo esté en el mismo ángulo
 *  en el documento que se va y en el que llega. */
const LOADER_BOOT = `try{var h=document.documentElement;h.style.setProperty('--spin-offset',-(Date.now()%${SPIN_MS})+'ms');if(sessionStorage.getItem('${NAV_FLAG}')==='1')h.classList.add('fp-incoming')}catch(e){}`

const pick = (html, re) => html.match(re)?.[1]?.replace(/\s+/g, ' ').trim() ?? ''

/** Injects the markup every page shares — favicon, Open Graph, the skip link
 *  and the no-JS navigation — so it lives in one place instead of four HTML
 *  files. charset y viewport se quedan en cada HTML: deben ir al principio del
 *  <head> y el plugin no puede garantizar esa posición sin duplicarlos.
 *  The noscript nav is built from NAV_LINKS, the same list the header renders. */
function sharedShell() {
  return {
    name: 'fagoporc-shared-shell',
    transformIndexHtml(html, ctx) {
      const title = pick(html, /<title>([^<]*)<\/title>/)
      const description = pick(html, /<meta\s+name="description"\s+content="([^"]*)"/)
      const page = ctx.filename.replace(/^.*[\\/]/, '')
      const url = SITE_URL ? `${SITE_URL}/${page === 'index.html' ? '' : page}` : ''
      const image = SITE_URL ? `${SITE_URL}/${OG_IMAGE.file}` : `./${OG_IMAGE.file}`

      const meta = (attrs) => ({ tag: 'meta', attrs, injectTo: 'head' })
      const og = [
        meta({ property: 'og:type', content: 'website' }),
        meta({ property: 'og:site_name', content: 'Fagoporc' }),
        meta({ property: 'og:locale', content: 'es_ES' }),
        meta({ property: 'og:title', content: title }),
        meta({ property: 'og:description', content: description }),
        meta({ property: 'og:image', content: image }),
        meta({ property: 'og:image:width', content: String(OG_IMAGE.width) }),
        meta({ property: 'og:image:height', content: String(OG_IMAGE.height) }),
        meta({ name: 'twitter:card', content: 'summary_large_image' }),
        meta({ name: 'twitter:title', content: title }),
        meta({ name: 'twitter:description', content: description }),
        meta({ name: 'twitter:image', content: image }),
      ]
      if (url) {
        og.push(meta({ property: 'og:url', content: url }))
        og.push({ tag: 'link', attrs: { rel: 'canonical', href: url }, injectTo: 'head' })
      }

      return [
        // Loader de transición: CSS y arranque inline para que, al llegar desde
        // otra página (flag en sessionStorage), tape el primer pintado antes
        // de que se descargue ningún stylesheet o módulo. El comportamiento
        // (fade-out, clic en enlaces) vive en src/pages/shell.js.
        { tag: 'style', children: LOADER_CSS, injectTo: 'head-prepend' },
        { tag: 'script', children: LOADER_BOOT, injectTo: 'head-prepend' },
        {
          tag: 'div',
          attrs: { class: 'page-loader', 'aria-hidden': 'true' },
          children: '<div class="lds-dual-ring"></div>',
          injectTo: 'body-prepend',
        },
        {
          tag: 'link',
          // Sirve desde public/ (Vite copia public/* a la raíz de dist sin
          // hashing). Los tags inyectados no pasan por el URL rewriting de
          // Vite, así que apuntar a src/assets/… fallaba en build.
          attrs: { rel: 'icon', type: 'image/png', href: './favicon-escudo.png' },
          injectTo: 'head',
        },
        ...og,
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
      input: Object.fromEntries(PAGES.map((p) => [p, resolve(import.meta.dirname, `${p}.html`)])),
    },
  },
})
