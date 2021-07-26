import { Sprite } from 'babylonjs/Sprites/sprite'
import { Rectangle, Image } from 'babylonjs-gui'
import { Hotspot } from '@/types/ImmersiveContent'

export interface HotspotData {
  guiCaption?: Rectangle
  guiVisual?: Image
  content?: Hotspot
  opened: Boolean
}

export default interface InjectedSprite extends Sprite {
  hotspotData: HotspotData
}
