import React, { useState, useEffect } from 'react'
import './BreathingGame.css'

export default function BreathingGame() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState('inhale') // inhale, hold, exhale
  const [scale, setScale] = useState(1)

  const cycleDuration = {
    inhale: 4000,
    hold: 2000,
    exhale: 6000
  }

  useEffect(() => {
    if (!isActive) return

    const phases = ['inhale', 'hold', 'exhale']
    let currentPhaseIndex = 0

    const cycle = () => {
      const currentPhase = phases[currentPhaseIndex]
      setPhase(currentPhase)

      if (currentPhase === 'inhale') {
        setScale(1.5)
      } else if (currentPhase === 'exhale') {
        setScale(1)
      }

      setTimeout(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length
        cycle()
      }, cycleDuration[currentPhase])
    }

    cycle()
  }, [isActive])

  const getInstruction = () => {
    const instructions = {
      inhale: 'Breathe in slowly...',
      hold: 'Hold...',
      exhale: 'Breathe out gently...'
    }
    return instructions[phase]
  }

  const getPetals = () => {
    return Array.from({ length: 12 }, (_, i) => (
      <div
        key={i}
        className="breathing-petal"
        style={{
          '--rotation': `${i * 30}deg`,
          '--delay': `${i * 0.1}s`
        }}
      />
    ))
  }

  return (
    <div className="breathing-game">
      <div className="card breathing-card">
        <h2>🌬️ Breathing Exercise</h2>
        <p className="breathing-subtitle">
          Follow the sakura petals. Breathe in, hold, and breathe out.
        </p>

        <div className="breathing-circle-container">
          <div 
            className="breathing-circle"
            style={{ transform: `scale(${scale})` }}
          >
            {getPetals()}
            <div className="breathing-center">
              <span className="breathing-instruction">{getInstruction()}</span>
            </div>
          </div>
        </div>

        <div className="breathing-controls">
          <button
            className={`btn ${isActive ? 'btn-secondary' : ''}`}
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? 'Pause' : 'Start Breathing'}
          </button>
        </div>

        <div className="breathing-tips">
          <p>💡 <strong>Tip:</strong> Find a comfortable position and focus on the rhythm. This exercise helps reduce stress and anxiety.</p>
        </div>
      </div>
    </div>
  )
}
