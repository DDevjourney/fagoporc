import './css/variables.css'
import './css/base.css'
import './css/header.css'
import './css/hero.css'
import './css/pathogens.css'
import './css/approach.css'
import './css/footer.css'

import { renderHeader } from './components/header.js'
import { renderFooter } from './components/footer.js'

renderHeader(document.querySelector('header'), { current: 'inicio' })
renderFooter(document.querySelector('footer'))
