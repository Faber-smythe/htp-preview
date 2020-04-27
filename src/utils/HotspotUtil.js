import * as THREE from 'three'

export class HotspotUtil {
	constructor() {}

	generate3DPosition(hotspot, sphereRadius) {
		let polarCoordinates = this.planarToPolarCoordinates(hotspot.position.x, hotspot.position.y, sphereRadius)
        let cartesianCoordinates = this.polarToCartesian(polarCoordinates.x, polarCoordinates.y, sphereRadius)
        return cartesianCoordinates
	}

	planarToPolarCoordinates(x, y, sphereRadius) {
        let longitude = this.radiansToDegrees(x / sphereRadius)
        //Mathf.Rad2Deg * (2 * Mathf.Atan(Mathf.Exp(Y / sphereRadius)) - Mathf.PI / 2)
        let latitude = this.radiansToDegrees(2 * Math.atan(Math.exp(y / sphereRadius)) - (Math.PI / 2))
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

	/**
     *  
     * public static Vector3 PolarToCartesian(float longitude, float latitude, float sphereRadius)
    {
        Vector3 origin = new Vector3(0, 0, sphereRadius);
        Quaternion rotation = Quaternion.Euler(latitude, longitude, 0);
        Vector3 point = rotation * origin;
        return point;
    }

     * public static Vector2 PlanarToPolarCoordinates(float X, float Y, float sphereRadius)
    {
        Vector2 sphereCoordinates = new Vector2
        {
            // Longitude
            x = Mathf.Rad2Deg * (X / sphereRadius),

            // Latitude
            y = Mathf.Rad2Deg * (2 * Mathf.Atan(Mathf.Exp(Y / sphereRadius)) - Mathf.PI / 2)
        };
        return sphereCoordinates;
    }
     */
}
