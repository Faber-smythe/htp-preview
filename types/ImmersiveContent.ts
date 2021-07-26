export interface Layer {
  uniqueID: string
  periodTitle: string
  periodLabel: string
}

export interface Position {
  x: number
  y: number
}

export interface Hotspot {
  type: string
  index: number
  position: Position
  visualAsset?: string
  alt: string
  value: string
  opened: boolean
}

export default interface ImmersiveContent {
  name: string
  layers: Layer[]
  history: string
  hotspots: Hotspot[]
}
