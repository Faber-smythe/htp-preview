// eslint-disable-next-line no-unused-vars
import { Howl, Howler } from 'howler'
import Bluebird from 'bluebird'

export class SoundManager {
	constructor() {
		window.AudioContext = window.AudioContext || window.webkitAudioContext
		this.context = new AudioContext()
		this.soundIndex = 0
		this.muted = false
	}

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

	// eslint-disable-next-line no-unused-vars
	playSoundAtIndex(index) {
		if (this.sounds[this.soundIndex].playing) {
			this.sounds[this.soundIndex].stop()
		}
		this.soundIndex = index
		this.sounds[this.soundIndex].mute(this.muted)
		this.sounds[this.soundIndex].play()
	}

	mute(muted) {
		this.muted = muted
		this.sounds[this.soundIndex].mute(this.muted)
	}

	unloadSounds() {
		this.sounds.forEach((sound) => {
			if (sound.playing) {
				sound.stop()
			}
			sound.unload()
		})
	}
}
