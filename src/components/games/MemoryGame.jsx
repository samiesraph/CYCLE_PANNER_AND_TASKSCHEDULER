import React, { useState, useEffect } from 'react'
import './MemoryGame.css'

const EMOJIS = ['🌸', '🌺', '🌷', '🌻', '🌼', '🌹', '🌿', '🍀']

export default function MemoryGame() {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  useEffect(() => {
    startNewGame()
  }, [])

  const startNewGame = () => {
    const emojiPairs = [...EMOJIS.slice(0, 6), ...EMOJIS.slice(0, 6)]
    const shuffled = emojiPairs.sort(() => Math.random() - 0.5)
    setCards(shuffled.map((emoji, index) => ({ id: index, emoji, flipped: false })))
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameWon(false)
  }

  const handleCardClick = (cardId) => {
    if (flipped.length === 2 || matched.includes(cardId) || flipped.includes(cardId)) {
      return
    }

    const newFlipped = [...flipped, cardId]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(moves + 1)
      const [first, second] = newFlipped
      const firstCard = cards.find(c => c.id === first)
      const secondCard = cards.find(c => c.id === second)

      if (firstCard.emoji === secondCard.emoji) {
        setMatched([...matched, first, second])
        setFlipped([])
        
        if (matched.length + 2 === cards.length) {
          setTimeout(() => setGameWon(true), 500)
        }
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }

  return (
    <div className="memory-game">
      <div className="card memory-card">
        <div className="memory-header">
          <h2>🧠 Memory Game</h2>
          <div className="memory-stats">
            <span>Moves: {moves}</span>
            <button className="btn btn-small" onClick={startNewGame}>
              New Game
            </button>
          </div>
        </div>

        {gameWon && (
          <div className="memory-win">
            <h3>🎉 Congratulations!</h3>
            <p>You completed the game in {moves} moves!</p>
          </div>
        )}

        <div className="memory-grid">
          {cards.map(card => {
            const isFlipped = flipped.includes(card.id) || matched.includes(card.id)
            return (
              <div
                key={card.id}
                className={`memory-card-item ${isFlipped ? 'flipped' : ''} ${matched.includes(card.id) ? 'matched' : ''}`}
                onClick={() => handleCardClick(card.id)}
              >
                <div className="memory-card-front">🌸</div>
                <div className="memory-card-back">{card.emoji}</div>
              </div>
            )
          })}
        </div>

        <div className="memory-tips">
          <p>💡 <strong>Tip:</strong> Take your time and focus. This game helps improve memory and concentration.</p>
        </div>
      </div>
    </div>
  )
}
