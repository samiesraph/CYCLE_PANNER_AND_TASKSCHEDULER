import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import CycleSetup from './components/CycleSetup'
import WorkScheduler from './components/WorkScheduler'
import Awareness from './components/Awareness'
import MiniGames from './components/MiniGames'
import AICompanion from './components/AICompanion'
import Navigation from './components/Navigation'
import SakuraPetals from './components/SakuraPetals'
import Exercises from './components/Exercises'
import { getCycleData, saveCycleData } from './utils/storage'
import './App.css'

import { InferenceProvider } from './context/InferenceContext'

function App() {
  const [cycleData, setCycleData] = useState(null)
  const [hasSetup, setHasSetup] = useState(false)

  useEffect(() => {
    const saved = getCycleData()
    if (saved) {
      setCycleData(saved)
      setHasSetup(true)
    }
  }, [])

  const handleCycleSetup = (data) => {
    setCycleData(data)
    saveCycleData(data)
    setHasSetup(true)
  }

  const handleCycleUpdate = (newData) => {
    const updatedData = { ...cycleData, ...newData }
    setCycleData(updatedData)
    saveCycleData(updatedData)
  }

  const handleEditCycle = () => {
    setHasSetup(false)
  }

  return (
    <Router>
      <InferenceProvider>
        <div className="app">
          <SakuraPetals />
          <Navigation />
          <Routes>
            <Route
              path="/"
              element={
                hasSetup ? (
                  <Dashboard
                    cycleData={cycleData}
                    onCycleUpdate={handleCycleUpdate}
                    onEditCycle={handleEditCycle}
                  />
                ) : (
                  <CycleSetup onSetup={handleCycleSetup} />
                )
              }
            />
            <Route
              path="/schedule"
              element={<WorkScheduler cycleData={cycleData} />}
            />
            <Route
              path="/awareness"
              element={<Awareness cycleData={cycleData} />}
            />
            <Route
              path="/exercises"
              element={<Exercises cycleData={cycleData} />}
            />
            <Route path="/games" element={<MiniGames />} />
            <Route
              path="/companion"
              element={<AICompanion cycleData={cycleData} />}
            />
          </Routes>
        </div>
      </InferenceProvider>
    </Router>
  )
}

export default App
