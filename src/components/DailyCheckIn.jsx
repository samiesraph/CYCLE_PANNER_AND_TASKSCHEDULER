import React, { useState } from 'react'
import { saveDailyLog } from '../utils/storage'
import './DailyCheckIn.css'

export default function DailyCheckIn({ onClose, onSave, currentPhase, cycleDay, onCycleUpdate }) {
    const [mood, setMood] = useState('')
    const [energy, setEnergy] = useState(5)
    const [symptoms, setSymptoms] = useState([])
    const [notes, setNotes] = useState('')
    const [periodStarted, setPeriodStarted] = useState(false)

    const MOOD_OPTIONS = [
        { label: 'Happy', emoji: '😊', value: 'happy' },
        { label: 'Calm', emoji: '😌', value: 'calm' },
        { label: 'Sad', emoji: '😔', value: 'sad' },
        { label: 'Anxious', emoji: '😰', value: 'anxious' },
        { label: 'Irritable', emoji: '😠', value: 'irritable' }
    ]

    const SYMPTOMS_LIST = [
        'Cramps', 'Headache', 'Bloating', 'Acne',
        'Fatigue', 'Cravings', 'Back Pain', 'Insomnia',
        'Nausea', 'Breast Tenderness'
    ]

    const handleSymptomToggle = (symptom) => {
        if (symptoms.includes(symptom)) {
            setSymptoms(symptoms.filter(s => s !== symptom))
        } else {
            setSymptoms([...symptoms, symptom])
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!mood) {
            alert('Please select a mood!')
            return
        }

        const logData = {
            mood,
            energy,
            symptoms,
            notes,
            phase: currentPhase,
            cycleDay: cycleDay,
            timestamp: new Date().toISOString()
        }

        // Save with today's date as key (YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0]
        saveDailyLog(today, logData)

        if (periodStarted && onCycleUpdate) {
            const today = new Date().toISOString().split('T')[0]

            // Calculate new cycle length if previous data exists in valid format
            // Here we just accept the start date update, deeper logic could average the length
            const newData = {
                lastPeriodStart: today,
                // Optional: Recalculate cycle length based on difference if needed
            }
            onCycleUpdate(newData)
            alert('Cycle updated! Welcome to Day 1. 🌸')
        } else {
            alert('Check-in saved! 🌸')
        }

        onSave && onSave(logData)
        onClose()
    }

    return (
        <div className="daily-checkin-overlay">
            <div className="daily-checkin-modal">
                <div className="modal-header">
                    <h2>Daily Check-in 📝</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="period-toggle" style={{ fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={periodStarted}
                                onChange={(e) => setPeriodStarted(e.target.checked)}
                                style={{ width: '18px', height: '18px', accentColor: 'var(--sakura-pink)' }}
                            />
                            Period Started Today? 🩸
                        </label>
                        <button className="close-btn" onClick={onClose}>&times;</button>
                    </div>
                </div>

                <form className="checkin-form" onSubmit={handleSubmit}>
                    {/* Mood Section */}
                    <div className="form-group">
                        <h3>How are you feeling?</h3>
                        <div className="mood-options">
                            {MOOD_OPTIONS.map((option) => (
                                <div
                                    key={option.value}
                                    className={`mood-option ${mood === option.value ? 'selected' : ''}`}
                                    onClick={() => setMood(option.value)}
                                >
                                    <span className="mood-emoji">{option.emoji}</span>
                                    <span className="mood-label">{option.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Energy Section */}
                    <div className="form-group">
                        <h3>Energy Level: {energy}/10</h3>
                        <div className="energy-slider-container">
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={energy}
                                onChange={(e) => setEnergy(parseInt(e.target.value))}
                                className="energy-slider"
                            />
                            <div className="energy-values">
                                <span>Low</span>
                                <span>Medium</span>
                                <span>High</span>
                            </div>
                        </div>
                    </div>

                    {/* Symptoms Section */}
                    <div className="form-group">
                        <h3>Symptoms</h3>
                        <div className="symptoms-options">
                            {SYMPTOMS_LIST.map((symptom) => (
                                <div
                                    key={symptom}
                                    className={`symptom-tag ${symptoms.includes(symptom) ? 'selected' : ''}`}
                                    onClick={() => handleSymptomToggle(symptom)}
                                >
                                    {symptom}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="form-group">
                        <h3>Notes</h3>
                        <textarea
                            className="notes-input"
                            placeholder="Any other thoughts or feelings?"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary submit-btn">
                        Save Check-in
                    </button>
                </form>
            </div>
        </div>
    )
}
