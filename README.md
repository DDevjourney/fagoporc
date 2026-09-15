# Fagoporc

Web informativa del **G.O. Fagoporc**, Grupo Operativo Supraautonómico para el
desarrollo de bacteriófagos como alternativa a los antibióticos frente a
*E. coli* y *Salmonella* spp. en producción porcina.

Financiado en el marco del PEPAC 2023–2027 con cofinanciación FEADER.

## Arranque

```bash
npm install
npm run dev
```

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en `localhost:5173` |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build ya generado |
| `npm run format` | Prettier sobre `src/` y la raíz |
| `npm run images` | Regenera `src/assets/` desde `docs/originales/` con sharp |

## Estructura de carpetas

```
Fagoporc/
├── index.html                  ← Entrada HTML: página de inicio
├── objetivos.html              ← Entrada HTML: objetivos
├── resultados.html             ← Entrada HTML: resultados
├── participantes.html          ← Entrada HTML: participantes
├── vite.config.js              ← Config de Vite + plugin sharedShell
├── package.json
│
├── public/                     ← Estáticos copiados tal cual al build
│   ├── favicon-escudo.png
│   └── og-image.jpg
│
├── src/
│   ├── nav.js                  ← NAV_LINKS: fuente única de navegación
│   │
│   ├── pages/                  ← Un entry point JS por página
│   │   ├── shell.js            ← Shell compartido (header + footer + loader)
│   │   ├── index.js
│   │   ├── objetivos.js
│   │   ├── participantes.js
│   │   └── resultados.js
│   │
│   ├── components/             ← Componentes renderizados en runtime
│   │   ├── header.js           ← Cabecera + menú móvil
│   │   ├── footer.js           ← Pie de página + scroll-to-top
│   │   └── share.js            ← Botones de compartir en redes
│   │
│   ├── lib/
│   │   └── smoothScroll.js     ← Wrapper de Lenis (smooth scroll)
│   │
│   ├── css/
│   │   ├── variables.css       ← Tokens: colores, tipografía, espaciados
│   │   ├── base.css            ← Reset, utilidades, skip-link, foco
│   │   ├── header.css
│   │   ├── footer.css
│   │   ├── share.css
│   │   ├── hero.css            ← Hero de la home
│   │   ├── pathogens.css       ← Tarjetas E. coli / Salmonella
│   │   ├── approach.css        ← Sección enfoque (fondo oscuro)
│   │   ├── cta-band.css        ← Banda de CTAs a subpáginas
│   │   ├── page-hero.css       ← Hero compartido de subpáginas
│   │   ├── objetivos.css
│   │   ├── participantes.css
│   │   └── resultados.css
│   │
│   └── assets/
│       ├── fonts/              ← CarmenSans, Bubbleboy2 (.woff2)
│       ├── logo-fagoporc.png
│       ├── logo-cetaex.webp
│       ├── logo-piensos-costa.webp
│       ├── img-hero.webp / img-hero-800.webp
│       ├── img-ecolli.webp
│       └── img-salmonella.webp
│
├── scripts/
│   └── optimize-images.js      ← Convierte docs/originales/ → src/assets/
│
└── docs/                       ← Material del cliente (no entra en el build)
    ├── Identidad Fagoporc.pdf
    ├── Info FAGOPORC rev.docx
    └── originales/             ← Imágenes fuente a tamaño completo
```

## Arquitectura

No es una SPA con router. Es una **app multi-página (MPA)** donde cada HTML es
un documento independiente con su propio entry point en Vite. La sensación de
continuidad entre páginas se consigue con un **loader de transición** y un
**shell de componentes compartidos** que renderizan header, footer y share en
runtime.

### Flujo de una página

```
 HTML (ej. objetivos.html)
   │
   └─ <script type="module" src="/src/pages/objetivos.js">
        │
        ├─ import CSS de sección (page-hero.css, objetivos.css)
        │
        └─ initPageShell('objetivos')  ← desde shell.js
             │
             ├─ initSmoothScroll()     ← lib/smoothScroll.js (Lenis)
             ├─ renderHeader()         ← components/header.js
             ├─ renderFooter()         ← components/footer.js
             ├─ renderShare()          ← components/share.js
             └─ initLoader()           ← transición visual entre páginas
```

### Grafo de dependencias

```
vite.config.js ──────── src/nav.js ◄──── (build: noscript nav + OG meta)
                             │
                     ┌───────┴───────┐
                     ▼               ▼
             header.js          footer.js
             (+ logo-fagoporc.png)  (+ logo-fagoporc.png, scrollToTop)
                     │               │
                     └───────┬───────┘
                             ▼
                          shell.js
                  (+ share.js, smoothScroll.js)
                  (+ variables.css, base.css,
                     header.css, footer.css, share.css)
                             │
              ┌──────┬───────┼───────┬──────┐
              ▼      ▼       ▼       ▼      ▼
          index.js  objetivos.js  resultados.js  participantes.js
              │      │       │       │
              ▼      ▼       ▼       ▼
          hero.css  page-hero.css  page-hero.css  page-hero.css
          pathogens  objetivos.css  resultados.css  participantes.css
          approach
          cta-band
```

