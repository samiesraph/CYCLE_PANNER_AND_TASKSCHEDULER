import React, { useState } from 'react'
import './WellnessCard.css'

export default function WellnessCard({ wellness }) {
  const [activeTab, setActiveTab] = useState('nutrition')

  if (!wellness) return null

  const tabs = ['nutrition', 'hydration', 'exercise', 'rest']

  return (
    <div className="card wellness-card">
      <h2>💚 Wellness Guidance</h2>
      <p className="wellness-subtitle">Phase-specific advice for your body</p>
      
      <div className="wellness-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`wellness-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="wellness-content">
        {activeTab === 'nutrition' && (
          <div className="wellness-section">
            <h3>Nutrition Tips</h3>
            <ul className="wellness-list">
              {wellness.nutrition.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'hydration' && (
          <div className="wellness-section">
            <h3>Hydration</h3>
            <p className="wellness-text">{wellness.hydration}</p>
          </div>
        )}

        {activeTab === 'exercise' && (
          <div className="wellness-section">
            <h3>Exercise</h3>
            <p className="wellness-text">{wellness.exercise}</p>
          </div>
        )}

        {activeTab === 'rest' && (
          <div className="wellness-section">
            <h3>Rest & Recovery</h3>
            <p className="wellness-text">{wellness.rest}</p>
          </div>
        )}
      </div>
    </div>
  )
}
