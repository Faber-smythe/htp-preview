export interface ObjectAsset {
  file: string
  initialZoom?: number
  cameraClamping?: 'quarter' | 'model' | 'free'
  lightIntensity?: number
  labels: string[]
}

export default interface Viewable {
  image: string
  object?: ObjectAsset
  size: string
  order: string
  titleKey?: string
  textKey?: string
}
