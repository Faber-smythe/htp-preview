export interface Layer {
  uniqueID: string
  periodTitle: string
  periodLabel: string
  periodCartel: string
  skyboxMaterial: string
}

export interface Position {
  x: number
  y: number
}

export interface Hotspot {
  type: string
  layers: string[]
  position: Position
  visualAsset: string
  alt: string
  value: string
  opened: boolean
}

export default interface WebImmersive {
  name: string
  layers: Layer[]
  hotspots: Hotspot[]
}
