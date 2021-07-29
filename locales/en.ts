/**
 * STATIC IMPORTS
 */
import homepage from './en/static/homepage'
import sitepage from './en/static/sitepage'

/**
 * DYNAMIC IMPORTS (don't forget to add locales for the new sites)
 * /!\ If using a .hscene file, remember to add the HPDK
 *  - Paste the locale file in the following folder : en/dynamic/
 *  - Add an import to this file right below
 */
import chinon from './en/dynamic/chinon'

const en = Object.assign({}, homepage, sitepage, chinon)

export default en
