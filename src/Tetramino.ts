import { board, CELL, OUT_CELL, SIZE } from "./globals";

export type Point = { x: number; y: number };
const rotatePt = (p: Point) => { return { x: -p.y, y: p.x }; };
export const clr = [
    "white", // bkg - idx === 0, thus "false"
    "red",
    "forestgreen",
    "gold",
    "magenta",
    "darkturquoise",
    "blue",
    "sienna",
];

export class Tetromino {
    private color: number;
    private cells: Array<Point> = [];
    private offset: Point;

    constructor(colorIdx: number, p1: Point, p2: Point, p3: Point) {
        this.color = colorIdx;
        this.cells = [{ x: 0, y: 0 }, p1, p2, p3];
        this.offset = { x: SIZE.X % 2 ? SIZE.X / 2 : SIZE.X / 2 - 1, y: 1 };
    }

    private static positionWrong(offset: Point, cells: Point[]): boolean {
        return cells.some(cell =>
            offset.y + cell.y >= SIZE.Y ||
            offset.x + cell.x < 0 ||
            offset.x + cell.x >= SIZE.X ||
            !!board[offset.y + cell.y][offset.x + cell.x]);
    }  

    public rotateAndPaint(context: CanvasRenderingContext2D) {
        if (this.color !== 3 && this.offset.y > 0) {
            const cells: Array<Point> = [
                { x: 0, y: 0 },
                rotatePt(this.cells[1]),
                rotatePt(this.cells[2]),
                rotatePt(this.cells[3])
            ];
            if (Tetromino.positionWrong(this.offset, cells)) {
                return;
            }
            context.fillStyle = clr[0];
            this.cells.map(cell => context.fillRect((this.offset.x + cell.x) * OUT_CELL.x, (this.offset.y + cell.y) * OUT_CELL.y, CELL.x, CELL.y));
            this.cells = cells;
            context.fillStyle = clr[this.color];
            this.cells.map(cell => context.fillRect((this.offset.x + cell.x) * OUT_CELL.x, (this.offset.y + cell.y) * OUT_CELL.y, CELL.x, CELL.y));
        }
    }

    public moveAndPaint(context: CanvasRenderingContext2D, mover?: (p: Point) => Point): boolean
    {
        if (mover) {
            const newOffset = mover(this.offset);
            if (Tetromino.positionWrong(newOffset, this.cells)) {
                return false;
            }
            context.fillStyle = clr[0]; // erase
            this.cells.map(cell => context.fillRect((this.offset.x + cell.x) * OUT_CELL.x, (this.offset.y + cell.y) * OUT_CELL.y, CELL.x, CELL.y));
            this.offset = newOffset;
        }
        context.fillStyle = clr[this.color];
        this.cells.map(cell => context.fillRect((this.offset.x + cell.x) * OUT_CELL.x, (this.offset.y + cell.y) * OUT_CELL.y, CELL.x, CELL.y));
        return true;
    }

    public get top(): number { return this.offset.y; }

    public get colorIdx(): number { return this.color };

    public land() { this.cells.map(cell => { board[this.offset.y + cell.y][this.offset.x + cell.x] = this.color; }); }

    public static getNext(colorId?: number) {
        if (!colorId) {
            colorId = Math.floor(Math.random() * 7) + 1; // Math.random() !== 1, never
        }
        switch (colorId) {
            case 1:
                return new Tetromino(colorId, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 });
            case 2:
                return new Tetromino(colorId, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 });
            case 3:
                return new Tetromino(colorId, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 });
            case 4:
                return new Tetromino(colorId, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 });
            case 5:
                return new Tetromino(colorId, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 });
            case 6:
                return new Tetromino(colorId, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 });
            default:
                return new Tetromino(colorId, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 1 });
        }
    }
}
