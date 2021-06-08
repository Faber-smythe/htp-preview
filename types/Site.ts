import VisualAsset from './VisualAsset'

export interface Review {
  grade: number
  text: string
}

export interface Immersive {
  siteID: string
  sceneID: string
  file: string
}

export default interface Site {
  name: string
  linkLabel: string
  siteID: string
  display: boolean
  interact: boolean
  home: boolean
  count: number
  lngLat: number[]
  visualAssets: VisualAsset[]
  immersive: Immersive
  reviews: Review[]
}