### Detalle de cada módulo

| Archivo | Exporta | Importa de | Rol |
|---|---|---|---|
| `nav.js` | `NAV_LINKS` | — | Array `{href, label, key}` con las 4 páginas. Fuente única de navegación. |
| `shell.js` | `initPageShell(current)` | `header.js`, `footer.js`, `share.js`, `smoothScroll.js`, CSS comunes | Inicializa componentes compartidos y el loader de transición. |
| `header.js` | `renderHeader(el, opts)` | `nav.js`, `logo-fagoporc.png` | Genera header con logo, nav y hamburguesa. Marca `aria-current` en la página activa. |
| `footer.js` | `renderFooter(el)` | `nav.js`, `logo-fagoporc.png`, `scrollToTop` | Footer con nav, legales, copyright y botón scroll-to-top. |
| `share.js` | `renderShare(el)` | — | Botones de compartir (Facebook, X, WhatsApp, Telegram, LinkedIn) con SVG inline. |
| `smoothScroll.js` | `initSmoothScroll()`, `scrollToTop()` | `lenis` | Smooth scroll con Lenis. Respeta `prefers-reduced-motion`. |
| `index.js` | — | `shell.js`, CSS de sección | Entry point de la home: `initPageShell('inicio')`. |
| `objetivos.js` | — | `shell.js`, CSS de sección | Entry point: `initPageShell('objetivos')`. |
| `resultados.js` | — | `shell.js`, CSS de sección | Entry point: `initPageShell('resultados')`. |
| `participantes.js` | — | `shell.js`, CSS de sección | Entry point: `initPageShell('participantes')`. |

### Plugin `sharedShell` en `vite.config.js`

Usa el hook `transformIndexHtml` para inyectar en **cada** HTML al build:

- CSS y JS inline del loader de transición (spinner)
- `<link rel="icon">` con el favicon
- Metadatos Open Graph y Twitter Card (extrae `<title>` y `<meta description>`)
- Skip-link (`<a class="skip-link" href="#contenido">`)
- Nav `<noscript>` a partir de `NAV_LINKS`

Para URLs absolutas en OG, definir `VITE_SITE_URL` al hacer build:

```bash
VITE_SITE_URL=https://dominio.es npm run build
```

### CSS

Cada archivo CSS es independiente (sin `@import` entre ellos). La composición
se hace vía imports de JS: `shell.js` carga los CSS comunes y cada `pages/*.js`
carga los CSS de sus secciones. Vite los bundlea por página.

**Tokens** en `variables.css`: colores de marca (plum `#593260`, magenta
`#b151b4`, amarillo `#ffc600`), tipografía fluid con `clamp()`, espaciados.

**Breakpoints**: 480 / 560 / 720 / 900 px, siempre `min-width` (mobile first).
El header usa `(width < 720px)` para el menú móvil.

### Pipeline de imágenes

```
docs/originales/  ──(sharp)──►  src/assets/
                 optimize-images.js
```

`npm run images` procesa las imágenes fuente y genera webp optimizado en
`src/assets/`. No editar los assets a mano: regenerar desde originales.

## Añadir una página

1. Crear `nombre.html` en la raíz (charset, viewport, título, descripción;
   `<header></header>`, `<main id="contenido">`, `<footer></footer>` y el
   script — sin `<link rel="stylesheet">`).
2. Crear `src/pages/nombre.js` que importe su CSS y llame a
   `initPageShell('clave')`.
3. Añadirla a `PAGES` en `vite.config.js` y a `NAV_LINKS` en `src/nav.js`.

## Convenciones

**Color.** Los tokens viven en `src/css/variables.css`. `--fp-magenta-ink`
(`#9e40a1`) es una variante oscurecida solo para texto pequeño (el magenta de
marca no alcanza 4.5:1 sobre `paper-soft` a 12–14 px).

**Etiquetas.** La clase `.label` toma el color de `--label-color`. Para
retintar en una sección:

```css
.mi-seccion { --label-color: var(--fp-yellow); }
```

**Foco.** `base.css` define un anillo `:focus-visible` global (plum en fondos
claros, amarillo en oscuros). No poner `outline: none` sin sustituto visible.

**Tipografía.** Carmen Sans para todo; Bubbleboy2 solo display (máx. 3 usos).
Carmen Sans está subseteada a latín (17 KB).

**Contenido.** Registro científico. Los objetivos y resultados son literales
de `docs/Info FAGOPORC rev.docx`.
