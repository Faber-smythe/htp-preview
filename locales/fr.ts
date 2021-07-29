/**
 * STATIC IMPORTS
 */
import homepage from './fr/static/homepage'
import sitepage from './fr/static/sitepage'

/**
 * DYNAMIC IMPORTS (don't forget to add locales for the new sites)
 * /!\ If using a .hscene file, remember to add the HPDK
 *  - Paste the locale file in the following folder : fr/dynamic/
 *  - Add an import to this file right below
 */
import chinon from './fr/dynamic/chinon'
import senanque from './fr/dynamic/Senanque_fr-FR'

const fr = Object.assign({}, homepage, sitepage, chinon, senanque)

export default fr
