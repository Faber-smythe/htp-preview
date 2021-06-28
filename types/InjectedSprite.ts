import { Sprite } from 'babylonjs/Sprites/sprite'
import { Hotspot } from '@/types/ImmersiveContent'

export default interface InjectedSprite extends Sprite {
  hotspotData: Hotspot
}
