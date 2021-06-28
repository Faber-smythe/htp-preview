export interface CartelDescription {
  title: string
}

export interface AmbianceSound {
  fileName: string
  volume: number
}

export interface Layer {
  uniqueID: string
  localizedTimestampTitle: string
  cartelDescription: CartelDescription
  ambianceSound: AmbianceSound
  triggerType: string
  filtersOut: any[]
  filtersIn: any[]
  skyboxMaterial: string
}

export interface ContentList {
  type: string
  value: string
  filtersOut: any[]
  filtersIn: any[]
}

export interface Position {
  x: number
  y: number
}

export interface Hotspot {
  type: string
  index: number
  position: Position
  insert?: HTMLElement
  visualAsset: string
  value: string
  opened: boolean
}

export interface Position2 {
  x: number
  y: number
}

export interface Treasure {
  name: string
  layer: number
  position: Position2
  description: string
}

export default interface ImmersiveContent {
  name: string
  layers: Layer[]
  history: string
  hotspots: Hotspot[]
  treasure: Treasure
  closeUps: any[]
}
