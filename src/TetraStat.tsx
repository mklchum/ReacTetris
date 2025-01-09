'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect} from 'react';
import "./tetris.css";
import { clr, Tetromino } from './Tetramino';
import { OUT_CELL } from './TetraCanvas';

export class Statistics {
    public totalItems = 0;
    public itemsCount: Array<number> = Array(8).fill(0);
    public totalRows: number = 0;
    public xRows: Array<number> = Array(5).fill(0);
    public level: number = 1;
}
export interface ITetrisStatProperties {
    counts: Statistics;
}
const STAT_SIZE = { X: 6, Y: 28 };
export default function TetrisStat({counts} :ITetrisStatProperties ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const context = canvasRef.current?.getContext('2d');
        if (context) {
            context.resetTransform();
            context.font = "bold 36px serif";
            context.scale(0.333, 0.333);
            context.fillStyle = clr[0];
            context.fillRect(0, 0, 10 * OUT_CELL, 28 * OUT_CELL);
            context.translate(-2 * OUT_CELL, 0);
            for (let i = 1; i <= 7; i++) {
                Tetromino.getNext(i).moveAndPaint(context);
                context.fillText("" + counts.itemsCount[i],  8.5 * OUT_CELL, 2.5 * OUT_CELL);
                context.translate(0, 4 * OUT_CELL);
            }
        }
    }, [counts.totalItems]); // Empty array ensures that effect is only run on mount and unmount

    return <div className='preview'>
        <div style={{color: "yellow" }}>Statistics</div>
        <canvas ref={canvasRef} width={STAT_SIZE.X * OUT_CELL} height={STAT_SIZE.Y * OUT_CELL / 2} />
        <div>LEVEL: {counts.level} </div> 
        <div>&nbsp;</div>
        <div>Total pieces: {counts.totalItems}</div>
        <div>Single rows eliminated: {counts.xRows[1]} </div> 
        <div>Double rows eliminated: {counts.xRows[2]} </div> 
        <div>Triple rows eliminated: {counts.xRows[3]} </div> 
        <div>Quadruple rows eliminated: {counts.xRows[4]} </div> 
        <div>Total rows eliminated: {counts.totalRows} </div> 
    </div>
}
   