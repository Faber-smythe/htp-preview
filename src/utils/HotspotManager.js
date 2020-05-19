import * as THREE from 'three'

const RAD2DEG = 180 / Math.PI
const DEG2RAD = Math.PI / 180

export class HotspotManager {
	constructor() {
		this.textures = {}
		this.textureLoader = new THREE.TextureLoader()
	}

	/**
	 * Return 3D cartesian coordinates for the specific hotspots into the displayed spheremap
	 * @param {Object} hotspot
	 * @param {Number} sphereRadius
	 */

	generate3DPosition(hotspot, sphereRadius) {
		//Generate polar coordinates according to 2D cartesian coordinates of the specific hotspot
		let polarCoordinates = this.planarToPolarCoordinates(
			hotspot.position.x,
			hotspot.position.y,
			sphereRadius
		)
		
		//Generate 3D cartesian coordinates according to polar coordinates (latitude and longitude)
		let cartesianCoordinates = this.polarToCartesian(
			polarCoordinates.x,
			polarCoordinates.y,
			sphereRadius,
			hotspot
		)

		return cartesianCoordinates
	}

	/**
	 * Function used to convert polar coordinates from 2D cartesian coordinates by applying the inverse
	 * of the Mercator projection
	 * @param {*} x 
	 * @param {*} y 
	 * @param {*} sphereRadius 
	 */
	planarToPolarCoordinates(x, y, sphereRadius) {
		let longitude = RAD2DEG * (x / sphereRadius)
		let latitude =
			RAD2DEG * (2 * Math.atan(Math.exp(y / sphereRadius)) - Math.PI / 2)

		return new THREE.Vector2(longitude, latitude)
	}

	/**
	 * Function used to convert spherical to 3D cartesian coordinates (not working well...)
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

	/**
	 * Function used to convert latitude and longitude to 3D cartesian coordinates 
	 * @param {*} longitude 
	 * @param {*} latitude 
	 * @param {*} sphereRadius 
	 */
	polarToCartesian(longitude, latitude, sphereRadius) {
		let origin = new THREE.Vector3(0, 0, sphereRadius)

		//Converting to radians and rotate angle to fit with THREE behaviour... (Unity 3D axes -> THREE.js 3D axes)
		var phi = latitude * DEG2RAD;
		var theta = (270 - longitude) * DEG2RAD;
		
		//Apply euler rotation
		let rotation = new THREE.Euler(phi, theta, 0, 'YZX')
		let point = origin.applyEuler(rotation)

		return point
	}

	/**
	 * Load textures used to display hotspots sprites
	 */
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
