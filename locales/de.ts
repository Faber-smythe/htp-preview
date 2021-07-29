/**
 * STATIC IMPORTS
 */
import homepage from './de/static/homepage'
import sitepage from './de/static/sitepage'

/**
 * DYNAMIC IMPORTS (don't forget to add locales for the new sites)
 * /!\ If using a .hscene file, remember to add the HPDK
 *  - Paste the locale file in the following folder : de/dynamic/
 *  - Add an import to this file right below
 */
import chinon from './de/dynamic/chinon'

const de = Object.assign({}, homepage, sitepage, chinon)

export default de
