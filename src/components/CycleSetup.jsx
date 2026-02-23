import React, { useState } from 'react'
import './CycleSetup.css'

export default function CycleSetup({ onSetup }) {
  const [formData, setFormData] = useState({
    lastPeriodStart: '',
    cycleLength: 28,
    periodDuration: 5,
    symptoms: [],
    age: 25,
    sleepHours: 8,
    stress: 3,
    activity: 2
  })

  const symptomsList = ['cramps', 'fatigue', 'anxiety', 'headaches']

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        symptoms: checked
          ? [...prev.symptoms, name]
          : prev.symptoms.filter(s => s !== name)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) : value
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.lastPeriodStart) {
      onSetup(formData)
    }
  }

  return (
    <div className="cycle-setup">
      <div className="container">
        <div className="setup-card card">
          <div className="setup-header">
            <h1>🌸 Welcome to SakuraCycle</h1>
            <p className="subtitle">Let's personalize your wellness journey</p>
          </div>
          
          <form onSubmit={handleSubmit} className="setup-form">
            <div className="form-group">
              <label htmlFor="lastPeriodStart">
                Last Period Start Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="lastPeriodStart"
                name="lastPeriodStart"
                value={formData.lastPeriodStart}
                onChange={handleChange}
                className="input"
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cycleLength">
                Average Cycle Length (days)
              </label>
              <input
                type="number"
                id="cycleLength"
                name="cycleLength"
                value={formData.cycleLength}
                onChange={handleChange}
                className="input"
                min="21"
                max="35"
              />
              <small>Default: 28 days</small>
            </div>

            <div className="form-group">
              <label htmlFor="periodDuration">
                Average Period Duration (days)
              </label>
              <input
                type="number"
                id="periodDuration"
                name="periodDuration"
                value={formData.periodDuration}
                onChange={handleChange}
                className="input"
                min="3"
                max="7"
              />
              <small>Default: 5 days</small>
            </div>

            <div className="form-group">
              <label htmlFor="age">
                Age (optional - helps with personalized predictions)
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="input"
                min="15"
                max="60"
              />
              <small>Used for ML-powered wellness insights</small>
            </div>

            <div className="form-group">
              <label htmlFor="sleepHours">
                Average Sleep Hours per Night
              </label>
              <input
                type="number"
                id="sleepHours"
                name="sleepHours"
                value={formData.sleepHours}
                onChange={handleChange}
                className="input"
                min="4"
                max="12"
                step="0.5"
              />
              <small>Important for energy predictions</small>
            </div>

            <div className="form-group">
              <label htmlFor="stress">
                Current Stress Level (1-5)
              </label>
              <input
                type="range"
                id="stress"
                name="stress"
                value={formData.stress}
                onChange={handleChange}
                className="input slider"
                min="1"
                max="5"
              />
              <div className="slider-labels">
                <span>Low</span>
                <span className="slider-value">{formData.stress}</span>
                <span>High</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="activity">
                Activity Level (0-2)
              </label>
              <select
                id="activity"
                name="activity"
                value={formData.activity}
                onChange={handleChange}
                className="input"
              >
                <option value="0">Low - Mostly sedentary</option>
                <option value="1">Moderate - Light exercise</option>
                <option value="2">High - Regular exercise/active</option>
              </select>
            </div>

            <div className="form-group">
              <label>Common Symptoms (optional)</label>
              <div className="symptoms-grid">
                {symptomsList.map(symptom => (
                  <label key={symptom} className="checkbox-label">
                    <input
                      type="checkbox"
                      name={symptom}
                      checked={formData.symptoms.includes(symptom)}
                      onChange={handleChange}
                    />
                    <span className="checkbox-text">{symptom.charAt(0).toUpperCase() + symptom.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Start My Journey 🌸
            </button>
          </form>

          <div className="privacy-note">
            <p>💝 Your data is stored locally on your device and never shared.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
