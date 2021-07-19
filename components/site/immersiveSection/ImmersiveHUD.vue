<template>
  <div id="HUD_holder">
    <div id="HUD_top">
      <!-- Scene title -->
      <div class="head">
        <h2 class="title-font header-title HUD_element">
          <span style="max-width: 80%">{{ title }}</span>
        </h2>
      </div>
    </div>

    <!-- time slider -->
    <div id="HUD_bottom">
      <!-- Time slider -->
      <!-- Slider labels left and right-->
      <span
        class="slider-tooltip left-slider-tooltip noselect HUD_element"
        @click="onSliderTooltipClick(0)"
        >{{ $t(sliderTooltipsLabels[0]) }}
      </span>
      <span
        class="slider-tooltip right-slider-tooltip noselect HUD_element"
        @click="onSliderTooltipClick(1)"
        >{{
          sliderTooltipsLabels[1] == 'today'
            ? todayYear
            : $t(sliderTooltipsLabels[1])
        }}
      </span>
      <b-field class="time-slider">
        <input
          :disabled="loading"
          type="range"
          min="0"
          max="100"
          class="custom-slider HUD_element"
          :style="isFirefox ? 'margin-bottom: 15px;' : ''"
          :value="timeSlidePercent"
          @input="(e) => onTimeSliding(e)"
        />
      </b-field>
      <div class="time-slider-background">
        <div
          class="background-slider"
          style="margin-left: 15px; margin-right: 15px"
        ></div>
      </div>
      <!-- Audio settings -->
    </div>
  </div>
</template>

<script lang="ts">
// import libs
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator'
import VTooltip from 'v-tooltip'
// import types
import Site from '@/types/Site'
import ImmersiveContent from '@/types/ImmersiveContent'
// miscellaneous
import { UtilMixins } from '@/utils/mixins'

Vue.use(VTooltip)

@Component
export default class ImmersiveHUD extends Mixins(UtilMixins) {
  @Prop({ type: Object, required: true }) readonly site!: Site
  @Prop({ type: Object, required: true }) readonly immersive!: ImmersiveContent
  @Prop({ type: String, required: true }) readonly title!: string
  @Prop({ type: Boolean, required: true }) readonly loading!: boolean
  @Prop({ type: Number, required: true }) readonly timeSlidePercent!: number
  @Prop({ type: Array, required: true })
  readonly sliderTooltipsLabels!: string[]

  soundToggle = false
  sites: Site[] = []

  onSliderTooltipClick(index) {
    const slideValue = (100 / (this.sliderTooltipsLabels.length - 1)) * index
    this.$emit('time-slide', slideValue)
  }

  onTimeSliding(e) {
    const slideValue = e.target.value
    this.$emit('time-slide', slideValue)
    // console.log(slideValue)
  }
}
</script>
<style scoped>
#HUD_holder {
  position: absolute;
  z-index: 5;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  width: 100%;
}
#HUD_top,
#HUD_bottom {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1% 2%;
}
#HUD_top {
  z-index: 3;
  background: linear-gradient(#111, transparent);
  margin-top: -2px;
}
#HUD_top .head {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}
#HUD_top .head .icon {
  margin-top: 1vh;
  font-size: 2rem;
  color: white;
  transition: all 0.3s ease;
  opacity: 0.5;
}
#HUD_top .head:hover .icon {
  opacity: 1;
}
.HUD_element,
.HUD_element button {
  pointer-events: all;
  color: white;
  border: none;
}
#HUD_top .header-title {
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.25;
}
#HUD_bottom {
  background: linear-gradient(transparent, #111);
  margin-bottom: -2px;
}
#tutorial {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  color: rgb(0, 255, 0);
  transition: all 0.6s ease;
  opacity: 0;
  /* pointer-events: all; */
}
#tutorial .tutorial-block {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: italic;
  /* border: 1px solid red; */
}
#tutorial .tutorial-block p {
  margin: 15px;
  width: 20vh;
  text-align: center;
  font-size: 0.9rem;
}
#tutorial .tutorial-arrow {
  max-width: 25vh;
  max-height: 25vh;
  transform-origin: center;
}
#historyPanel {
  position: absolute;
  z-index: 2;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: all;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  transition: all 0.6s ease;
  top: -100%;
}
#historyPanel #historyHolder {
  width: 90%;
  height: 70vh;
  overflow-y: scroll;
}
#historyPanel p {
  text-indent: 2rem;
  margin: 20px;
  text-align: justify;
}
#treasurePanel {
  position: fixed;
  z-index: 5;
  background: rgba(0, 0, 0, 1);
  color: white;
  height: 100vh;
  width: 50vw;
  left: -53%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  transition: all 0.4s ease;
}
#treasurePanel h2 {
  font-size: 2rem;
  margin: 20px;
}
#treasurePanel h3 {
  font-size: 1.5rem;
  margin: 10px;
  text-indent: 3rem;
}
#treasurePanel p {
  margin: 10px;
  font-size: 1.1rem;
}
#treasurePanel img {
  width: 12vw;
  align-self: center;
}
#treasureArrow {
  position: absolute;
  width: 2.5rem;
  height: 2.5rem;
  padding: 10px;
  background: rgba(0, 0, 0, 1);
  font-size: 2rem;
  right: -1.25rem;
  border: 1px solid transparent;
  border-right-color: white;
  border-top-color: white;
  transform-origin: center;
  transform: rotate(225deg);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.4s ease;
}
#treasureArrow .icon {
  transform-origin: center;
  transform: rotate(-45deg);
  transition: all 0.4s ease;
}
#treasureArrow:hover {
  filter: invert(1);
}
#histopad_logo,
#soundSetting_button {
  position: absolute;
  align-self: flex-end;
  cursor: pointer;
}
#soundSetting_button,
#soundSetting_button * {
  background: transparent;
  color: white;
}
.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.1);
}
.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}
.slider-container {
  display: flex;
  height: auto;
  width: 6rem;
  background: black;
  border-radius: 3px;
  padding: 1em;
}

