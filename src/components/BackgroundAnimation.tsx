import { lazy, Suspense, useEffect, useState } from 'react'
import styles from './BackgroundAnimation.module.css'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

const DotLottieReact = lazy(async () => {
  const module = await import('@lottiefiles/dotlottie-react')

  return {
    default: module.DotLottieReact,
  }
})

function getPrefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  return window.matchMedia(reducedMotionQuery).matches
}

export function BackgroundAnimation() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getPrefersReducedMotion)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }

    const reducedMotionMediaQuery = window.matchMedia(reducedMotionQuery)
    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    setPrefersReducedMotion(reducedMotionMediaQuery.matches)
    reducedMotionMediaQuery.addEventListener('change', handleReducedMotionChange)

    return () => {
      reducedMotionMediaQuery.removeEventListener('change', handleReducedMotionChange)
    }
  }, [])

  const shouldRenderAnimation = !prefersReducedMotion

  return (
    <div className={styles.background} aria-hidden="true">
      <div className={styles.baseLayer} />
      {shouldRenderAnimation ? (
        <div className={styles.animationFrame}>
          <Suspense fallback={null}>
            <DotLottieReact
              className={styles.animation}
              src="/animations/japan-flow.lottie"
              autoplay
              loop
              speed={0.72}
              renderConfig={{ autoResize: true, devicePixelRatio: 1 }}
              layout={{ fit: 'contain', align: [0.5, 0.5] }}
            />
          </Suspense>
        </div>
      ) : null}
    </div>
  )
}
