'use client'
import { useRef, useEffect} from 'react';
import "./tetris.css";
import { clr, Tetromino } from './Tetramino';
import { CELL, OUT_CELL } from './TetraCanvas';

const PREVIEW_SIZE = { X: 6, Y: 4 };

interface ITetrisPreviewProps {
    next: Tetromino;
}
export default function TetrisPreview({ next }: ITetrisPreviewProps ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => { 
        const context = canvasRef.current?.getContext('2d');
        if (context) {
            context.resetTransform();
            context.fillStyle = clr[0];
            for (let i = 0; i < PREVIEW_SIZE.Y; i++) {
                for (let j = 0; j < PREVIEW_SIZE.X; j++) {
                    context.fillRect(j * OUT_CELL, i * OUT_CELL, CELL, CELL);
                }
            }
            context.translate(-2 * OUT_CELL, 0);
            next.moveAndPaint(context);
        }
     }, [next]); // Empty array ensures that effect is only run on mount and unmount
    
    return <div className='preview' style={{ justifyContent: 'flex-end' }}>
        <div style={{flexGrow:"1"}}>
            <p>Use arrow keys: </p>
            <p>&uarr; - rotate</p>
            <p>&larr;, &rarr; - move</p>
            <p>&darr; - accelerate down</p>
        </div>
        <div>Preview</div>
        <canvas ref={canvasRef} width={PREVIEW_SIZE.X * OUT_CELL} height={PREVIEW_SIZE.Y * OUT_CELL} />
    </div>
}
    