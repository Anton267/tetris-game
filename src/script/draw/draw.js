import { Figure } from "../figures/figure.js";

export class Draw {
    constructor(size, clearFn) {
        this._size = size;
        this._clearFn = clearFn;
        this._score = 0;
        this._level = 1;
        this._prevLevelChangeScore = 0;
    }

    print({ ctx, matrix, figure, figureYOffset, figureXOffset, strokeStyle = "grey", cb }) {
        this._clearFn(ctx);
        let isFinish = false;
        for (let i = 0; i < matrix.length; i++) {
            const arr = matrix[i];
            let prevX = 0;
            for (let j = 0; j < arr.length; j++) {
                const params = [prevX, i * this._size, this._size, this._size];
                if (this.isFigure(arr[j]) && arr[j].getFigureApplyStatus() === false) {
                    arr[j] = 0;
                }
                if (this.isFigure(arr[j])) {
                    ctx.fillStyle = arr[j].getFigureColor();
                    ctx.fillRect(...params);
                } else {
                    ctx.strokeStyle = strokeStyle;
                    ctx.strokeRect(...params);
                }
                const x = i - figureYOffset;
                const y = j - figureXOffset;
                if (x <= i && figure.getFigure()?.[x]?.[y]) {
                    if (arr[j] === 0) {
                        ctx.fillStyle = figure.getFigureColor();
                        ctx.fillRect(...params);
                        arr[j] = figure;
                        if (this.isFigure(matrix[i + 1]?.[j]) && matrix[i + 1]?.[j].getFigureApplyStatus()) {
                            isFinish = true;
                        }
                    }
                }
                prevX += this._size;
            }
        }
        if (isFinish) {
            cb();
            return;
        }
        if (figureYOffset >= (matrix.length - figure.getFigure().length)) {
            cb();
        }
    };

    applyFigure(matrix) {
        for (const arr of matrix) {
            for (let i = 0; i < arr.length; i++) {
                if (this.isFigure(arr[i])) {
                    arr[i].figureApply();
                }
            }
        }
    };

    getNewBody(matrix) {
        let deleted = new Set();
        for (let i = 0; i < matrix.length; i++) {
            const arr = matrix[i];
            if (arr.every((item) => this.isFigure(item) && item.getFigureApplyStatus())) {
                deleted.add(i);
            }
        }
        const filtered = matrix.filter((_, i) => !deleted.has(i));
        filtered.unshift(...this.generateBody(deleted.size, matrix[0].length));
        this._score += deleted.size;
        return filtered;
    };

    generateBody(height, width) {
        return [...Array(height)].map(() => [...Array(width)].map(() => 0));
    }

    getScore() {
        return this._score;
    }

    getLevel() {
        return this._level;
    }

    nextLevel() {
        this._level++;
    }

    isNextLevel(count) {
        const isNext = this.getScore() % count === 0 && this._prevLevelChangeScore !== this.getScore();
        if (isNext) {
            this._prevLevelChangeScore = this.getScore();
        }
        return isNext;
    }

    printEndGame(ctx) {
        ctx.font = "48px serif";
        ctx.fillText("Game Over", 50, 50);
        ctx.font = "26px serif";
        ctx.fillStyle = "black";
        ctx.fillText("Press ENTER to restart", 40, 100);
    }

    printNextLevel(ctx, level) {
        ctx.font = "48px serif";
        ctx.fillText(`Level ${level}`, 90, 150);
    }

    isGameOver(matrix) {
        return matrix[0].some((item => this.isFigure(item)));
    }

    isFigure(item) {
        return item instanceof Figure;
    }
}
