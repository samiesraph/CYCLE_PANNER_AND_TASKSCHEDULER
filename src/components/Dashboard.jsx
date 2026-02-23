import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearCycleData } from '../utils/storage'
import {
  calculateCycleDay,
  calculatePhase,
  predictFocus,
  getPhaseName,
  getPhaseDescription,
  analyzeHistory
} from '../utils/cycleCalculator'
import { predictEnergyML, predictMoodML, checkMLAPIHealth } from '../utils/mlService'
import { getWellnessAdvice } from '../utils/wellnessAdvice'
import { getRandomAffirmation, getRandomActivity } from '../utils/affirmations'
import MoodIndicator from './MoodIndicator'
import WellnessCard from './WellnessCard'
import DailyCheckIn from './DailyCheckIn'
import { getDailyLogs } from '../utils/storage'
import './Dashboard.css'

import { useInference } from '../context/InferenceContext'

export default function Dashboard({ cycleData, onCycleUpdate, onEditCycle }) {
  const navigate = useNavigate()
  const [predictions, setPredictions] = useState(null)
  const [wellness, setWellness] = useState(null)
  const [affirmation, setAffirmation] = useState('')
  const [activity, setActivity] = useState('')
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(true)
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [todayLog, setTodayLog] = useState(null)
  const [historyInsight, setHistoryInsight] = useState(null)

  const { getInsights, isEnabled } = useInference()
  const detectedRhythm = getInsights()

  useEffect(() => {
    async function loadPredictions() {
      if (cycleData) {
        setIsLoadingPredictions(true)

        const cycleDay = calculateCycleDay(
          cycleData.lastPeriodStart,
          cycleData.cycleLength
        )
        const phase = calculatePhase(
          cycleDay,
          cycleData.cycleLength,
          cycleData.periodDuration
        )

        // Check if ML API is available
        const mlAvailable = await checkMLAPIHealth()

        // Use ML predictions if available, otherwise fallback to rule-based
        const isMenopausal = cycleData.menopause === 1;

        const mood = await predictMoodML(phase, cycleData.symptoms, isMenopausal);
        const energy = await predictEnergyML(phase, cycleData.symptoms, {
          age: cycleData.age,
          menopause: isMenopausal ? 1 : 0,
          sleepHours: cycleData.sleepHours || 8,
          currentMood: cycleData.currentMood || 'neutral',
          stress: cycleData.stress || 3,
          activity: cycleData.activity || 2
        });
        const focus = predictFocus(phase, cycleData.symptoms)

        setPredictions({
          cycleDay,
          phase,
          phaseName: getPhaseName(phase),
          phaseDescription: getPhaseDescription(phase),
          mood,
          energy,
          focus,
          mlEnabled: mlAvailable
        })

        setWellness(getWellnessAdvice(phase))
        setAffirmation(getRandomAffirmation(mood))
        setActivity(getRandomActivity(mood))
        setIsLoadingPredictions(false)

        // Check for today's log
        const logs = getDailyLogs()
        const today = new Date().toISOString().split('T')[0]
        if (logs[today]) {
          setTodayLog(logs[today])
        }

        // Analyze history
        const insight = analyzeHistory(phase, logs)
        setHistoryInsight(insight)
      }
    }

    loadPredictions()
  }, [cycleData])

  if (!cycleData || !predictions || isLoadingPredictions) {
    return <div className="loading">Loading your cycle insights...</div>
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="header-content">
            <div>
              <h1>Your Cycle Dashboard 🌸</h1>
              <p className="welcome-text">Welcome back! Here's what your body is telling you today.</p>
            </div>
            <button
              className="btn btn-small btn-secondary"
              onClick={() => {
                if (window.confirm('Update your cycle information?')) {
                  onEditCycle()
                }
              }}
            >
              Update Cycle Info
            </button>
            <button
              className="btn btn-small btn-outline-secondary"
              onClick={() => {
                if (window.confirm('Are you sure you want to go back to setup? Your current cycle data will be cleared.')) {
                  clearCycleData()
                  navigate('/')
                  window.location.reload()
                }
              }}
            >
              ← Go to Setup
            </button>
          </div>
        </div>

        {todayLog && (
          <div className="card" style={{ marginBottom: '24px', background: 'var(--glass-bg)', borderLeft: '4px solid var(--sakura-pink)' }}>
            <h3>⚡ Daily Check-in Complete</h3>
            <p>Mood: {todayLog.mood} | Energy: {todayLog.energy}/10</p>
          </div>
        )}

        <div className="dashboard-grid">
          {/* New Smart Rhythm Card */}
          {isEnabled && (
            <div className="card rhythm-card" style={{ background: 'var(--glass-bg)', border: '1px solid var(--sakura-purple-light)' }}>
              <div className="phase-header">
                <h3>✨ Inferred Rhythm</h3>
                <span className="phase-badge" style={{ background: 'var(--sakura-purple-light)', color: 'var(--sakura-purple-dark)' }}>Live</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Based on your interactions today
              </p>
              <div className="metrics">
                <div className="metric">
                  <span className="metric-label">Detected Mood</span>
                  <div className="metric-bar">
                    <div
                      className="metric-fill"
                      style={{
                        width: `${detectedRhythm.mood.value * 10}%`,
                        background: 'linear-gradient(90deg, #E0C3FC, #8EC5FC)'
                      }}
                    />
                  </div>
                  <span className="metric-value">{detectedRhythm.mood.label}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Detected Energy</span>
                  <div className="metric-bar">
                    <div
                      className="metric-fill"
                      style={{
                        width: `${detectedRhythm.energy.value * 10}%`,
                        background: 'linear-gradient(90deg, #ffd1ff, #fad0c4)'
                      }}
                    />
                  </div>
                  <span className="metric-value">{detectedRhythm.energy.label}</span>
                </div>
              </div>
            </div>
          )}

          {/* Phase Card */}
          <div className="card phase-card">
            <div className="phase-header">
              <h2>Current Phase</h2>
              <span className="phase-badge">{predictions.phaseName}</span>
            </div>
            <p className="phase-description">{predictions.phaseDescription}</p>
            <div className="cycle-day">
              <span className="cycle-day-label">Cycle Day</span>
              <span className="cycle-day-number">{predictions.cycleDay}</span>
            </div>
          </div>

          {/* Personalized Insight Card */}
          {historyInsight && (
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(200,230,255,0.2) 100%)' }}>
              <h3>🔮 Your Personal Pattern</h3>
              <p>In your <strong>{predictions.phaseName}</strong> phase, you usually report:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                <li>Mood: <strong>{historyInsight.commonMood}</strong> ({historyInsight.logCount} logs)</li>
                <li>Avg Energy: <strong>{historyInsight.avgEnergy}/10</strong></li>
              </ul>
            </div>
          )}

          {/* Mood & Energy Card */}
          <div className="card predictions-card">
            <h2>Today's Predictions {predictions.mlEnabled && <span className="ml-indicator">🤖 ML</span>}</h2>
            <MoodIndicator mood={predictions.mood} />
            <div className="metrics">
              <div className="metric">
                <span className="metric-label">Energy</span>
                <div className="metric-bar">
                  <div
                    className="metric-fill energy-fill"
                    style={{ width: `${predictions.energy * 10}%` }}
                  />
                </div>
                <span className="metric-value">{predictions.energy}/10</span>
              </div>
              <div className="metric">
                <span className="metric-label">Focus</span>
                <div className="metric-bar">
                  <div
                    className="metric-fill focus-fill"
                    style={{ width: `${predictions.focus * 10}%` }}
                  />
                </div>
                <span className="metric-value">{predictions.focus}/10</span>
              </div>
            </div>
          </div>

          {/* Affirmation Card */}
          {predictions.mood === 'low' && (
            <div className="card affirmation-card">
              <h3>💝 Gentle Reminder</h3>
              <p className="affirmation-text">{affirmation}</p>
              <div className="activity-suggestion">
                <p className="activity-label">Suggested Activity:</p>
                <p className="activity-text">{activity}</p>
              </div>
            </div>
          )}

          {/* Wellness Card */}
          <WellnessCard wellness={wellness} />
        </div>

        <div className="disclaimer">
          <p>💡 <strong>Remember:</strong> This is wellness guidance based on general patterns, not medical advice. Always consult healthcare professionals for medical concerns.</p>
        </div>
      </div>

      <button className="checkin-trigger" onClick={() => setShowCheckIn(true)}>
        📝
        <span>Check-in</span>
      </button>

      {showCheckIn && (
        <DailyCheckIn
          onClose={() => setShowCheckIn(false)}
          onSave={(data) => {
            setTodayLog(data)
            // Re-run analysis on save to show immediate updates
            // In a real app we might refactor the analysis into a standalone effect or function
          }}
          currentPhase={predictions.phase}
          cycleDay={predictions.cycleDay}
          onCycleUpdate={onCycleUpdate}
        />
      )}
    </div>
  )
}
