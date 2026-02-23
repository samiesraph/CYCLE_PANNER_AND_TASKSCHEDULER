import React, { useEffect, useState } from 'react'
import './SakuraPetals.css'

/**
 * Floating Sakura Petals Background Animation
 */
export default function SakuraPetals() {
  const [petals, setPetals] = useState([])

  useEffect(() => {
    // Create 15 petals
    const newPetals = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 10
    }))
    setPetals(newPetals)
  }, [])

  return (
    <div className="sakura-container">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="sakura-petal"
          style={{
            left: `${petal.left}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`
          }}
        />
      ))}
    </div>
  )
}
