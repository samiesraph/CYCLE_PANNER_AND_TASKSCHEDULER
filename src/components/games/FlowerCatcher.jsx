import React, { useState, useEffect, useRef } from 'react'
import './FlowerCatcher.css'

export default function FlowerCatcher() {
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [basketPosition, setBasketPosition] = useState(50) // Percentage from left
  const [flowers, setFlowers] = useState([])
  const [missedFlowers, setMissedFlowers] = useState(0)
  const gameAreaRef = useRef(null)
  const animationFrameRef = useRef(null)
  const lastTimeRef = useRef(0)

  const FLOWER_TYPES = ['🌸', '🌺', '🌼', '🌷', '🌻', '🌹']
  const FALL_SPEED = 2
  const SPAWN_RATE = 1000 // milliseconds

  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      const gameLoop = (currentTime) => {
        if (currentTime - lastTimeRef.current >= 16) { // ~60fps
          updateGame()
          lastTimeRef.current = currentTime
        }
        animationFrameRef.current = requestAnimationFrame(gameLoop)
      }
      animationFrameRef.current = requestAnimationFrame(gameLoop)

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }
  }, [gameStarted, gameOver, isPaused, flowers, basketPosition])

  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      const spawnInterval = setInterval(() => {
        spawnFlower()
      }, SPAWN_RATE)

      return () => clearInterval(spawnInterval)
    }
  }, [gameStarted, gameOver, isPaused])

  const spawnFlower = () => {
    const newFlower = {
      id: Date.now() + Math.random(),
      type: FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)],
      x: Math.random() * 90 + 5, // 5% to 95% from left
      y: -5, // Start above the screen
      speed: FALL_SPEED + Math.random() * 1
    }
    setFlowers(prev => [...prev, newFlower])
  }

  const updateGame = () => {
    setFlowers(prev => {
      const updated = prev.map(flower => ({
        ...flower,
        y: flower.y + flower.speed
      }))

      // Check for catches
      const basketLeft = basketPosition - 5
      const basketRight = basketPosition + 5
      const basketTop = 85 // Near bottom of screen

      const caught = updated.filter(flower => {
        if (flower.y >= basketTop && flower.y <= basketTop + 5) {
          if (flower.x >= basketLeft && flower.x <= basketRight) {
            setScore(prev => prev + 10)
            return false // Remove caught flower
          }
        }
        return true
      })

      // Check for missed flowers
      const missed = caught.filter(flower => flower.y > 95)
      if (missed.length > 0) {
        setMissedFlowers(prev => {
          const newMissed = prev + missed.length
          if (newMissed >= 10) {
            setLives(prev => {
              const newLives = prev - 1
              if (newLives <= 0) {
                setGameOver(true)
              }
              return newLives
            })
            return 0
          }
          return newMissed
        })
      }

      return caught.filter(flower => flower.y <= 95)
    })
  }

  const handleMouseMove = (e) => {
    if (!gameAreaRef.current || !gameStarted || gameOver || isPaused) return

    const rect = gameAreaRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    setBasketPosition(Math.max(5, Math.min(95, x)))
  }

  const handleTouchMove = (e) => {
    if (!gameAreaRef.current || !gameStarted || gameOver || isPaused) return

    const touch = e.touches[0]
    const rect = gameAreaRef.current.getBoundingClientRect()
    const x = ((touch.clientX - rect.left) / rect.width) * 100
    setBasketPosition(Math.max(5, Math.min(95, x)))
  }

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    setLives(3)
    setFlowers([])
    setMissedFlowers(0)
    setBasketPosition(50)
    setIsPaused(false)
  }

  const togglePause = () => {
    setIsPaused(prev => !prev)
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameOver(false)
    setScore(0)
    setLives(3)
    setFlowers([])
    setMissedFlowers(0)
    setBasketPosition(50)
    setIsPaused(false)
  }

  return (
    <div className="flower-catcher">
      <div className="game-info">
        <h2>🌸 Flower Catcher</h2>
        <p>Catch the falling sakura flowers with your basket! Move your mouse or finger to guide the basket.</p>
      </div>

      {!gameStarted ? (
        <div className="start-screen">
          <div className="start-content">
            <h3>🌸 Welcome to Flower Catcher 🌸</h3>
            <p>Catch as many beautiful flowers as you can!</p>
            <div className="game-rules">
              <h4>How to Play:</h4>
              <ul>
                <li>Move your mouse or finger to control the basket</li>
                <li>Catch falling flowers to earn points</li>
                <li>Each flower caught = 10 points</li>
                <li>You have 3 lives</li>
                <li>Lose a life if 10 flowers fall past you</li>
                <li>Relax and enjoy the peaceful experience!</li>
              </ul>
            </div>
            <button className="btn btn-primary" onClick={startGame}>
              Start Game 🌸
            </button>
          </div>
        </div>
      ) : gameOver ? (
        <div className="game-over-screen">
          <div className="game-over-content">
            <h3>🌸 Game Over 🌸</h3>
            <div className="final-score">
              <p>Final Score</p>
              <h2>{score}</h2>
            </div>
            <div className="game-over-buttons">
              <button className="btn btn-primary" onClick={startGame}>
                Play Again
              </button>
              <button className="btn btn-secondary" onClick={resetGame}>
                Main Menu
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="game-stats">
            <div className="stat-item">
              <span className="stat-label">Score</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Lives</span>
              <span className="stat-value lives">{'❤️'.repeat(lives)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Missed</span>
              <span className="stat-value">{missedFlowers}/10</span>
            </div>
            <button className="btn btn-small pause-btn" onClick={togglePause}>
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
          </div>

          {isPaused && (
            <div className="pause-overlay">
              <div className="pause-content">
                <h3>⏸️ Game Paused</h3>
                <button className="btn btn-primary" onClick={togglePause}>
                  Resume
                </button>
              </div>
            </div>
          )}

          <div
            className="game-area"
            ref={gameAreaRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {flowers.map(flower => (
              <div
                key={flower.id}
                className="falling-flower"
                style={{
                  left: `${flower.x}%`,
                  top: `${flower.y}%`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              >
                {flower.type}
              </div>
            ))}

            <div
              className="basket"
              style={{ left: `${basketPosition}%` }}
            >
              🧺
            </div>

            <div className="ground"></div>
          </div>

          <div className="game-instructions">
            <p>💡 Move your mouse or finger to catch the flowers. Take your time and relax!</p>
          </div>
        </>
      )}
    </div>
  )
}