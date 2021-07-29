export interface CartelDescription {
  title: string
  subtitle: string
  description: string
}

export interface AmbianceSound {
  fileName: string
  volume: number
}

export interface Layer {
  uniqueID: string
  localizedTimestampTitle: string
  cartelDescription: CartelDescription
  skyboxMaterial: string
  ambianceSound: AmbianceSound
  triggerType: string
  filtersOut: any[]
  filtersIn: any[]
}

export interface AssetBundle {
  url: string
  version: number
  filtersOut: any[]
  filtersIn: any[]
}

export interface Position {
  x: number
  y: number
  z: number
}

export interface Rotation {
  x: number
  y: number
  z: number
}

export interface Camera {
  type: string
  position: Position
  rotation: Rotation
  sensitivity: number
  zoomMin: number
  zoomMax: number
  topClampValue: number
  bottomClampValue: number
  leftClampValue: number
  rightClampValue: number
  xAxisLocked: boolean
  yAxisLocked: boolean
  zAxisLocked: boolean
  autoRotate: boolean
  autoRotationSpeed: number
  autoRotationTriggerTime: number
}

export interface ContentList {
  type: string
  value: string
  filtersOut: any[]
  filtersIn: any[]
}

export interface Position2 {
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
  layers: string[]
  spriteFileName: string
  visitedSpriteFileName: string
  color: string
  navigationType: string
  filtersOut: any[]
  filtersIn: any[]
  position: Position2
}

export interface Position3 {
  x: number
  y: number
}

export interface Widget {
  type: string
  uniqueID: string
  position: Position3
  content: any[]
  contentList: any[]
  filtersOut: any[]
  filtersIn: any[]
}

export interface DefaultSceneNavigation {
  sceneName: string
  sceneTemplate: string
  sceneType: string
  loadingScreen: boolean
}

export default interface Hscene {
  name: string
  template: string
  layers: Layer[]
  requiredAssetBundles: any[]
  assetBundles: AssetBundle[]
  camera: Camera
  hotspots: Hotspot[]
  widgets: Widget[]
  closeUps: any[]
  ignoreGeolocEvent: boolean
  contentList: any[]
  defaultSceneNavigation: DefaultSceneNavigation
  inactivitySkipTimer: number
  contextConditions: any[]
  ambianceSound: string
  ambianceVolume: number
  cartelDescriptions: any[]
  cubemapMaterial: string
}
