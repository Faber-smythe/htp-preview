// static imports
import homepage from './fr/static/homepage'
import sitepage from './fr/static/sitepage'

// dynamic imports (don't forget to add locales for the new sites)
import chinon from './fr/dynamic/chinon'

const fr = Object.assign({}, homepage, sitepage, chinon)

export default fr
