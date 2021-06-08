import is from 'is_js'
import { Vue, Component } from 'vue-property-decorator'

@Component
export class UtilMixins extends Vue {
  get todayYear() {
    return new Date().getFullYear()
  }

  get isSmartPhone() {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ]

    const match = toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem)
    })
    return match
  }

  get isMobile() {
    return is.mobile() || is.tablet()
  }

  get isLandscape() {
    const isLandscape = window.innerHeight < window.innerWidth
    return isLandscape
  }

  get isFirefox() {
    return is.firefox()
  }

  get isIe() {
    return is.ie()
  }

  get isEdge() {
    return is.edge()
  }

  get isSafariOrIOS() {
    return is.ios() || is.safari()
  }

  goBack() {
    window.history.back()
  }
}
