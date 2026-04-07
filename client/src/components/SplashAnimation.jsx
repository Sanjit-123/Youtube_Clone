import React, { useState, useEffect } from 'react'
import '../styles/splash.css'

export default function SplashAnimation() {
  const [stage, setStage] = useState('start') // start, reveal, exit, done

  useEffect(() => {
    // We want the splash screen to play once per session.
    const hasPlayed = sessionStorage.getItem('yt_splash_played')
    if (hasPlayed) {
      setStage('done')
      return
    }

    sessionStorage.setItem('yt_splash_played', 'true')

    // 0 -> 1.5s: pulse/draw animation natively in CSS
    const t1 = setTimeout(() => setStage('reveal'), 1500)
    // 1.5s -> 3.2s: reveal text
    const t2 = setTimeout(() => setStage('exit'), 3200)
    // 3.2s -> 4.0s: fade out wrapper
    const t3 = setTimeout(() => setStage('done'), 4000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  if (stage === 'done') return null

  return (
    <div className={`splash-overlay ${stage}`}>
      <div className="splash-glow"></div>
      <div className="splash-content">
        <div className="splash-logo-container">
          <svg className="splash-icon" viewBox="0 0 28 20">
            <rect className="splash-icon-bg" width="28" height="20" rx="4" fill="transparent" stroke="#FF0000" strokeWidth="2"/>
            <polygon className="splash-icon-play" points="11,6 11,14 19,10" fill="white"/>
          </svg>
        </div>
        <div className="splash-text-container">
          <span className="splash-text">YTClone</span>
        </div>
      </div>
    </div>
  )
}
