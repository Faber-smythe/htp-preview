export interface ObjectAsset {
  file: string
  initialZoom?: number
  cameraClamping?: boolean
}

export default interface VisualAsset {
  image: string
  object?: ObjectAsset
  size: string
  order: string
  title: string
  text: string[]
}
