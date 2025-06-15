'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect} from 'react';
import "./tetris.css";
import { clr, Tetromino } from './Tetramino';
import { OUT_CELL } from './globals';

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
            context.scale(0.5, 0.5);
            context.fillStyle = clr[0];
            context.fillRect(0, 0, 10 * OUT_CELL.x, STAT_SIZE.Y * OUT_CELL.y);
            context.translate(-2 * OUT_CELL.x, 0);
            for (let i = 1; i <= 7; i++) {
                Tetromino.getNext(i).moveAndPaint(context);
                context.fillText("" + counts.itemsCount[i],  8.5 * OUT_CELL.x, 2.5 * OUT_CELL.y);
                context.translate(0, 4 * OUT_CELL.y);
            }
        }
    }, [counts.totalItems]); 

    return <div className='preview' style={{width: 250}}>
        <div style={{color: "yellow" }}>Statistics</div>
        <canvas ref={canvasRef} width={STAT_SIZE.X * OUT_CELL.x} height={STAT_SIZE.Y * OUT_CELL.y / 2} />
        <div style={{flexGrow:"1"}}>&nbsp;</div>
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
   