'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useState } from 'react';
import "./tetris.css";
import { clr, Tetromino } from './Tetramino';
import TetrisPreview from './TetraPreview';
import TetrisStat, { Statistics } from './TetraStat';

export const SIZE = { X: 10, Y: 25 };

export const CELL = 22;
export const OUT_CELL = 24;

export const board = new Array(SIZE.Y);
for (let i = 0; i < SIZE.Y; i++) {
    board[i] =  Array(SIZE.X).fill(0); // clr[0] - background color
}
let falling: Tetromino| undefined  = Tetromino.getNext();
let next: Tetromino = Tetromino.getNext();
let fastDropping = false;
const speeds = [700, 500, 400, 300, 200, 100, 70];

const counts: Statistics = new Statistics();

export default function TetrisCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dropTimer = useRef<NodeJS.Timeout | undefined>(undefined);
    const [,setState] = useState<number|undefined>(falling?.top); 

    const downHandler = (e: KeyboardEvent) => {
        const context = canvasRef?.current?.getContext('2d');
        if (context && falling) {
            if (e.key === "ArrowLeft") {
                falling.moveAndPaint(context, pt => { return { x: pt.x - 1, y: pt.y }; });
            } else if (e.key === "ArrowRight") {
                falling.moveAndPaint(context, pt => { return { x: pt.x + 1, y: pt.y }; });
            } else if (e.key === "ArrowUp") {
                falling.rotateAndPaint(context);
            } else if (e.key === "ArrowDown") {
                if (!fastDropping) {
                    fastDropping = true;
                    killDropTimer();
                    nextDrop(counts);
                }
                return;
            } 
            killDropTimer();
            if (e.key !== "p") {
                setDropTimer();
            }
        }
    }

    const upHandler = (e: KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            fastDropping = false;
        }
    }

    const drawBoard = (first?: Tetromino) => {
        const context = canvasRef.current?.getContext('2d');
        if (context) {
            for (let i = 0; i < SIZE.Y; i++) {
                for (let j = 0; j < SIZE.X; j++) {
                    context.fillStyle = clr[board[i][j]];
                    context.fillRect(j * OUT_CELL, i * OUT_CELL, CELL, CELL);
                }
            }
            first?.moveAndPaint(context);
        }
    }

    const killDropTimer = () => { if(dropTimer.current) clearTimeout(dropTimer.current); };
    const setDropTimer = () => { dropTimer.current = setTimeout(() => nextDrop(counts), fastDropping ? 50 : speeds[counts.level-1]) };
    
    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);
        window.addEventListener("focus", setDropTimer);
        window.addEventListener("blur", killDropTimer);
        drawBoard(falling);
        return () => { // Remove event listeners on cleanup
            window.removeEventListener("focus", setDropTimer);
            window.removeEventListener("blur", killDropTimer);
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount

    const tryEliminateRow = async (context: CanvasRenderingContext2D, rowToGo: number): Promise<number> => {
        if (board[rowToGo].includes(0)) return rowToGo - 1;
        return new Promise<number>((resolve) => {
            let start: number;
            let animationStep = 1;
            const doStep = (time: number) => {
                start = start || time;
                const elapsed = time - start;
                if (2 * animationStep >= CELL ) {
                    for (let j = rowToGo; j > 0; j--) board[j] = board[j - 1];
                    board[0] = Array(SIZE.X).fill(0);
                    drawBoard();
                    resolve(rowToGo);
                    return;
                }else if (elapsed * 0.01 > animationStep) {
                    animationStep++;
                    for (let j = 0; j <= SIZE.X; j++) {
                        context.clearRect(j * OUT_CELL - animationStep,  rowToGo * OUT_CELL, 2 * animationStep , CELL);
                    }
                }
                requestAnimationFrame(doStep);
            };
            requestAnimationFrame(doStep);
        });
    } 

    const nextDrop = async (counts: Statistics) => {
        const context = canvasRef?.current?.getContext('2d');
        if (context) {
            if (falling && !falling.moveAndPaint(context, pt => { return { x: pt.x, y: pt.y + 1 }; })) {
                falling.land();
                counts.itemsCount[falling.colorIdx]++;
                falling = undefined;
                counts.totalItems++;
                if (counts.totalItems > counts.level * 50 && counts.level < speeds.length) counts.level++;
                let deletedRowCount = 0;
                for (let rowToGo = SIZE.Y - 1; rowToGo > 0;) {
                    const oldRowNo = rowToGo;
                    rowToGo = await tryEliminateRow(context, rowToGo);
                    if (oldRowNo === rowToGo) deletedRowCount++;
                }
                if (deletedRowCount > 0) {
                    counts.totalRows += deletedRowCount;
                    counts.xRows[deletedRowCount]++;
                }
                falling = next;
                next = Tetromino.getNext();
                fastDropping = false;
                falling.moveAndPaint(context);
            }
            setState(falling?.top);
        }
    }

    useEffect(() => {
        setDropTimer();
        return () => { killDropTimer(); }
    }, [falling?.top]); 

    return <div className="cnvs">
        <TetrisPreview next={next}/>
        <canvas ref={canvasRef} width={SIZE.X * OUT_CELL} height={SIZE.Y * OUT_CELL} />
        <TetrisStat counts ={ counts } />
    </div>;
}
