import React, { useState, useEffect, useRef } from 'react';
import './BubblePop.css';

export default function BubblePop() {
    const [bubbles, setBubbles] = useState([]);
    const [score, setScore] = useState(0);
    const containerRef = useRef(null);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        // Start game loop
        const spawnBubble = () => {
            const id = Date.now() + Math.random();
            const size = Math.random() * 40 + 30; // 30-70px
            const left = Math.random() * 90; // 0-90%
            const speed = Math.random() * 1 + 0.5; // speed factor

            const newBubble = {
                id,
                x: left,
                y: 110, // Start below view
                size,
                speed,
                color: `hsl(${Math.random() * 60 + 300}, 100%, 85%)` // Pink/Purple hues
            };

            setBubbles(prev => {
                // Remove bubbles that went off screen
                const filtered = prev.filter(b => b.y > -20);
                if (filtered.length < 15) { // Max 15 bubbles
                    return [...filtered, newBubble];
                }
                return filtered;
            });
        };

        const intervalId = setInterval(spawnBubble, 800);

        // Animation loop
        const updateBubbles = () => {
            setBubbles(prev => prev.map(b => ({
                ...b,
                y: b.y - b.speed * 0.5
            })).filter(b => b.y > -20));

            animationFrameRef.current = requestAnimationFrame(updateBubbles);
        };

        animationFrameRef.current = requestAnimationFrame(updateBubbles);

        return () => {
            clearInterval(intervalId);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    const popBubble = (id, e) => {
        // Create pop effect at click coordinates (could optimize later)
        // For now, just remove logic
        setBubbles(prev => prev.filter(b => b.id !== id));
        setScore(s => s + 1);

        // Optional: Play sound or haptic
    };

    return (
        <div className="bubble-pop-game" ref={containerRef}>
            <div className="bubble-score">Pop Count: {score}</div>
            <div className="bubbles-container">
                {bubbles.map(bubble => (
                    <div
                        key={bubble.id}
                        className="bubble"
                        style={{
                            left: `${bubble.x}%`,
                            top: `${bubble.y}%`,
                            width: `${bubble.size}px`,
                            height: `${bubble.size}px`,
                            backgroundColor: bubble.color,
                            filter: `drop-shadow(0 0 10px ${bubble.color})`
                        }}
                        onClick={(e) => popBubble(bubble.id, e)}
                    />
                ))}
            </div>
            <p className="bubble-instruction">Click bubbles to pop them! 🫧</p>
        </div>
    );
}
