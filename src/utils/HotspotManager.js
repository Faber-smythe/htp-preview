import * as THREE from 'three'

const RAD2DEG = 180 / Math.PI
const DEG2RAD = Math.PI / 180

export class HotspotManager {
	constructor() {
		this.textures = {}
		this.textureLoader = new THREE.TextureLoader()
	}

	/**
	 *
	 * @param {*} hotspot
	 * @param {*} sphereRadius
	 */

	// eslint-disable-next-line no-unused-vars
	generate3DPosition(hotspot, sphereRadius) {
		let polarCoordinates = this.planarToPolarCoordinates(
			hotspot.position.x,
			hotspot.position.y,
			sphereRadius
		)

		//Ca ca fontionne pas
		let cartesianCoordinates = this.polarToCartesian(
			polarCoordinates.x,
			polarCoordinates.y,
			sphereRadius,
			hotspot
		)

		//Ca ca fonctionne a peu près
		/*let cartesianCoordinates = this.sphericalTo3DCoordinates(
			polarCoordinates.x,
			polarCoordinates.y,
			sphereRadius
		)*/

		return cartesianCoordinates
	}

	// eslint-disable-next-line no-unused-vars
	planarToPolarCoordinates(x, y, sphereRadius) {
		let longitude = RAD2DEG * (x / sphereRadius)
		let latitude =
			RAD2DEG * (2 * Math.atan(Math.exp(y / sphereRadius)) - Math.PI / 2)

		return new THREE.Vector2(longitude, latitude)
	}

	/**
	 *
	 * @param {*} latitude
	 * @param {*} longitude
	 * @param {*} sphereRadius
	 */
	sphericalTo3DCoordinates(latitude, longitude, sphereRadius) {
		latitude *= DEG2RAD
		longitude *= DEG2RAD

		let coordinates = new THREE.Vector3(
			sphereRadius * Math.cos(latitude) * Math.cos(longitude) * -1,
			sphereRadius * Math.cos(latitude) * Math.sin(longitude),
			sphereRadius * Math.sin(latitude) * -1
		)

		return coordinates
	}

	// eslint-disable-next-line no-unused-vars
	polarToCartesian(longitude, latitude, sphereRadius, hotspot) {
		let origin = new THREE.Vector3(0, 0, sphereRadius)

		//Converting to radians and rotate angle to fit with THREE behaviour... (Unity axes -> THREE axes)
		var phi = latitude * DEG2RAD;
		var theta = (270 - longitude) * DEG2RAD;
		
		//let rotation = new THREE.Euler(latitude, longitude, 0)
		let rotation = new THREE.Euler(phi, theta, 0, 'YZX')
		let point = origin.applyEuler(rotation)

		return point
	}

	loadHotspotTextures() {
		this.textureLoader.load(
			'/assets/textures/hotspots/White/Content/Off-2.png',
			(texture) => {
				this.textures['TextHotspot'] = texture
			}
		)

		this.textureLoader.load(
			'/assets/textures/hotspots/Move/Off/White-2.png',
			(texture) => {
				this.textures['CloseUpHotspot'] = texture
			}
		)
	}
}
