import * as THREE from 'three'

const RAD2DEG = 180 / Math.PI
// eslint-disable-next-line no-unused-vars
const DEG2RAD = Math.PI / 180

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

		//Ca ca fontionne pas
		/*let cartesianCoordinates = this.polarToCartesian(
			polarCoordinates.x,
			polarCoordinates.y,
			sphereRadius
		)*/

		//Ca ca fonctionne a peu près
		let cartesianCoordinates = this.sphericalTo3DCoordinates(
			polarCoordinates.x,
			polarCoordinates.y,
			sphereRadius
		)
		return cartesianCoordinates
	}

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
	polarToCartesian(longitude, latitude, sphereRadius) {
		//A mon avis je comprends rien à ce qu'il se passe copy pasta violent !
		let origin = new THREE.Vector3(0, 0, sphereRadius)
		//let rotation = new THREE.Euler(latitude, longitude, 0)
		let rotation = new THREE.Quaternion().setFromEuler(
			new THREE.Euler(latitude, longitude, 0)
		)
		let point = origin.applyQuaternion(rotation)

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
