import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Scrollbar from 'smooth-scrollbar'

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
}

export default class ScrollController {
  static enableSmoothScroll() {
    // Setup
    const scroller = document.getElementById('section-holder')!
    const bodyScrollBar = Scrollbar.init(scroller, {
      damping: 0.2,
      delegateTo: document,
      alwaysShowTracks: true,
    })
    bodyScrollBar.track.xAxis.element.remove()

    ScrollTrigger.scrollerProxy(scroller, {
      scrollTop(value) {
        if (arguments.length) {
          bodyScrollBar.scrollTop = value!
        }
        return bodyScrollBar.scrollTop
      },
    })
    bodyScrollBar.addListener(ScrollTrigger.update)

    ScrollTrigger.defaults({ scroller })

    // Only necessary to correct marker position - not needed in production
    if (document.querySelector('.gsap-marker-scroller-start')) {
      const markers = gsap.utils.toArray('[class *= "gsap-marker"]')

      bodyScrollBar.addListener(({ offset }) => {
        gsap.set(markers, { marginTop: -offset.y })
      })
    }
    return bodyScrollBar
  }

  static initHeaderScroller() {
    ScrollController.enableSmoothScroll()

    // handle header pinning and fading
    const fadeUpTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#header-section',
        start: 'center center',
        endTrigger: '#header-section',
        end: `bottom 25%`,
        toggleActions: 'play none reverse none',
        scrub: true,
        pin: '#header-section h1',
      },
    })
    fadeUpTimeline.to('#header-section .fade-black-bottom', {
      height: '200vh',
      duration: 2,
    })
    fadeUpTimeline
      .to(
        '#header-section h1',
        {
          opacity: 0,
          duration: 0.7,
        },
        1.8
      )
      .to(
        '#header-section h1',
        {
          marginTop: '-100px',
          duration: 2.5,
        },
        0
      )
  }

  static initImmersiveScroller(
    duration: number,
    scrollAnimSeparators: any,
    screenMagnets: number[]
  ) {
    const scrollBar = ScrollController.enableSmoothScroll()

    /**
     * DECLARING ANIMATION DURATIONS
     * since scrub is enabled, these values are not seconds,
     * but will be parsed by gsap as proportions of the total duration in scrolled pixels
     * /!!\ don't confuse with ImmersiveSection's SETTINGS PROPERTIES
     */
    const { tabletEnd, trailerLineEnd } = scrollAnimSeparators

    const fullAnim = 20 // arbitrary total, only used to set proportions
    const durations = {
      tabletAnim: fullAnim * tabletEnd,
      trailerLine: fullAnim * trailerLineEnd - fullAnim * tabletEnd,
      autopilotAnim: fullAnim - fullAnim * trailerLineEnd,
      screenFade: 0.8, // fadeIn and fadeOut of every screen
      screenStay: 0.4, // how long before the screen fades
      navbarFold: 0.2, // both up then down
      hudFade: 0.4, // both in then out
      immersiveFade: 0.4, // on entering
      pageupSlidein: 0.5,
    }

    const immersiveTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#immersive-section',
        start: 'center center',
        end: `${duration} top`,
        toggleActions: 'play none reverse none',
        scrub: true,
        // markers: true,
        pin: '#immersive-section',
      },
    })

    // below is tablet animation
    immersiveTimeline.to(
      '#immersive-section',
      { duration: durations.tabletAnim },
      0
    )
    /** ... ... tablet animation is happening now (but defined in ImmersiveScene) ... ... **/
    immersiveTimeline.set(
      '#immersive-stage',
      { opacity: 0 },
      durations.tabletAnim
    )
    // below iterate over screens to display appropriate text content
    screenMagnets.forEach((ratio, i) => {
      // fade in
      immersiveTimeline.to(
        `#screenText_${i + 1}`,
        {
          opacity: 1,
          display: 'flex',
          marginTop: 0,
          duration: durations.screenFade,
        },
        durations.tabletAnim * ratio - durations.screenFade
      )
      // fade out
      immersiveTimeline.to(
        `#screenText_${i + 1}`,
        { opacity: 0, marginTop: '-350px', duration: durations.screenFade },
        durations.tabletAnim * ratio + durations.screenStay
      )
      immersiveTimeline.set(
        `#screenText_${i + 1}`,
        { display: 'none' },
        durations.tabletAnim * ratio +
          durations.screenStay +
          durations.screenFade
      )
    })

    // below is trailerLine animation
    // fade in
    const portion = 1.5
    const invertedPortion = 2.3
    immersiveTimeline.to(
      '#trailerLine',
      {
        opacity: 1,
        duration: durations.trailerLine / invertedPortion,
        ease: 'power3.out',
      },
      durations.tabletAnim
    )
    immersiveTimeline.set(
      '#trailerLine',
      { display: 'flex' },
      durations.tabletAnim
    )
    immersiveTimeline.to(
      '#diveInto, #thePast',
      {
        marginTop: '0',
        duration: durations.trailerLine / invertedPortion,
        ease: 'power3.out',
      },
      durations.tabletAnim
    )
    // fade out
    immersiveTimeline.to(
      '#diveInto',
      {
        marginTop: '-50vh',
        duration: durations.trailerLine / invertedPortion,
        ease: 'power3.in',
      },
      durations.tabletAnim + durations.trailerLine / portion
    )
    immersiveTimeline.to(
      '#thePast',
      {
        marginTop: '50vh',
        duration: durations.trailerLine / invertedPortion,
        ease: 'power3.in',
      },
      durations.tabletAnim + durations.trailerLine / portion
    )
    immersiveTimeline.to(
      '#trailerLine',
      {
        opacity: 0,
        duration: durations.trailerLine / invertedPortion,
        ease: 'power3.in',
      },
      durations.tabletAnim + durations.trailerLine / portion
    )
    immersiveTimeline.set(
      '#trailerLine',
      { display: 'none' },
      durations.tabletAnim + durations.trailerLine
    )
    // below is traveling animation
    immersiveTimeline.to(
      'nav.navbar',
      {
        rotationX: '90deg',
        duration: durations.navbarFold,
        ease: 'expo.in',
      },
      durations.tabletAnim + durations.trailerLine - durations.navbarFold
    )
    immersiveTimeline.from(
      '#HUD_holder',
      {
        opacity: 0,
        display: 'none',
        duration: durations.hudFade,
      },
      durations.tabletAnim + durations.trailerLine - durations.hudFade
    )
    immersiveTimeline.to(
      '#immersive-stage',
      {
        opacity: 1,
        duration: durations.immersiveFade,
      },
      durations.tabletAnim + durations.trailerLine - durations.immersiveFade / 2
    )
    /** ... ... autopilot is happening now (but defined in ImmersiveScene) ... ... **/
    immersiveTimeline.to(
      '#HUD_holder',
      {
        opacity: 0,
        display: 'none',
        duration: durations.hudFade,
      },
      durations.tabletAnim + durations.trailerLine + durations.autopilotAnim
    )
    immersiveTimeline.to(
      'nav.navbar',
      {
        rotationX: '0deg',
        duration: durations.navbarFold,
        ease: 'expo.in',
      },
      durations.tabletAnim + durations.trailerLine + durations.autopilotAnim
    )
    immersiveTimeline.to(
      '#pageUp',
      {
        bottom: '1rem',
        duration: durations.pageupSlidein,
        ease: 'expo.in',
      },
      durations.tabletAnim + durations.trailerLine + durations.autopilotAnim
    )

    return scrollBar
  }

  static initFooterScroller() {
    ScrollController.enableSmoothScroll()
    setTimeout(() => {
      // handle dark fading up
      const newTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '#footer-section',
          start: 'top center',
          end: `center center`,
          toggleActions: 'play none reverse none',
          scrub: true,
        },
      })
      newTimeline.from('#footer-section .fade-black-top', {
        height: '200vh',
        duration: 2,
      })
    }, 2000)
  }

  static enableScrollMagnetMarkers(magnets) {
    const keys = Object.keys(magnets)
    const values = Object.values(magnets) as number[]

    keys.forEach((key, i) => {
      const color = `hsl(${Math.random() * 360}, 100%, 70%)`
      const marker = document.createElement('span') as HTMLElement
      marker.classList.add('scroll-magnet-marker')
      marker.style.top = `${values[i] + window.innerHeight / 2}px`
      marker.style.borderColor = color
      marker.style.color = color
      marker.innerHTML = key

      const scroller = document.querySelector('.scroll-content')!
      scroller.append(marker)
    })
  }
}
