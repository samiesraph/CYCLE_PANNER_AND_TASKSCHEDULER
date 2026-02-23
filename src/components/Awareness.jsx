import React, { useState, useEffect } from 'react'
import {
  calculateCycleDay,
  calculatePhase,
  predictMood,
  predictEnergy,
  getPhaseName,
  getPhaseDescription,
  PHASES
} from '../utils/cycleCalculator'
import { getWellnessAdvice } from '../utils/wellnessAdvice'
import { predictEnergyML, predictMoodML } from '../utils/mlService'
import './Awareness.css'

export default function Awareness({ cycleData }) {
  const [currentPhase, setCurrentPhase] = useState(PHASES.MENSTRUAL)
  const [predictions, setPredictions] = useState(null)
  const [selectedInfoTab, setSelectedInfoTab] = useState('overview')
  const [expandedSections, setExpandedSections] = useState({})

  useEffect(() => {
    if (cycleData) {
      calculateCurrentPhase()
      loadPredictions()
    }
  }, [cycleData])

  const calculateCurrentPhase = () => {
    if (!cycleData) return

    const cycleDay = calculateCycleDay(cycleData.lastPeriodStart, cycleData.cycleLength)
    const phase = calculatePhase(cycleDay, cycleData.cycleLength, cycleData.periodDuration)
    setCurrentPhase(phase)
  }

  const loadPredictions = async () => {
    if (!cycleData) return

    const cycleDay = calculateCycleDay(cycleData.lastPeriodStart, cycleData.cycleLength)
    const phase = calculatePhase(cycleDay, cycleData.cycleLength, cycleData.periodDuration)

    // Use ML predictions if available, fallback to rule-based
    const mood = await predictMoodML(phase, cycleData.symptoms)
    const energy = await predictEnergyML(phase, cycleData.symptoms, {
      age: cycleData.age,
      menopause: cycleData.menopause || 0,
      sleepHours: cycleData.sleepHours || 8,
      currentMood: cycleData.currentMood || 'neutral',
      stress: cycleData.stress || 3,
      activity: cycleData.activity || 2
    })

    setPredictions({
      phase,
      phaseName: getPhaseName(phase),
      phaseDescription: getPhaseDescription(phase),
      mood,
      energy,
      cycleDay,
      wellnessAdvice: getWellnessAdvice(phase)
    })
  }

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const getPhaseColor = (phase) => {
    const colors = {
      [PHASES.MENSTRUAL]: 'var(--sakura-pink-dark)',
      [PHASES.FOLLICULAR]: 'var(--sakura-pink)',
      [PHASES.OVULATION]: 'var(--sakura-purple)',
      [PHASES.LUTEAL]: 'var(--sakura-purple-light)'
    }
    return colors[phase] || 'var(--sakura-pink)'
  }

  const generalInformation = {
    overview: {
      title: "Understanding Your Menstrual Cycle",
      content: "Your menstrual cycle is a natural, monthly process that prepares your body for potential pregnancy. It's divided into four main phases, each with unique hormonal changes and physical experiences. Understanding these phases can help you optimize your health, productivity, and well-being.",
      keyPoints: [
        "Average cycle length: 28 days (ranges from 21-35 days)",
        "Cycle is counted from the first day of your period",
        "Hormones fluctuate throughout the cycle",
        "Each phase brings different physical and emotional experiences"
      ]
    },
    hormones: {
      title: "Hormonal Changes Throughout the Cycle",
      content: "Your menstrual cycle is regulated by complex hormonal interactions. Estrogen and progesterone levels rise and fall, affecting everything from energy levels to mood and physical symptoms.",
      phases: [
        {
          phase: "Menstrual Phase",
          hormones: "Estrogen and progesterone at their lowest",
          effects: "Uterine lining sheds, creating menstrual flow"
        },
        {
          phase: "Follicular Phase",
          hormones: "Estrogen begins to rise, FSH stimulates follicle growth",
          effects: "Body prepares for potential pregnancy, energy increases"
        },
        {
          phase: "Ovulation Phase",
          hormones: "LH surge triggers ovulation, estrogen peaks",
          effects: "Egg is released, fertility at its highest"
        },
        {
          phase: "Luteal Phase",
          hormones: "Progesterone rises, then drops if no pregnancy occurs",
          effects: "Uterus prepares for implantation, PMS symptoms may occur"
        }
      ]
    },
    symptoms: {
      title: "Common Symptoms by Phase",
      content: "Each phase of your cycle can bring different physical and emotional symptoms. Tracking these can help you understand your body's patterns and prepare accordingly.",
      commonSymptoms: {
        [PHASES.MENSTRUAL]: ["Cramps", "Fatigue", "Headaches", "Back pain", "Mood changes"],
        [PHASES.FOLLICULAR]: ["Increased energy", "Improved mood", "Clearer skin", "Heightened creativity"],
        [PHASES.OVULATION]: ["Peak energy", "Enhanced senses", "Increased libido", "Heightened confidence"],
        [PHASES.LUTEAL]: ["Bloating", "Breast tenderness", "Mood swings", "Food cravings", "Fatigue"]
      }
    }
  }

  const precautions = {
    general: [
      "Track your cycle regularly to understand your patterns",
      "Consult healthcare providers for unusual symptoms",
      "Stay hydrated throughout your cycle",
      "Maintain a balanced diet with adequate nutrients",
      "Get regular exercise appropriate to your phase",
      "Prioritize sleep and stress management",
      "Use period products that work best for you",
      "Be gentle with yourself during challenging phases"
    ],
    whenToSeekHelp: [
      "Cycles shorter than 21 days or longer than 35 days consistently",
      "Extremely heavy bleeding or periods lasting more than 7 days",
      "Severe pain that interferes with daily activities",
      "Irregular bleeding between periods",
      "Signs of infection (fever, unusual discharge)",
      "Sudden changes in your cycle pattern",
      "Difficulty conceiving after 6-12 months of trying"
    ]
  }

  if (!cycleData) {
    return (
      <div className="awareness">
        <div className="container">
          <div className="setup-prompt">
            <h1>🌸 Cycle Awareness</h1>
            <p>Please set up your cycle information first to receive personalized awareness content.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="awareness">
      <div className="container">
        <div className="awareness-header">
          <h1>🌸 Menstrual Cycle Awareness</h1>
          <p className="awareness-subtitle">Understand your body, optimize your health, and thrive throughout your cycle</p>
        </div>

        {/* Current Phase Overview */}
        {predictions && (
          <div className="card current-phase-card">
            <div className="phase-header">
              <h2>Your Current Phase</h2>
              <div className="phase-badge" style={{ backgroundColor: getPhaseColor(predictions.phase) }}>
                {predictions.phaseName}
              </div>
            </div>
            <p className="phase-description">{predictions.phaseDescription}</p>
            <div className="phase-stats">
              <div className="stat-item">
                <span className="stat-label">Cycle Day</span>
                <span className="stat-value">{predictions.cycleDay}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Energy Level</span>
                <div className="energy-bar">
                  <div
                    className="energy-fill"
                    style={{ width: `${predictions.energy * 10}%` }}
                  />
                </div>
                <span className="stat-value">{predictions.energy}/10</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Mood</span>
                <span className="stat-value mood-indicator">{predictions.mood}</span>
              </div>
            </div>
          </div>
        )}

        {/* Information Tabs */}
        <div className="awareness-content">
          <div className="info-tabs">
            <button
              className={`tab-button ${selectedInfoTab === 'overview' ? 'active' : ''}`}
              onClick={() => setSelectedInfoTab('overview')}
            >
              📚 Overview
            </button>
            <button
              className={`tab-button ${selectedInfoTab === 'hormones' ? 'active' : ''}`}
              onClick={() => setSelectedInfoTab('hormones')}
            >
              🧬 Hormones
            </button>
            <button
              className={`tab-button ${selectedInfoTab === 'symptoms' ? 'active' : ''}`}
              onClick={() => setSelectedInfoTab('symptoms')}
            >
              🌡️ Symptoms
            </button>
            <button
              className={`tab-button ${selectedInfoTab === 'personalized' ? 'active' : ''}`}
              onClick={() => setSelectedInfoTab('personalized')}
            >
              💝 For You
            </button>
          </div>

          <div className="tab-content">
            {selectedInfoTab === 'overview' && (
              <div className="info-section">
                <h3>{generalInformation.overview.title}</h3>
                <p>{generalInformation.overview.content}</p>
                <div className="key-points">
                  <h4>Key Facts:</h4>
                  <ul>
                    {generalInformation.overview.keyPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {selectedInfoTab === 'hormones' && (
              <div className="info-section">
                <h3>{generalInformation.hormones.title}</h3>
                <p>{generalInformation.hormones.content}</p>
                <div className="hormone-phases">
                  {generalInformation.hormones.phases.map((phaseInfo, index) => (
                    <div key={index} className="hormone-phase-card">
                      <h4>{phaseInfo.phase}</h4>
                      <div className="hormone-details">
                        <strong>Hormones:</strong> {phaseInfo.hormones}
                      </div>
                      <div className="hormone-effects">
                        <strong>Effects:</strong> {phaseInfo.effects}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedInfoTab === 'symptoms' && (
              <div className="info-section">
                <h3>{generalInformation.symptoms.title}</h3>
                <p>{generalInformation.symptoms.content}</p>
                <div className="symptoms-grid">
                  {Object.entries(generalInformation.symptoms.commonSymptoms).map(([phase, symptoms]) => (
                    <div key={phase} className="symptom-card">
                      <h4 style={{ color: getPhaseColor(phase) }}>
                        {getPhaseName(phase)}
                      </h4>
                      <ul>
                        {symptoms.map((symptom, index) => (
                          <li key={index}>{symptom}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedInfoTab === 'personalized' && predictions && (
              <div className="personalized-section">
                <h3>💝 Personalized Wellness Plan for {predictions.phaseName}</h3>

                <div className="personalized-grid">
                  <div className="personalized-card">
                    <h4>🍎 Nutrition Recommendations</h4>
                    <ul>
                      {predictions.wellnessAdvice.nutrition.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="personalized-card">
                    <h4>💧 Hydration</h4>
                    <p>{predictions.wellnessAdvice.hydration}</p>
                  </div>

                  <div className="personalized-card">
                    <h4>🏃‍♀️ Exercise</h4>
                    <p>{predictions.wellnessAdvice.exercise}</p>
                  </div>

                  <div className="personalized-card">
                    <h4>😴 Rest & Recovery</h4>
                    <p>{predictions.wellnessAdvice.rest}</p>
                  </div>
                </div>

                <div className="current-energy-card">
                  <h4>⚡ Your Current Energy Profile</h4>
                  <div className="energy-profile">
                    <div className="profile-item">
                      <span>Energy Level:</span>
                      <div className="energy-bar">
                        <div
                          className="energy-fill"
                          style={{ width: `${predictions.energy * 10}%` }}
                        />
                      </div>
                      <span>{predictions.energy}/10</span>
                    </div>
                    <div className="profile-item">
                      <span>Mood:</span>
                      <span className="mood-badge">{predictions.mood}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Precautions Section */}
        <div className="card precautions-card">
          <h2>⚠️ Important Precautions & When to Seek Help</h2>

          <div className="precautions-grid">
            <div className="precaution-section">
              <h3>🛡️ General Precautions</h3>
              <ul>
                {precautions.general.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="precaution-section">
              <h3>🚨 When to Consult a Healthcare Provider</h3>
              <ul>
                {precautions.whenToSeekHelp.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="health-note">
            <p>
              <strong>Remember:</strong> This information is for educational purposes and general wellness guidance.
              Always consult with healthcare professionals for personalized medical advice, diagnosis, or treatment.
              Every person's experience with their menstrual cycle is unique.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}