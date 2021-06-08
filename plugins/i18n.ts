export default function ({ app }) {
  // beforeLanguageSwitch called right before setting a new locale
  app.i18n.onBeforeLanguageSwitch = (
    oldLocale,
    newLocale,
    isInitialSetup,
    context
  ) => {
    // console.log(app)
  }
  // onLanguageSwitched called right after a new locale has been set
  app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
    // document.location.reload()
    // console.log(document.location)
    // console.log(newLocale)
  }
}
