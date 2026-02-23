import React, { useState } from 'react'
import BreathingGame from './games/BreathingGame'
import MemoryGame from './games/MemoryGame'
import ColoringBook from './games/ColoringBook'
import FlowerCatcher from './games/FlowerCatcher'
import SlidingPuzzle from './games/SlidingPuzzle'
import WordSearch from './games/WordSearch'
import MandalaMaker from './games/MandalaMaker'
import BubblePop from './games/BubblePop'
import { useInference } from '../context/InferenceContext'
import { EVENTS } from '../utils/inferenceEngine'

export default function MiniGames() {
  const [activeGame, setActiveGame] = useState(null)
  const { logSignal } = useInference()

  const games = [
    { id: 'breathing', name: 'Breathing Exercise', icon: '🌬️', component: BreathingGame },
    { id: 'mandala', name: 'Mandala Maker', icon: '⚛️', component: MandalaMaker },
    { id: 'bubblepop', name: 'Bubble Pop', icon: '🫧', component: BubblePop },
    { id: 'memory', name: 'Memory Game', icon: '🧠', component: MemoryGame },
    { id: 'coloring', name: 'Coloring Book', icon: '🎨', component: ColoringBook },
    { id: 'flowercatcher', name: 'Flower Catcher', icon: '🌸', component: FlowerCatcher },
    { id: 'sliding', name: 'Sliding Puzzle', icon: '🖼️', component: SlidingPuzzle },
    { id: 'wordsearch', name: 'Word Search', icon: '🔍', component: WordSearch }
  ]

  const handleGameSelect = (gameId) => {
    setActiveGame(gameId)
    logSignal(EVENTS.GAME_PLAYED, { gameId })
  }

  const ActiveGameComponent = activeGame ? games.find(g => g.id === activeGame)?.component : null

  return (
    <div className="mini-games">
      <div className="container">
        <div className="games-header">
          <h1>🎮 Mini Games & Stress Relief</h1>
          <p>Take a break and relax with these calming activities</p>
        </div>

        {!activeGame ? (
          <div className="games-grid">
            {games.map(game => (
              <div
                key={game.id}
                className="card game-card"
                onClick={() => handleGameSelect(game.id)}
              >
                <div className="game-icon">{game.icon}</div>
                <h2>{game.name}</h2>
                <p className="game-description">
                  {game.id === 'breathing'
                    ? 'Follow the gentle sakura petals for a calming breathing exercise'
                    : game.id === 'mandala'
                      ? 'Create beautiful symmetrical patterns in this relaxing zen creative mode'
                      : game.id === 'bubblepop'
                        ? 'Pop the floating sakura bubbles for a satisfying stress-relief session'
                        : game.id === 'memory'
                          ? 'Match the sakura-themed cards to improve memory and focus'
                          : game.id === 'coloring'
                            ? 'Express your creativity and relax with beautiful sakura coloring pages'
                            : game.id === 'flowercatcher'
                              ? 'Catch falling sakura flowers in this peaceful and relaxing game'
                              : game.id === 'sliding'
                                ? 'Arrange the sakura tiles to complete the beautiful image'
                                : 'Find wellness words hidden in the letter grid'}
                </p>
                <button className="btn">Play Now</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="game-container">
            <button
              className="btn btn-secondary back-button"
              onClick={() => setActiveGame(null)}
            >
              ← Back to Games
            </button>
            {ActiveGameComponent && <ActiveGameComponent />}
          </div>
        )}

        <div className="games-note">
          <p>💝 These games are designed to help you relax and reduce stress. Take your time and enjoy the moment.</p>
        </div>
      </div>
    </div>
  )
}
