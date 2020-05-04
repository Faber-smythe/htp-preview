export class ImmersiveManager {
	constructor() {}

	processOldImmersive(immersive) {
		immersive['layers'] = []

		let timelineTitles = immersive.widgets.find((widget) => {
			return widget.type == 'HorizontalSkyboxBlender'
		})

		let ambianceSounds = immersive.hotspots.filter((hotspot) => {
			return (
				hotspot.type == 'SpatialSoundHotspot' &&
				String(hotspot.content[0]).startsWith('Amb_')
			)
		})

		immersive.cartelDescriptions.forEach((cartelDescription, index) => {
			let layer = {
				uniqueID: `${immersive.cubemapMaterial}${index}`,
				localizedTimestampTitle: timelineTitles.content[index],
				cartelDescription: {
					title: cartelDescription.title,
					subtile: '',
					description: cartelDescription.description,
				},
				skyboxMaterial: immersive.cubemapMaterial,
				ambianceSound: {
					fileName: ambianceSounds[index].content[0],
					volume: 0.4,
				},
				triggerType: 'Timeline',
				filtersOut: [],
				filtersIn: [],
			}

			immersive.layers.push(layer)
		})

		immersive.hotspots.forEach((hotspot, index) => {
			hotspot['layers'] = []
			hotspot.displayIndexes.forEach((displayIndex) => {
				hotspot.layers.push(immersive.layers[displayIndex].uniqueID)
			})

			hotspot['uniqueID'] = String(hotspot.type).toLowerCase() + '.' + index

			hotspot['contentList'] = []

			hotspot.content.forEach((content) => {
				hotspot.contentList.push({
					value: content,
					filtersOut: [],
					filtersIn: [],
				})
			})

			console.log('hotspot', hotspot)
		})

		console.log('Immersive processed', immersive)
	}
}
