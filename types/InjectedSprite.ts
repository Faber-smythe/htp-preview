import { Sprite } from 'babylonjs/Sprites/sprite'
import { Hotspot } from '@/types/ImmersiveContent'

interface HotspotData {
  type: string
  index: number
  value: Hotspot
}

export default interface InjectedSprite extends Sprite {
  hotspotData: HotspotData
}
