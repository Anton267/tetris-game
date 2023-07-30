export class StartStop {
    constructor(startFn, stopFn) {
        this._startFn = startFn;
        this._stopFn = stopFn;
        this._isPaused = false;
        this._startFn();
    }

    start() {
        if (this._isPaused) {
            this._startFn();
            this._isPaused = false;
        }
        return this;
    }

    stop() {
        this._isPaused = true;
        this._stopFn();
        return this;
    }

    getIsPaused() {
        return this._isPaused;
    }
}
