// static imports
import homepage from './de/static/homepage'
import sitepage from './de/static/sitepage'

// dynamic imports (don't forget to add locales for the new sites)
import chinon from './de/dynamic/chinon'

const de = Object.assign({}, homepage, sitepage, chinon)

export default de
