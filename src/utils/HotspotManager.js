import * as THREE from 'three'

export class HotspotManager {

	constructor() {
		this.textures = {}
		this.textureLoader = new THREE.TextureLoader()
	}

	// eslint-disable-next-line no-unused-vars
	generate3DPosition(hotspot, sphereRadius) {
		let polarCoordinates = this.planarToPolarCoordinates(
			hotspot.position.x,
			hotspot.position.y,
			sphereRadius
		)
		let cartesianCoordinates = this.polarToCartesian(
			polarCoordinates.x,
			polarCoordinates.y,
			sphereRadius
		)
		return cartesianCoordinates
	}

	// eslint-disable-next-line no-unused-vars
	planarToPolarCoordinates(x, y, sphereRadius) {
		/**
		 * // Longitude
            x = Mathf.Rad2Deg * (X / sphereRadius),

            // Latitude
            y = Mathf.Rad2Deg * (2 * Mathf.Atan(Mathf.Exp(Y / sphereRadius)) - Mathf.PI / 2)
		 */
		let longitude = THREE.MathUtils.radToDeg(x / sphereRadius)
		//Mathf.Rad2Deg * (2 * Mathf.Atan(Mathf.Exp(Y / sphereRadius)) - Mathf.PI / 2)
		let latitude = THREE.MathUtils.radToDeg(
			2 * Math.atan(Math.exp(y / sphereRadius)) - Math.PI / 2
		)

		//console.log('longitude latitude', longitude, latitude)
		return new THREE.Vector2(longitude, latitude)
	}

	polarToCartesian(longitude, latitude, sphereRadius) {
		let spherical = new THREE.Spherical(sphereRadius, longitude, latitude)
		let cartesianCoordinates = new THREE.Vector3()
		cartesianCoordinates.setFromSpherical(spherical)
		return cartesianCoordinates
	}

	radiansToDegrees(radians) {
		return radians * (180 / Math.PI)
	}



	loadHotspotTextures() {
		this.textureLoader.load('/assets/textures/hotspots/White/Content/Off.png', (texture => {
			this.textures['TextHotspot'] = texture
		}))

		this.textureLoader.load('/assets/textures/hotspots/Move/Off/White.png', (texture => {
			this.textures['CloseUpHotspot'] = texture
		}))
	}
}
