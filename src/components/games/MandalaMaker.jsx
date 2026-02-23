import React, { useRef, useState, useEffect } from 'react';
import './MandalaMaker.css';

export default function MandalaMaker() {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#FF9EBF'); // Sakura pink default
    const [lineWidth, setLineWidth] = useState(2);
    const [symmetry, setSymmetry] = useState(8);
    const [ctx, setCtx] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            // Set canvas size to parent container or fixed size
            // We'll fix it for now to avoid resize complexity
            canvas.width = 600;
            canvas.height = 600;

            const context = canvas.getContext('2d');
            context.lineCap = 'round';
            context.lineJoin = 'round';
            // Fill white background
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, canvas.width, canvas.height);
            setCtx(context);
        }
    }, []);

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const startDrawing = (e) => {
        setIsDrawing(true);
        const { x, y } = getCoordinates(e);
        draw(x, y, false);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        if (ctx) ctx.beginPath(); // Reset path
    };

    const draw = (curX, curY, isMoving) => {
        if (!isDrawing && isMoving) return;
        if (!ctx) return;

        const canvas = canvasRef.current;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const x = curX - centerX;
        const y = curY - centerY;

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;

        for (let i = 0; i < symmetry; i++) {
            const angle = (Math.PI * 2 * i) / symmetry;
            const rotateX = x * Math.cos(angle) - y * Math.sin(angle);
            const rotateY = x * Math.sin(angle) + y * Math.cos(angle);

            // Draw separate strokes for better smoothness or use moveTo/lineTo if tracking previous
            // For simplicity in this "shorthand" version without tracking previous point strictly per segment:
            // We'll rely on the mouse move event frequency. A proper line needs prevX/prevY.

            // Actually, without prev coordinates, it's just dots. Let's track prev coordinates?
            // Simpler: Just draw small circles if just clicking, or lines if dragging?
            // To do smooth lines, we need prev coordinates.
            // Let's modify to assume "drawing" state has a "last position" logic if we want smooth lines.
            // But for this first pass, let's just use `ctx.lineTo`. 

            // Wait, standard canvas draw needs beginPath -> moveTo (prev) -> lineTo (curr) -> stroke.
            // We can cheat by saving the context state? No.

            // Let's refactor `draw` to be called on mouse move with PREVIOUS coords.
        }
    };

    // Refactored drawing logic
    const lastPos = useRef(null);

    const handleMouseDown = (e) => {
        const { x, y } = getCoordinates(e);
        setIsDrawing(true);
        lastPos.current = { x, y };
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;
        const { x, y } = getCoordinates(e);
        drawSymmetry(lastPos.current.x, lastPos.current.y, x, y);
        lastPos.current = { x, y };
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        lastPos.current = null;
    };

    const drawSymmetry = (x1, y1, x2, y2) => {
        if (!ctx) return;
        const canvas = canvasRef.current;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;

        for (let i = 0; i < symmetry; i++) {
            const angle = (Math.PI * 2 * i) / symmetry;

            const rX1 = (x1 - centerX) * Math.cos(angle) - (y1 - centerY) * Math.sin(angle) + centerX;
            const rY1 = (x1 - centerX) * Math.sin(angle) + (y1 - centerY) * Math.cos(angle) + centerY;

            const rX2 = (x2 - centerX) * Math.cos(angle) - (y2 - centerY) * Math.sin(angle) + centerX;
            const rY2 = (x2 - centerX) * Math.sin(angle) + (y2 - centerY) * Math.cos(angle) + centerY;

            ctx.beginPath();
            ctx.moveTo(rX1, rY1);
            ctx.lineTo(rX2, rY2);
            ctx.stroke();
        }
    };

    const clearCanvas = () => {
        if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    const downloadMandala = () => {
        const link = document.createElement('a');
        link.download = 'my-mandala.png';
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    return (
        <div className="mandala-maker-container">
            <div className="mandala-controls">
                <div className="control-group">
                    <label>Color</label>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="color-picker"
                    />
                </div>
                <div className="control-group">
                    <label>Line Width: {lineWidth}</label>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={lineWidth}
                        onChange={(e) => setLineWidth(parseInt(e.target.value))}
                    />
                </div>
                <div className="control-group">
                    <label>Symmetry: {symmetry}</label>
                    <input
                        type="range"
                        min="2"
                        max="24"
                        value={symmetry}
                        onChange={(e) => setSymmetry(parseInt(e.target.value))}
                    />
                </div>
                <div className="control-actions">
                    <button className="btn btn-secondary" onClick={clearCanvas}>Clear</button>
                    <button className="btn" onClick={downloadMandala}>Save</button>
                </div>
            </div>
            <div className="canvas-wrapper">
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="mandala-canvas"
                />
            </div>
        </div>
    );
}
