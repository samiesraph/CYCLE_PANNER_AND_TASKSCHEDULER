import React, { useState, useEffect } from 'react'
import './WordSearch.css'

export default function WordSearch() {
  const [grid, setGrid] = useState([])
  const [words, setWords] = useState([])
  const [foundWords, setFoundWords] = useState(new Set())
  const [selectedCells, setSelectedCells] = useState([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [startCell, setStartCell] = useState(null)
  const [isComplete, setIsComplete] = useState(false)

  const GRID_SIZE = 12
  const WORD_LIST = [
    'RELAX', 'CALM', 'PEACE', 'SERENE', 'QUIET', 'REST', 'BREATHE',
    'MEDITATE', 'YOGA', 'MIND', 'BODY', 'SPIRIT', 'WELLNESS', 'HEALING',
    'BALANCE', 'HARMONY', 'TRANQUIL', 'SOOTHE', 'GENTLE', 'SOFT',
    'TENDER', 'EASE', 'COMFORT', 'ZEN', 'MINDFUL', 'AWARE', 'PRESENT'
  ]

  // Initialize the word search
  const initializeGame = () => {
    const newWords = WORD_LIST.slice(0, 8) // Use 8 words for this puzzle
    const newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(''))

    // Place words in the grid
    placeWordsInGrid(newGrid, newWords)

    // Fill remaining cells with random letters
    fillEmptyCells(newGrid)

    setGrid(newGrid)
    setWords(newWords)
    setFoundWords(new Set())
    setSelectedCells([])
    setIsSelecting(false)
    setStartCell(null)
    setIsComplete(false)
  }

  // Place words in the grid
  const placeWordsInGrid = (grid, words) => {
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal down-right
      [1, -1],  // diagonal down-left
    ]

    words.forEach(word => {
      let placed = false
      let attempts = 0

      while (!placed && attempts < 100) {
        const direction = directions[Math.floor(Math.random() * directions.length)]
        const startRow = Math.floor(Math.random() * GRID_SIZE)
        const startCol = Math.floor(Math.random() * GRID_SIZE)

        if (canPlaceWord(grid, word, startRow, startCol, direction)) {
          placeWord(grid, word, startRow, startCol, direction)
          placed = true
        }
        attempts++
      }
    })
  }

  // Check if a word can be placed at the given position
  const canPlaceWord = (grid, word, startRow, startCol, direction) => {
    const [dRow, dCol] = direction

    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * dRow
      const col = startCol + i * dCol

      if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
        return false
      }

      if (grid[row][col] !== '' && grid[row][col] !== word[i]) {
        return false
      }
    }

    return true
  }

  // Place a word in the grid
  const placeWord = (grid, word, startRow, startCol, direction) => {
    const [dRow, dCol] = direction

    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * dRow
      const col = startCol + i * dCol
      grid[row][col] = word[i]
    }
  }

  // Fill empty cells with random letters
  const fillEmptyCells = (grid) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] === '') {
          grid[row][col] = letters[Math.floor(Math.random() * letters.length)]
        }
      }
    }
  }

  // Handle mouse/touch down on cell
  const handleCellDown = (row, col) => {
    setIsSelecting(true)
    setStartCell({ row, col })
    setSelectedCells([{ row, col }])
  }

  // Handle mouse/touch enter on cell
  const handleCellEnter = (row, col) => {
    if (!isSelecting || !startCell) return

    // Calculate the path from start cell to current cell
    const path = calculatePath(startCell, { row, col })
    if (path) {
      setSelectedCells(path)
    }
  }

  // Handle mouse/touch up
  const handleCellUp = () => {
    if (!isSelecting || selectedCells.length < 2) {
      setSelectedCells([])
      setStartCell(null)
      setIsSelecting(false)
      return
    }

    // Check if selected cells form a word
    const selectedWord = selectedCells.map(cell => grid[cell.row][cell.col]).join('')

    // Check if it matches any remaining words (forward or backward)
    const reversedWord = selectedWord.split('').reverse().join('')
    const foundWord = words.find(word =>
      (word === selectedWord || word === reversedWord) && !foundWords.has(word)
    )

    if (foundWord) {
      setFoundWords(prev => new Set([...prev, foundWord]))

      // Check if all words are found
      if (foundWords.size + 1 === words.length) {
        setIsComplete(true)
      }
    }

    setSelectedCells([])
    setStartCell(null)
    setIsSelecting(false)
  }

  // Calculate straight path between two cells
  const calculatePath = (start, end) => {
    const dRow = end.row - start.row
    const dCol = end.col - start.col

    // Must be horizontal, vertical, or diagonal
    if (dRow !== 0 && dCol !== 0 && Math.abs(dRow) !== Math.abs(dCol)) {
      return null
    }

    // Normalize direction
    const stepRow = dRow === 0 ? 0 : dRow / Math.abs(dRow)
    const stepCol = dCol === 0 ? 0 : dCol / Math.abs(dCol)

    const path = []
    let currentRow = start.row
    let currentCol = start.col

    while (true) {
      path.push({ row: currentRow, col: currentCol })

      if (currentRow === end.row && currentCol === end.col) break

      currentRow += stepRow
      currentCol += stepCol
    }

    return path
  }

  // Check if a cell is in the current selection
  const isCellSelected = (row, col) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col)
  }

  // Check if a cell is part of a found word
  const isCellInFoundWord = (row, col) => {
    // This would require tracking which cells belong to which words
    // For simplicity, we'll just mark all found words' cells
    return false // TODO: Implement this properly
  }

  useEffect(() => {
    initializeGame()
  }, [])

  if (isComplete) {
    return (
      <div className="word-search">
        <div className="completion-screen">
          <div className="completion-content">
            <h2>🎉 Congratulations!</h2>
            <p>You found all the wellness words!</p>
            <p>Take a moment to appreciate your mindfulness and focus.</p>
            <button className="btn" onClick={initializeGame}>
              Play Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="word-search">
      <div className="game-info">
        <h2>🔍 Wellness Word Search</h2>
        <p>Find all the wellness and relaxation words hidden in the grid. Drag to select words horizontally, vertically, or diagonally.</p>
        <div className="progress">
          <span>Found: {foundWords.size} / {words.length}</span>
          <button className="btn btn-small" onClick={initializeGame}>
            New Puzzle
          </button>
        </div>
      </div>

      <div className="game-container">
        <div className="word-grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              {row.map((letter, colIndex) => (
                <div
                  key={colIndex}
                  className={`grid-cell ${isCellSelected(rowIndex, colIndex) ? 'selected' : ''} ${isCellInFoundWord(rowIndex, colIndex) ? 'found' : ''}`}
                  onMouseDown={() => handleCellDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleCellEnter(rowIndex, colIndex)}
                  onMouseUp={handleCellUp}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    handleCellDown(rowIndex, colIndex)
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault()
                    const touch = e.touches[0]
                    const element = document.elementFromPoint(touch.clientX, touch.clientY)
                    if (element && element.dataset.row && element.dataset.col) {
                      handleCellEnter(parseInt(element.dataset.row), parseInt(element.dataset.col))
                    }
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault()
                    handleCellUp()
                  }}
                  data-row={rowIndex}
                  data-col={colIndex}
                >
                  {letter}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="word-list">
          <h3>Find These Words:</h3>
          <div className="words-grid">
            {words.map(word => (
              <div
                key={word}
                className={`word-item ${foundWords.has(word) ? 'found' : ''}`}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="game-instructions">
        <h3>How to Play:</h3>
        <ul>
          <li>Click and drag to select letters that form words</li>
          <li>Words can be horizontal, vertical, or diagonal</li>
          <li>Words can be forward or backward</li>
          <li>Found words will be highlighted in the list</li>
          <li>Find all words to complete the puzzle</li>
        </ul>
      </div>
    </div>
  )
}