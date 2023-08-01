export class Figure {
    constructor(figureOptions, color) {
        this._figureOptions = figureOptions;
        this._color = color;
        this._idx = 0;
        this._isApplied = false;
    }

    rotateFigure() {
        this._idx++;
        if (this._idx > this._figureOptions.length - 1) {
            this._idx = 0;
        }
        return this.getFigure();
    }

    getNextRotateFigure() {
        return this._figureOptions[this._idx + 1] || this._figureOptions[0];
    }

    getFigure() {
        return this._figureOptions[this._idx];
    }

    getFigureWidth() {
        return this._figureOptions[this._idx][0].length;
    }

    getFigureHeight() {
        return this._figureOptions[this._idx].length;
    }

    getFigureColor() {
        return this._color;
    }

    figureApply() {
        this._isApplied = true;
    }

    getFigureIsApply() {
        return this._isApplied;
    }

    isFigureCanMove(figure, nextFigureXpos, figureYOffset, matrix) {
        for (let i = 0; i < figure.length; i++) {
            const arr = figure[i];
            for (let j = 0; j < arr.length; j++) {
                const yOffset = i + figureYOffset;
                const xOffset = j + nextFigureXpos;
                const matrixFigure = matrix[yOffset]?.[xOffset];
                if (
                    matrixFigure === void 0 ||
                    arr[j] && matrixFigure instanceof Figure && matrixFigure.getFigureIsApply()
                ) {
                    return false;
                }
            }
        }
        return true;
    }
}
