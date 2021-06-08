import en from '../locales/en'
import fr from '../locales/fr'
import de from '../locales/de'

const i18nContent = { fr, en, de }

export default {
  locale: 'en',
  fallbackLocale: 'en',
  content: { i18nContent },
}

export const languages = Object.keys(i18nContent)
