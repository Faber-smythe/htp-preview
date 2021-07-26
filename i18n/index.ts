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
const sites = (siteFiles as Site[]).filter((site) => site.enabled)

export const routes: string[] = sites.flatMap((site) => {
  return languages.map((language) => `/${language}/${site.linkLabel}`)
})
