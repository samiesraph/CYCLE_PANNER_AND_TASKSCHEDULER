import React, { useState, useRef, useEffect } from 'react'
import './ColoringBook.css'

export default function ColoringBook() {
  const canvasRef = useRef(null)
  const [selectedColor, setSelectedColor] = useState('#FFB7D5')
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [brushSize, setBrushSize] = useState(20)

  const colors = [
    '#FFB7D5', '#FF8FC7', '#E8D5FF', '#D4A5FF', '#FFE4F0',
    '#FFF8F0', '#FFEED6', '#FFD6E8', '#FFC4D6', '#FFA8C5',
    '#E8C4FF', '#D6A5FF', '#C4A5FF', '#FFB8E8', '#FFA8D8',
    '#FFFFFF', '#F0F0F0', '#E0E0E0', '#D0D0D0', '#C0C0C0'
  ]

  const images = [
    {
      name: 'Sakura Blossom',
      path: '🌸',
      description: 'A beautiful cherry blossom flower'
    },
    {
      name: 'Sakura Branch',
      path: '🌿',
      description: 'A branch with blooming sakura flowers'
    },
    {
      name: 'Sakura Tree',
      path: '🌳',
      description: 'A full sakura tree in bloom'
    },
    {
      name: 'Sakura Petals',
      path: '🌸',
      description: 'Falling sakura petals'
    }
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = 500
    canvas.height = 500

    // Draw the outline
    drawOutline(ctx)
  }, [currentImage])

  const drawOutline = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.strokeStyle = '#8B7A8B'
    ctx.lineWidth = 3
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Draw sakura blossom outline
    const centerX = ctx.canvas.width / 2
    const centerY = ctx.canvas.height / 2
    const radius = 150

    ctx.beginPath()
    
    // Draw 5 petals in a circle
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
      const petalX = centerX + radius * Math.cos(angle)
      const petalY = centerY + radius * Math.sin(angle)
      
      if (i === 0) {
        ctx.moveTo(petalX, petalY)
      } else {
        ctx.lineTo(petalX, petalY)
      }
    }
    
    ctx.closePath()
    ctx.stroke()

    // Draw inner circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI)
    ctx.stroke()

    // Draw additional decorative elements
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
      const startX = centerX + 50 * Math.cos(angle)
      const startY = centerY + 50 * Math.sin(angle)
      const endX = centerX + 80 * Math.cos(angle)
      const endY = centerY + 80 * Math.sin(angle)
      
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
    }
    ctx.stroke()
  }

  const getMousePos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const draw = (x, y) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = selectedColor
    ctx.beginPath()
    ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI)
    ctx.fill()
  }

  const handleMouseDown = (e) => {
    setIsDrawing(true)
    const pos = getMousePos(e)
    draw(pos.x, pos.y)
  }

  const handleMouseMove = (e) => {
    if (!isDrawing) return
    const pos = getMousePos(e)
    draw(pos.x, pos.y)
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const handleTouchStart = (e) => {
    e.preventDefault()
    setIsDrawing(true)
    const touch = e.touches[0]
    const pos = getMousePos(touch)
    draw(pos.x, pos.y)
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    if (!isDrawing) return
    const touch = e.touches[0]
    const pos = getMousePos(touch)
    draw(pos.x, pos.y)
  }

  const handleTouchEnd = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawOutline(ctx)
  }

  const saveImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'sakura-coloring.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="coloring-book">
      <div className="game-info">
        <h2>🎨 Sakura Coloring Book</h2>
        <p>Relax and express your creativity by coloring beautiful sakura designs. Take your time and enjoy the peaceful process.</p>
      </div>

      <div className="coloring-container">
        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            className="coloring-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </div>

        <div className="coloring-controls">
          <div className="color-palette">
            <h3>Color Palette</h3>
            <div className="colors-grid">
              {colors.map((color, index) => (
                <button
                  key={index}
                  className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="brush-controls">
            <h3>Brush Size</h3>
            <div className="brush-slider">
              <input
                type="range"
                min="5"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="slider"
              />
              <span className="brush-size-value">{brushSize}px</span>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={clearCanvas}>
              🗑️ Clear
            </button>
            <button className="btn btn-primary" onClick={saveImage}>
              💾 Save
            </button>
          </div>

          <div className="coloring-tips">
            <h3>💡 Tips</h3>
            <ul>
              <li>Click and drag to color</li>
              <li>Try different color combinations</li>
              <li>Adjust brush size for details</li>
              <li>Take your time and relax</li>
              <li>Save your beautiful creation!</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="coloring-quotes">
        <p>"Coloring is a form of meditation. Let your creativity flow and find peace in each stroke." 🌸</p>
      </div>
    </div>
  )
}