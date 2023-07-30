export class Figure {
    constructor(figureOptions, color) {
        this._figureOptions = figureOptions;
        this._color = color;
        this._idx = 0;
        this._isApplyed = false;
    }

    rotateFigure() {
        this._idx++;
        if (this._idx > this._figureOptions.length - 1) {
            this._idx = 0;
        }
        return this.getFigure();
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
        this._isApplyed = true;
    }

    getFigureApplyStatus() {
        return this._isApplyed;
    }
}
