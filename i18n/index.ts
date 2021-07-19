import siteFiles from '../data/sites.json'
import Site from '../types/Site'

import en from '../locales/en'
import fr from '../locales/fr'
import de from '../locales/de'

// I18N and locales
const i18nContent = { fr, en, de }

export default {
  locale: 'en',
  fallbackLocale: 'en',
  content: { i18nContent },
}

export const languages = Object.keys(i18nContent)

// MAPPING THE AVAILABLE ROUTES BELOW
const sites = (siteFiles as Site[]).filter(
  (site) => site.immersive !== null && site.viewables.length !== 0
)
export const routes: string[] = languages.flatMap((language) => {
  const value = sites.map((site) =>
    site.enabled ? `/${language}/${site.linkLabel}` : ''
  )

  // custom routes to deploy various attempts while developing
  value.push(`/${language}/chinon/scene`)
  value.push(`/${language}/chinon/sequence-canvas`)
  value.push(`/${language}/chinon/sequence-css`)
  value.push(`/${language}/chinon/margin`)
  value.push(`/${language}/chinon/scrolltest`)
  return value
})
