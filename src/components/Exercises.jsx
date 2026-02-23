import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  calculateCycleDay,
  calculatePhase,
  getPhaseName,
  PHASES
} from '../utils/cycleCalculator'
import './Exercises.css'

const EXERCISE_RECOMMENDATIONS = {
  [PHASES.MENSTRUAL]: {
    intensity: 'Low',
    focus: 'Rest & Recovery',
    description: 'Your energy is naturally low. Focus on gentle movements that promote circulation without depleting you.',
    exercises: [
      {
        title: 'Yin Yoga',
        duration: '20-30 mins',
        description: 'Passive poses held for longer periods to target deep connective tissues and relax the nervous system.',
        icon: '🧘‍♀️'
      },
      {
        title: 'Walking',
        duration: '15-20 mins',
        description: 'A gentle walk in nature or around your neighborhood to boost mood and circulation.',
        icon: '🚶‍♀️'
      },
      {
        title: 'Light Stretching',
        duration: '10-15 mins',
        description: 'Focus on lower back and hips to relieve common period discomfort.',
        icon: '🤸‍♀️'
      }
    ]
  },
  [PHASES.FOLLICULAR]: {
    intensity: 'Medium to High',
    focus: 'Cardio & Strength',
    description: 'Estrogen is rising, giving you a boost in energy. It’s a great time to try new things and push harder.',
    exercises: [
      {
        title: 'HIIT Workout',
        duration: '20-30 mins',
        description: 'High-Intensity Interval Training to take advantage of your rising energy levels.',
        icon: '🔥'
      },
      {
        title: 'Dance Cardio',
        duration: '30-45 mins',
        description: 'Fun, upbeat movement to match your creative and social energy.',
        icon: '💃'
      },
      {
        title: 'Strength Training',
        duration: '45 mins',
        description: 'Focus on building lean muscle mass as your body is primed for gains.',
        icon: '🏋️‍♀️'
      }
    ]
  },
  [PHASES.OVULATION]: {
    intensity: 'High',
    focus: 'Peak Performance',
    description: 'Your energy is at its peak! You can handle intense workouts and hit personal bests.',
    exercises: [
      {
        title: 'Spinning / Cycling',
        duration: '45 mins',
        description: 'High-energy cardiovascular workout to burn off excess energy.',
        icon: '🚲'
      },
      {
        title: 'Kickboxing',
        duration: '30-45 mins',
        description: 'Intense full-body workout that improves coordination and strength.',
        icon: '🥊'
      },
      {
        title: 'Power Yoga',
        duration: '60 mins',
        description: 'Dynamic, fast-paced yoga flow to build strength and endurance.',
        icon: '🧘'
      }
    ]
  },
  [PHASES.LUTEAL]: {
    intensity: 'Medium to Low',
    focus: 'Endurance & Stability',
    description: 'Energy starts to wind down. Focus on steady-state cardio and refining technique.',
    exercises: [
      {
        title: 'Pilates',
        duration: '30-45 mins',
        description: 'Low-impact muscle strengthening focused on core stability and posture.',
        icon: '💪'
      },
      {
        title: 'Swimming',
        duration: '30 mins',
        description: 'Gentle resistant cardio that is easy on the joints and cooling for the body.',
        icon: '🏊‍♀️'
      },
      {
        title: 'Barre',
        duration: '45 mins',
        description: 'Ballet-inspired workout focusing on small, pulsing movements.',
        icon: '🩰'
      }
    ]
  }
}

export default function Exercises({ cycleData }) {
  const [phaseData, setPhaseData] = useState(null)

  useEffect(() => {
    if (cycleData) {
      const cycleDay = calculateCycleDay(
        cycleData.lastPeriodStart,
        cycleData.cycleLength
      )
      const phase = calculatePhase(
        cycleDay,
        cycleData.cycleLength,
        cycleData.periodDuration
      )

      setPhaseData({
        phase,
        name: getPhaseName(phase),
        recommendations: EXERCISE_RECOMMENDATIONS[phase] || EXERCISE_RECOMMENDATIONS[PHASES.MENSTRUAL]
      })
    }
  }, [cycleData])

  if (!cycleData) {
    return (
      <div className="exercises-page">
        <div className="exercises-header">
          <h1>Cycle-Synced Workouts</h1>
          <p className="subtitle">Move your body in harmony with your cycle</p>
        </div>
        <div className="no-data-placeholder">
          <h2>No Cycle Data Found</h2>
          <p>Please set up your cycle information to get personalized workout recommendations.</p>
          <Link to="/" className="btn btn-primary">Go to Setup</Link>
        </div>
      </div>
    )
  }

  if (!phaseData) return <div className="loading">Loading workout plan...</div>

  const { name, recommendations } = phaseData

  return (
    <div className="exercises-page">
      <div className="exercises-header">
        <h1>Cycle-Synced Workouts</h1>
        <p className="subtitle">Optimize your fitness by training with your cycle</p>
      </div>

      <div className="phase-summary">
        <div className="phase-info">
          <h2>{name} Phase</h2>
          <p>{recommendations.description}</p>
        </div>
        <div className="intensity-badge">
          Intensity: {recommendations.intensity}
        </div>
      </div>

      <div className="exercises-grid">
        {recommendations.exercises.map((exercise, index) => (
          <div
            key={index}
            className="exercise-card"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <div className="card-header">
              <h3>{exercise.title}</h3>
              <span className="exercise-icon">{exercise.icon}</span>
            </div>
            <div className="card-content">
              <p>{exercise.description}</p>
              <div className="exercise-details">
                <div className="detail-item">
                  <span>⏱️</span>
                  <span>{exercise.duration}</span>
                </div>
                <div className="detail-item">
                  <span>🎯</span>
                  <span>{recommendations.focus}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
