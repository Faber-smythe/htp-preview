// static imports
import homepage from './en/static/homepage'
import sitepage from './en/static/sitepage'

// dynamic imports (don't forget to add locales for the new sites)
import chinon from './en/dynamic/chinon'

const en = Object.assign({}, homepage, sitepage, chinon)

export default en
