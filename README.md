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

## Estructura

```
index.html · objetivos.html · resultados.html · participantes.html
    Una entrada por página (Vite multi-page).

src/
  nav.js              Lista de navegación. Fuente única: la consumen el header,
                      el footer y el fallback <noscript> del build.
  pages/              Una entrada JS por página: importa su CSS y llama al shell.
    shell.js          CSS común + render de header y footer.
  components/         header.js, footer.js
  css/                variables.css (tokens) + base.css + un archivo por sección
  assets/             Imágenes y fonts/

docs/                 Material original del cliente (manual de marca, memoria).
                      No entra en el build.
```

### Añadir una página

1. Crear `nombre.html` en la raíz (solo `<head>` con título y descripción,
   `<header></header>`, `<main id="contenido">`, `<footer></footer>` y el script).
2. Crear `src/pages/nombre.js` que importe su CSS y llame a
   `initPageShell('clave')`.
3. Añadirla a `PAGES` en `vite.config.js` y a `NAV_LINKS` en `src/nav.js`.

El `<head>` común, el skip link y la navegación sin JS los inyecta el plugin
`sharedShell` de `vite.config.js`; no hay que copiarlos en cada HTML.

## Convenciones

**Color.** Los tokens viven en `src/css/variables.css`. La marca son tres
Pantone: plum `#593260`, magenta `#b151b4` y amarillo `#ffc600`.

`--fp-magenta-ink` (`#9e40a1`) es una variante oscurecida **solo para texto
pequeño**: el magenta de marca se queda en 4.17:1 sobre `paper-soft`, por debajo
del 4.5:1 que exigen las etiquetas de 12–14 px. En rellenos, filetes e
ilustración se usa el magenta de marca sin tocar.

**Etiquetas.** La clase `.label` toma el color de `--label-color`, no de una
declaración directa. Para retintar las etiquetas de una sección, define esa
propiedad en un ancestro:

```css
.mi-seccion { --label-color: var(--fp-yellow); }
```

No uses `.mi-seccion__label { color: … }`: empata en especificidad con `.label`
y el ganador depende del orden de carga de los CSS.

**Foco.** `base.css` define un anillo `:focus-visible` global, plum sobre fondos
claros y amarillo sobre oscuros. No pongas `outline: none` sin sustituirlo por
otro indicador visible.

**Tipografía.** Carmen Sans para todo; Bubbleboy2 solo como recurso de display,
con un máximo de 3 usos en el sitio. Carmen Sans está subseteada a latín
(17 KB); el original traía 12.137 glifos con bloques de coreano (173 KB). Si
hace falta ampliar el juego de caracteres, hay que volver a subsetear desde el
fichero original del cliente.

**Contenido.** El registro es científico, no divulgativo: se usan los términos
técnicos sin traducirlos. Los objetivos y resultados son literales de
`docs/Info FAGOPORC rev.docx` — no inventar fases, fechas ni datos
experimentales.
