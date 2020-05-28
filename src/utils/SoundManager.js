// eslint-disable-next-line no-unused-vars
import { Howl, Howler } from 'howler'
import Bluebird from 'bluebird'

export class SoundManager {
	constructor() {
		window.AudioContext = window.AudioContext || window.webkitAudioContext
		this.context = new AudioContext()
		this.soundIndex = 0
		this.muted = false
		this.volume = 0.4
	}

	/**
	 * Init playlist and player
	 * @param {Array} soundFiles
	 */
	init(soundFiles) {
		this.sounds = []
		return new Promise((resolve, reject) => {
			Bluebird.each(soundFiles, (soundFile) => {
				return this.loadSound(soundFile).then((loaded) => {
					this.sounds.push(loaded)
				})
			})
				.then(() => {
					resolve(true)
				})
				.catch((error) => {
					reject(error)
				})
		})
	}

	/**
	 * Load sound in howl player
	 * @param {Object} soundFile
	 */
	loadSound(soundFile) {
		return new Promise((resolve) => {
			let sound = new Howl({
				src: [soundFile.url],
				volume: soundFile.volume,
				loop: true,
				onload: () => {
					resolve(sound)
				},
			})
		})
	}

	/**
	 * Play sound at specific index in the loaded playlist
	 * @param {Number} index
	 */
	playSoundAtIndex(index) {
		if (this.sounds[this.soundIndex] && this.sounds[this.soundIndex].playing) {
			this.sounds[this.soundIndex].stop()
		}
		if (index < this.sounds.length) {
			this.soundIndex = index
			this.sounds[this.soundIndex].volume(this.sounds[this.soundIndex].volume)
			this.sounds[this.soundIndex].mute(this.muted)
			this.sounds[this.soundIndex].play()
		}
	}

	/**
	 * Mute player
	 * @param {boolean} muted
	 */
	mute(muted) {
		this.muted = muted
		this.sounds[this.soundIndex].mute(this.muted)
	}

	/**
	 * Set volume
	 * @param {Number} volume (between 0.0 to 1.0)
	 */
	setVolume(volume) {
		this.volume = volume
		this.sounds[this.soundIndex].volume(this.volume)
	}

	/**
	 * Unload sounds and dispose player
	 */
	unloadSounds() {
		this.sounds.forEach((sound) => {
			if (sound.playing) {
				sound.stop()
			}
			sound.unload()
		})
	}
}
