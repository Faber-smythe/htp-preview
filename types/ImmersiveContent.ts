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
  uniqueID: string
  type: string
  zoomLevelDisplayMin: number
  zoomLevelDisplayMax: number
  content: any[]
  contentList: ContentList[]
  index: number
  requiredAssetBundle: string
  displayIndexes: any[]
  layers: any[]
  spriteFileName: string
  visitedSpriteFileName: string
  color: string
  navigationType: string
  filtersOut: any[]
  filtersIn: any[]
  position: Position
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
