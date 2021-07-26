<template>
  <div id="HUD_holder">
    <!-- 
      TITLE
      (HUD_top is holding the black fading effect)
    -->
    <div id="HUD_top">
      <div class="head">
        <h2 class="title-font header-title HUD_element">
          <span style="max-width: 80%">{{ title }}</span>
        </h2>
      </div>
    </div>

    <!-- 
      TIME SLIDER
      (HUD_bottom is holding the black fading effect)
    -->
    <div id="HUD_bottom">
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
    </div>
  </div>
</template>

<script lang="ts">
// import libs
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator'
import VTooltip from 'v-tooltip'
// import types
import Site from '@/types/Site'
// miscellaneous
import { UtilMixins } from '@/utils/mixins'

Vue.use(VTooltip)

@Component
export default class ImmersiveHUD extends Mixins(UtilMixins) {
  @Prop({ type: Object, required: true }) readonly site!: Site
  @Prop({ type: String, required: true }) readonly title!: string
  @Prop({ type: Boolean, required: true }) readonly loading!: boolean
  @Prop({ type: Number, required: true }) readonly timeSlidePercent!: number
  @Prop({ type: Array, required: true })
  readonly sliderTooltipsLabels!: string[]

  /**
   * The below events are sent up to the ImmersiveSection,
   * processed into a timeSlideLocation prop,
   * then sent down to the ImmersiveScene for alphaTimeTransition() (fading between spheremaps)
   */

  onSliderTooltipClick(index) {
    const slideValue = (100 / (this.sliderTooltipsLabels.length - 1)) * index
    this.$emit('time-slide', slideValue)
  }

  onTimeSliding(e) {
    const slideValue = e.target.value
    this.$emit('time-slide', slideValue)
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

/** Custom slider */
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
@media only screen and (max-width: 767px) {
  #HUD_top .header-title {
    padding-top: 5px;
    font-size: 1rem;
  }
  /** 
  TIME SLIDER 
  */
  .slider-tooltip {
    font-size: 0.8em;
    cursor: pointer;
  }

  .left-slider-tooltip {
    position: absolute;
    bottom: 0.4em;
    left: auto;
    right: 71vw;
    text-align: center;
    width: 5rem;
  }

  .right-slider-tooltip {
    position: absolute;
    bottom: 0.4em;
    right: auto;
    left: 71vw;
    text-align: center;
    width: 5rem;
  }
  .time-slider {
    margin-left: auto;
    margin-right: auto;
    width: 40vw;
  }

  .time-slider-background {
    width: 40vw;
    margin-left: auto;
    margin-right: auto;
  }
  .background-slider {
    margin-top: -15px;
  }
}
</style>
