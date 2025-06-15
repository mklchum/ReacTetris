export const SIZE = { X: 10, Y: 25 };
export const CELL = { x: 22, y: 24 };
export const OUT_CELL = { x: 24, y: 26 };

export const board = new Array(SIZE.Y);
for (let i = 0; i < SIZE.Y; i++) {
    board[i] =  Array(SIZE.X).fill(0); // clr[0] - background color
}
