import React from 'react'
import './MoodIndicator.css'

export default function MoodIndicator({ mood }) {
  const moodConfig = {
    low: {
      emoji: '🌙',
      label: 'Low Mood',
      color: 'var(--sakura-purple)',
      message: 'Time for gentle self-care'
    },
    neutral: {
      emoji: '☁️',
      label: 'Neutral',
      color: 'var(--sakura-pink-light)',
      message: 'Steady and balanced'
    },
    high: {
      emoji: '✨',
      label: 'High Mood',
      color: 'var(--sakura-pink)',
      message: 'Feeling great!'
    }
  }

  const config = moodConfig[mood] || moodConfig.neutral

  return (
    <div className="mood-indicator" style={{ '--mood-color': config.color }}>
      <div className="mood-emoji">{config.emoji}</div>
      <div className="mood-info">
        <div className="mood-label">{config.label}</div>
        <div className="mood-message">{config.message}</div>
      </div>
      <div className="mood-petals">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="petal">🌸</span>
        ))}
      </div>
    </div>
  )
}
