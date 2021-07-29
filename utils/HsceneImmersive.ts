/**
 * IMPORT WEB IMMERSIVE TYPE (target of the data conversion)
 */
import WebImmersive, { Layer, Hotspot } from '@/types/WebImmersive'

/**
 * IMPORT HSCENE TYPES (CAREFUL WITH THE VERSIONS)
 */
import Hscene19 from '@/types/Hscene.1.9'

/**
 *
 * @param key A string looking like "${myKey}" used for localization-relative data
 * @returns Another string, looking like "myKey"
 */
function stripLocaleKey(key: string): string {
  if (key.includes('${') || key.includes('}')) {
    return key.replace('${', '').replace('}', '')
  } else {
    return key
  }
}

export default class HsceneImmersive implements WebImmersive {
  name: string
  layers: Layer[]
  hotspots: Hotspot[]

  constructor(hScene: Hscene19) {
    this.name = hScene.name

    this.layers = hScene.layers.map((layer): Layer => {
      return {
        uniqueID: layer.uniqueID,
        periodTitle: stripLocaleKey(layer.cartelDescription.title),
        periodLabel: stripLocaleKey(layer.localizedTimestampTitle),
        periodCartel: stripLocaleKey(layer.cartelDescription.description),
        skyboxMaterial: layer.skyboxMaterial,
      } as Layer
    })

    /**
     * Only text Hotspots are supported so far.
     * Edit the below filter if needed
     */
    this.hotspots = hScene.hotspots
      .filter((hotspot) => hotspot.type === 'TextHotspot')
      .map((hotspot): Hotspot => {
        return {
          type: hotspot.type,
          layers: hotspot.layers,
          position: { x: hotspot.position.x, y: hotspot.position.y },
          visualAsset: '',
          value: stripLocaleKey(
            hotspot.contentList.filter((content) => content.type === 'Text')[0]
              .value
          ),
          opened: false,
        } as Hotspot
      })
  }
}
