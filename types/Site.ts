import Viewable from './Viewable'

export interface Review {
  grade: number
  textKey: string
}

export interface Immersive {
  name: string
  sceneID: string
  file: string
}

export interface ScreenDescription {
  title: string
  text: string
}

export default interface Site {
  name: string
  siteID: string
  linkLabel: string
  ticketLink: string
  enabled: boolean
  lngLat: number[]
  screenDescriptions: ScreenDescription[]
  viewables: Viewable[]
  availableImmersives: Immersive[]
  immersive: Immersive
  reviews: Review[]
}
