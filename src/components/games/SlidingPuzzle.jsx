import React, { useState, useEffect } from 'react'
import './SlidingPuzzle.css'

export default function SlidingPuzzle() {
  const [tiles, setTiles] = useState([])
  const [emptyTile, setEmptyTile] = useState(15) // Position of empty tile (0-15)
  const [isComplete, setIsComplete] = useState(false)
  const [moves, setMoves] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  const GRID_SIZE = 4
  const TOTAL_TILES = GRID_SIZE * GRID_SIZE

  // Timer effect
  useEffect(() => {
    let interval
    if (startTime && !isComplete) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [startTime, isComplete])

  // Initialize puzzle
  const initializePuzzle = () => {
    // Create array of numbers 1-15, with 16 being empty
    const initialTiles = Array.from({ length: TOTAL_TILES }, (_, i) => i + 1)
    initialTiles[TOTAL_TILES - 1] = 0 // Empty tile

    setTiles(initialTiles)
    setEmptyTile(TOTAL_TILES - 1)
    setIsComplete(false)
    setMoves(0)
    setStartTime(null)
    setElapsedTime(0)
  }

  // Shuffle the puzzle
  const shufflePuzzle = () => {
    const shuffled = [...tiles]

    // Perform random valid moves to ensure solvability
    for (let i = 0; i < 1000; i++) {
      const validMoves = getValidMoves(shuffled.indexOf(0))
      if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
        const emptyIndex = shuffled.indexOf(0)
        ;[shuffled[emptyIndex], shuffled[randomMove]] = [shuffled[randomMove], shuffled[emptyIndex]]
      }
    }

    setTiles(shuffled)
    setEmptyTile(shuffled.indexOf(0))
    setIsComplete(false)
    setMoves(0)
    setStartTime(Date.now())
    setElapsedTime(0)
  }

  // Get valid moves for a tile position
  const getValidMoves = (emptyPos) => {
    const validMoves = []
    const row = Math.floor(emptyPos / GRID_SIZE)
    const col = emptyPos % GRID_SIZE

    // Check up
    if (row > 0) {
      validMoves.push(emptyPos - GRID_SIZE)
    }

    // Check down
    if (row < GRID_SIZE - 1) {
      validMoves.push(emptyPos + GRID_SIZE)
    }

    // Check left
    if (col > 0) {
      validMoves.push(emptyPos - 1)
    }

    // Check right
    if (col < GRID_SIZE - 1) {
      validMoves.push(emptyPos + 1)
    }

    return validMoves
  }

  // Handle tile click
  const handleTileClick = (tileIndex) => {
    if (isComplete) return

    const emptyIndex = tiles.indexOf(0)

    // Check if this tile can move (adjacent to empty space)
    if (getValidMoves(emptyIndex).includes(tileIndex)) {
      const newTiles = [...tiles]
      ;[newTiles[emptyIndex], newTiles[tileIndex]] = [newTiles[tileIndex], newTiles[emptyIndex]]

      setTiles(newTiles)
      setEmptyTile(tileIndex)
      setMoves(prev => prev + 1)

      // Start timer on first move
      if (!startTime) {
        setStartTime(Date.now())
      }

      // Check if puzzle is solved
      if (isPuzzleSolved(newTiles)) {
        setIsComplete(true)
      }
    }
  }

  // Check if puzzle is solved
  const isPuzzleSolved = (tileArray) => {
    for (let i = 0; i < TOTAL_TILES - 1; i++) {
      if (tileArray[i] !== i + 1) {
        return false
      }
    }
    return tileArray[TOTAL_TILES - 1] === 0 // Last tile should be empty
  }

  // Get tile background position for sakura image
  const getTileBackground = (tileNumber) => {
    if (tileNumber === 0) return 'transparent'

    const tileIndex = tileNumber - 1
    const row = Math.floor(tileIndex / GRID_SIZE)
    const col = tileIndex % GRID_SIZE

    // Calculate background position (each tile is 25% of the image)
    const x = -(col * 25)
    const y = -(row * 25)

    return `url('/sakura-puzzle.jpg') ${x}% ${y}%`
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    initializePuzzle()
  }, [])

  if (isComplete) {
    return (
      <div className="sliding-puzzle">
        <div className="completion-screen">
          <div className="completion-content">
            <h2>🎉 Congratulations!</h2>
            <p>You solved the Sakura Sliding Puzzle!</p>
            <div className="completion-stats">
              <div className="stat">
                <span className="stat-label">Moves:</span>
                <span className="stat-value">{moves}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Time:</span>
                <span className="stat-value">{formatTime(elapsedTime)}</span>
              </div>
            </div>
            <button className="btn" onClick={shufflePuzzle}>
              Play Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sliding-puzzle">
      <div className="game-info">
        <h2>🧩 Sakura Sliding Puzzle</h2>
        <p>Slide the tiles to reveal the beautiful sakura blossom. Click adjacent tiles to move them into the empty space.</p>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Moves:</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time:</span>
            <span className="stat-value">{formatTime(elapsedTime)}</span>
          </div>
          <button className="btn btn-small" onClick={shufflePuzzle}>
            Shuffle
          </button>
        </div>
      </div>

      <div className="puzzle-container">
        <div className="puzzle-board">
          {tiles.map((tile, index) => (
            <div
              key={index}
              className={`puzzle-tile ${tile === 0 ? 'empty' : ''} ${getValidMoves(tiles.indexOf(0)).includes(index) ? 'movable' : ''}`}
              onClick={() => handleTileClick(index)}
              style={{
                background: getTileBackground(tile),
                backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`
              }}
            >
              {tile !== 0 && (
                <div className="tile-number">{tile}</div>
              )}
            </div>
          ))}
        </div>

        <div className="puzzle-preview">
          <h3>Goal:</h3>
          <div className="preview-board">
            {Array.from({ length: TOTAL_TILES }, (_, i) => i + 1).map((num, index) => (
              <div
                key={index}
                className="preview-tile"
                style={{
                  background: getTileBackground(num === TOTAL_TILES ? 0 : num),
                  backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`
                }}
              >
                {num !== TOTAL_TILES && (
                  <div className="tile-number">{num}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="game-instructions">
        <h3>How to Play:</h3>
        <ul>
          <li>Click on tiles adjacent to the empty space to move them</li>
          <li>The goal is to arrange the tiles to form the complete sakura image</li>
          <li>Numbers 1-15 should be in order, with the empty space at the bottom right</li>
          <li>The preview on the right shows what the completed puzzle should look like</li>
        </ul>
      </div>
    </div>
  )
}