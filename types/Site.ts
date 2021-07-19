import Viewable from './Viewable'

export interface Review {
  grade: number
  textKey: string
}

export interface Immersive {
  siteID: string
  sceneID: string
  file: string
}

export default interface Site {
  name: string
  siteID: string
  linkLabel: string
  ticketLink: string
  enabled: boolean
  lngLat: number[]
  viewables: Viewable[]
  immersive: Immersive
  reviews: Review[]
}