input[type='range'].sound-slider {
  -webkit-appearance: none;
  width: 1rem;
  height: 8rem;
  border-radius: 5px;
  background: #ccc;
  outline: none;
  writing-mode: bt-lr; /* IE */
  margin-top: 0.6rem;
  margin-bottom: 0.6rem;
  -webkit-appearance: slider-vertical; /* WebKit */
}

.btn-volume-up {
  position: fixed;
  top: 0em;
  left: 1.7em;
}

.btn-volume-down {
  position: fixed;
  bottom: 0em;
  left: 1.7em;
}
.btn-volume-down,
.btn-volume-up {
  background: transparent;
}

input[type='range'].custom-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 3.4px;
  cursor: pointer;
  background: white;
  border-radius: 1.3px;
  margin: 5px;
}

input[type='range'].custom-slider:focus::-webkit-slider-runnable-track {
  background: white;
}

.time-slider {
  margin-left: auto;
  margin-right: auto;
  width: 33%;
}

.time-slider-background {
  width: 33%;
  margin-left: auto;
  margin-right: auto;
}

/** Slider tooltips */
.slider-tooltip {
  font-size: 1em;
  cursor: pointer;
}

.left-slider-tooltip {
  position: absolute;
  bottom: 0.4em;
  left: 32%;
  text-align: center;
  width: 5rem;
}

.right-slider-tooltip {
  position: absolute;
  bottom: 0.4em;
  right: 32%;
  text-align: center;
  width: 5rem;
}

.background-slider {
  height: 3.4px;
  background: rgba(185, 185, 185, 0.5);
  border-radius: 1.3px;
  margin-left: 22px;
  margin-right: 22px;
  margin-top: -20px;
}

input[type='range'].custom-slider {
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
}

input[type='range'].custom-slider:focus {
  outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}

input[type='range'].custom-slider::-ms-track {
  width: 100%;
  cursor: pointer;

  /* Hides the slider so custom styles can be added */
  background: transparent;
  border-color: transparent;
  color: transparent;
}

input[type='range'].custom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: none;
  height: 40px;
  width: 21px;
  background: white;
  background: url('/img/time_cursor_thin.png') no-repeat;
  border-radius: 0 !important;
  margin-top: -40px;
}

input[type='range'].custom-slider::-moz-range-thumb {
  height: 40px;
  width: 21px;
  border: 0;
  background: url('/img/time_cursor_thin.png') no-repeat;
  cursor: pointer;
}

/* All the same stuff for IE */
input[type='range'].custom-slider::-ms-thumb {
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  border: 1px solid #000000;
  height: 26px;
  width: 10px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
}

input[type='range'].custom-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 3.4px;
  cursor: pointer;
  background: rgba(185, 185, 185, 0);
  border-radius: 1.3px;
  margin: 5px;
}

input[type='range'].custom-slider:focus::-webkit-slider-runnable-track {
  background: rgba(185, 185, 185, 0);
}

input[type='range'].custom-slider::-moz-range-track {
  width: 100%;
  height: 3.4px;
  cursor: pointer;
  background: rgba(185, 185, 185, 0);
  margin-bottom: 20px;
  border-radius: 1.3px;
}

input[type='range'].custom-slider:focus::-moz-range-track {
  background: rgba(185, 185, 185, 0);
}

input[type='range'].custom-slider::-ms-track {
  width: 100%;
  height: 3.4px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  border-width: 16px 0;
  margin: 5px;
  color: transparent;
}

input[type='range'].custom-slider::-ms-fill-lower {
  background: rgba(185, 185, 185, 0);
  border-radius: 2.6px;
}
input[type='range'].custom-slider:focus::-ms-fill-lower {
  background: rgba(185, 185, 185, 0);
}
input[type='range'].custom-slider::-ms-fill-upper {
  background: rgba(185, 185, 185, 0);
  border-radius: 2.6px;
}
input[type='range'].custom-slider:focus::-ms-fill-upper {
  background: rgba(185, 185, 185, 0);
}
</style>
