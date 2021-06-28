import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Scrollbar from 'smooth-scrollbar'

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
}

function getVhInPixels(): number {
  return window.innerHeight
}

function getVwInPixels(): number {
  return window.innerWidth
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

  static initAnimatedHistopadScroller() {
    ScrollController.enableSmoothScroll()

    const tweenSection = document.querySelector('#animated-histopad-section')!
    const multilayerTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: tweenSection,
        start: 'center center',
        end: `${getVhInPixels() * 4} center`,
        toggleActions: 'play none reverse none',
        scrub: true,
        // markers: true,
        pin: tweenSection,
      },
    })
    multilayerTimeline.from('.stacked-img.stagger-img', {
      marginBottom: '-120px',
      marginLeft: '-60px',
      opacity: 0,
      stagger: 0.6,
    })
  }

  static initFolioscopeScroller(duration) {
    const scrollbar = ScrollController.enableSmoothScroll()

    const folioSection = document.querySelector('#folioscopeSection')!

    const folioscopeTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: folioSection,
        start: 'center center',
        end: `${duration} top`,
        toggleActions: 'play none reverse none',
        scrub: true,
        // markers: true,
        pin: folioSection,
      },
    })
    folioscopeTimeline
      .from(
        '#trailerLogoHolder',
        {
          rotation: '180deg',
          scale: 0.01,
          opacity: 0,
          duration: 5,
        },
        1
      )
      .from(
        '#trailerBrand span',
        {
          rotationX: '90deg',
          duration: 3.5,
        },
        5
      )
      .from(
        '#trailerBrand',
        {
          scale: '0.6',
          duration: 6,
        },
        16
      )

    return scrollbar
  }

  static initImmersiveScroller(duration) {
    const scrollBar = ScrollController.enableSmoothScroll()

    // declaration
    const immersiveStage = document.getElementById('immersive-stage')!

    // handle pageUp event
    document.getElementById('pageUp')!.addEventListener('click', () => {
      scrollBar.scrollTo(0, 0, 1500)
    })

    // trailer title and line needs to be pinned a bit longer
    gsap.timeline({
      scrollTrigger: {
        trigger: '#immersive-section',
        start: 'top bottom',
        end: `${duration} center`,
        toggleActions: 'play none reverse none',
        scrub: true,
        pin: '#trailerBrand',
      },
    })
    gsap.timeline({
      scrollTrigger: {
        trigger: '#immersive-section',
        start: 'top bottom',
        end: `${duration} center`,
        toggleActions: 'play none reverse none',
        scrub: true,
        pin: '#trailerline',
      },
    })

    // title needs to be pinned a bit longer
    gsap
      .timeline({
        scrollTrigger: {
          trigger: '#immersive-section',
          start: 'top bottom',
          end: `top top`,
          toggleActions: 'play none reverse none',
          scrub: true,
          pin: '#trailerBrand',
        },
      })
      .to(
        '#trailerBrand',
        {
          filter: 'blur(20px)',
          opacity: '0',
        },
        0
      )
      .from(
        '#trailerline',
        {
          filter: 'blur(20px)',
          opacity: '0',
        },
        0
      )

    // handle the immersive animated narration
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

    immersiveTimeline.to(
      'nav.navbar',
      {
        rotationX: '90deg',
        duration: 0.5,
        ease: 'expo.in',
      },
      0
    )
    immersiveTimeline.to(
      '#trailerline h2',
      {
        opacity: '0',
        translateX: '20vw',
        // filter: 'blur(10px)',
        duration: 2,
      },
      0.5
    )
    immersiveTimeline.from(
      immersiveStage,
      {
        opacity: 0,
        duration: 2,
      },
      0.3
    )
    immersiveTimeline.to(
      '#trailerBrand',
      {
        display: 'none',
        duration: 0.01,
      },
      2
    )
    immersiveTimeline.from(
      '#HUD_holder',
      {
        opacity: 0,
        display: 'none',
        duration: 0.8,
      },
      1.8
    )
    immersiveTimeline.to(
      '#HUD_holder',
      {
        opacity: 0,
        display: 'none',
        duration: 0.8,
      },
      7.2
    )
    immersiveTimeline.to(
      'nav.navbar',
      {
        rotationX: '0deg',
        duration: 0.5,
        ease: 'expo.in',
      },
      8
    )
    immersiveTimeline.to(
      '#pageUp',
      {
        bottom: '1rem',
        duration: 0.5,
        ease: 'expo.in',
      },
      8
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
          // markers: true,
          // pin: '#header-section h1',
        },
      })
      newTimeline.from('#footer-section .fade-black-top', {
        height: '200vh',
        duration: 2,
      })
    }, 2000)
  }
}
