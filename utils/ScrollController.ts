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
      damping: 0.1,
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

    /*
    // first title appearance
    const titleAppear = gsap.timeline()
    titleAppear.to('h1 .letter', {
      translateY: '0px',
      // opacity: 1,
      stagger: 0.04,
      duration: 1,
      ease: 'power2.out',
    })
    */

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

  static initImmersiveScroller(leaveCallback) {
    if (
      document.querySelector('nav.navbar') === null ||
      document.getElementById('pageUp') === null
    ) {
      setTimeout(() => {
        ScrollController.initImmersiveScroller(leaveCallback)
      }, 50)
    } else {
      // handle pageUp event
      const scrollBar = ScrollController.enableSmoothScroll()
      document.getElementById('pageUp')!.addEventListener('click', () => {
        scrollBar.scrollTo(0, 0, 1500)
      })
      // handle the immersive zoom in animation
      const tweenElem = document.getElementById('immersive-stage')!
      const tabletTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '#immersive-section',
          start: 'center center',
          // endTrigger: '#sitesGrid',
          end: `${getVhInPixels() * 3} center`,
          toggleActions: 'play none reverse none',
          scrub: true,
          // markers: true,
          pin: '#immersive-section',
        },
      })
      tabletTimeline.to(
        'nav.navbar',
        {
          rotationX: '90deg',
          duration: 0.5,
          ease: 'expo.in',
        },
        0
      )
      tabletTimeline
        .from(
          tweenElem,
          {
            scale: 0.5,
            duration: 3,
          },
          0
        )
        .add(() => leaveCallback(true))
        .from(
          '#HUD_holder',
          {
            opacity: 0,
            display: 'none',
            duration: 0.8,
          },
          2.8
        )
        .to(
          '#HUD_holder',
          {
            opacity: 0,
            display: 'none',
            duration: 0.8,
          },
          7.2
        )
        .add(() => leaveCallback(true))
        .to(
          tweenElem,
          {
            scale: 0.5,
            duration: 3.5,
          },
          8
        )
        .to(
          'nav.navbar',
          {
            rotationX: '0deg',
            duration: 0.5,
            ease: 'expo.in',
          },
          8
        )
        .to(
          '#pageUp',
          {
            bottom: '1rem',
            duration: 0.5,
            ease: 'expo.in',
          },
          8
        )

      // handle the treasurePanel hide on immersive leave
      // gsap.timeline({
      //   scrollTrigger: {
      //     trigger: '#immersive-section',
      //     start: '10% 50%',
      //     // endTrigger: '#sitesGrid',
      //     end: `center center`,
      //     onLeave: () => leaveCallback(true),
      //     onLeaveBack: () => leaveCallback(true),
      //     markers: true,
      //   },
      // })
    }
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
