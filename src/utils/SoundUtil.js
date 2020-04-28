// eslint-disable-next-line no-unused-vars
import { Howl, Howler } from 'howler'
import Bluebird from 'bluebird'

export class SoundUtil {
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

		/*return new Promise((resolve, reject) => {
			this.bufferLoader = new BufferLoader(this.context, soundFiles)
			this.bufferLoader.load().then((bufferList) => {
                console.log('Buffer list', bufferList)
                this.finishLoading(bufferList)
                resolve(true)
			}).catch((error) => {
                reject(error)
            })
		})*/
	}

	finishLoading(bufferList) {
		this.sources = []

		bufferList.forEach((buffer) => {
			let source = this.context.createBufferSource()
			source.loop = true
			source.buffer = buffer
			source.connect(this.context.destination)
			this.sources.push(source)
		})
	}

	loadSound(soundFile) {
		return new Promise((resolve) => {
			let sound = new Howl({
				src: [soundFile],
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
			sound.stop()
			sound.unload()
		})
	}
}
