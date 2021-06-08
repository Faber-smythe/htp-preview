<template>
  <div id="carousel-holder">
    <div
      class="offscreen card"
      :style="cardBackground"
      @click="(e) => cardClick(e)"
      @mouseover="hoverFreeze = true"
      @mouseleave="hoverFreeze = false"
    >
      <p>
        <img class="grade" :src="`/img/reviews/${items[0].grade}.png`" alt="" />
      </p>
      <p>"{{ items[0].text }}"</p>
    </div>
    <div
      class="animated prev card"
      :style="cardBackground"
      @click="(e) => cardClick(e)"
      @mouseover="hoverFreeze = true"
      @mouseleave="hoverFreeze = false"
    >
      <p>
        <img class="grade" :src="`/img/reviews/${items[1].grade}.png`" alt="" />
      </p>
      <p>"{{ items[1].text }}"</p>
    </div>
    <div
      class="animated current card"
      :style="cardBackground"
      @click="(e) => cardClick(e)"
      @mouseover="hoverFreeze = true"
      @mouseleave="hoverFreeze = false"
    >
      <p>
        <img class="grade" :src="`/img/reviews/${items[2].grade}.png`" alt="" />
      </p>
      <p>"{{ items[2].text }}"</p>
    </div>
    <div
      class="animated next card"
      :style="cardBackground"
      @click="(e) => cardClick(e)"
      @mouseover="hoverFreeze = true"
      @mouseleave="hoverFreeze = false"
    >
      <p>
        <img class="grade" :src="`/img/reviews/${items[3].grade}.png`" alt="" />
      </p>
      <p>"{{ items[3].text }}"</p>
    </div>
  </div>
</template>

<script lang="ts">
// import libs
import { Component, Mixins, Prop } from 'vue-property-decorator'
// import types
import { UtilMixins } from '@/utils/mixins'
import { Review } from '@/types/Site'

@Component
export default class FooterCarousel extends Mixins(UtilMixins) {
  @Prop({ type: Array, required: true }) readonly items!: Review[]
  currentIndex: number = 2
  hoverFreeze: boolean = false
  carouselInterval!: any
  get cardBackground() {
    if (this.isFirefox || this.isIe) {
      return 'background-color : rgba(255, 255, 255, 0.3) !important'
    } else {
      return 'background-color : rgba(255, 255, 255, 0.2) !important; backdrop-filter: blur(10px)'
    }
  }

  mounted() {
    this.carouselInterval = setInterval(() => {
      if (!this.hoverFreeze) {
        this.toNext()
      }
    }, 15000)
  }

  cardClick(e) {
    if (e.target.classList.contains('prev')) {
      this.toPrevious()
    } else if (e.target.classList.contains('next')) {
      this.toNext()
    }
  }

  toPrevious() {
    // fetch the current layout
    const current = document.querySelector('.current.card')! as HTMLElement
    const prev = document.querySelector('.prev.card')! as HTMLElement
    const next = document.querySelector('.next.card')! as HTMLElement
    const offscreen = document.querySelector('.offscreen.card')! as HTMLElement
    // slide the visible cards
    current.classList.add('next')
    current.classList.remove('current')
    prev.classList.remove('prev')
    prev.classList.add('current')
    // decrement currentIndex, filling the offscreen card
    const offIndex =
      this.currentIndex - 2 >= 0
        ? this.currentIndex - 2
        : this.items.length + (this.currentIndex - 2)
    offscreen.innerHTML = `<p><img class="grade" src="/img/reviews/${this.items[offIndex].grade}.png" alt="" /></p><p>${this.items[offIndex].text}</p>`
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.items.length - 1
    }
    // fade in the offscreen card
    offscreen.classList.add('prev')
    offscreen.classList.add('animated')
    offscreen.classList.remove('offscreen')
    // fade out the next card
    next.classList.add('offscreen')
    next.classList.remove('animated')
    next.classList.remove('next')
  }

  toNext() {
    // fetch the current layout
    const current = document.querySelector('.current.card')! as HTMLElement
    const prev = document.querySelector('.prev.card')! as HTMLElement
    const next = document.querySelector('.next.card')! as HTMLElement
    const offscreen = document.querySelector('.offscreen.card')! as HTMLElement
    // slide the visible cards
    current.classList.add('prev')
    current.classList.remove('current')
    next.classList.remove('next')
    next.classList.add('current')
    // increment currentIndex, filling the offscreen card
    const offIndex =
      this.currentIndex + 2 < this.items.length
        ? this.currentIndex + 2
        : this.currentIndex + 2 - this.items.length
    offscreen.innerHTML = `<p><img class="grade" src="/img/reviews/${this.items[offIndex].grade}.png" alt="" /></p><p>"${this.items[offIndex].text}"</p>`
    this.currentIndex++
    if (this.currentIndex > this.items.length - 1) {
      this.currentIndex = 0
    }
    // fade in the offscreen card
    offscreen.classList.add('next')
    offscreen.classList.add('animated')
    offscreen.classList.remove('offscreen')
    // fade out the prev card
    prev.classList.add('offscreen')
    prev.classList.remove('animated')
    prev.classList.remove('prev')
  }
}
</script>

<style>
#carousel-holder {
  position: absolute;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
  width: 100%;
}
.card {
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 15px;
  width: 30vw;
  height: 30vh;
  color: white;
  border: 1px solid gray;
  font-size: 1.5rem;
}
.card .grade {
  height: 5vh;
}
.card p {
  text-align: center;
  margin-top: 15px;
  pointer-events: none;
}
.prev.card,
.next.card {
  opacity: 0.7;
  transform: scale(0.7);
  z-index: 1;
  cursor: pointer;
}
.prev.card:hover,
.next.card:hover {
  opacity: 0.8;
  transition: all 0.3s ease;
  transform: scale(0.75);
}
.prev {
  margin-left: -40vw;
}
.animated {
  transition: all 0.8s ease;
}
.next {
  margin-right: -40vw;
}
.offscreen {
  opacity: 0 !important;
  transform: scale(0.5) !important;
  z-index: 0 !important;
  pointer-events: none;
}
</style>
