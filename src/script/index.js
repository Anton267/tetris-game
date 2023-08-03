import { figuresFactory } from "./figures/figures.js";
import { getBody } from "./body.js";
import { Draw } from "./draw/draw.js";
import { StartStop } from "./start-stop/start-stop.js";

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
let body = getBody();
const SIZE = 20;
canvas.width = body[0].length * SIZE;
canvas.height = body.length * SIZE;
const clear = (ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
};
let draw = new Draw(SIZE, clear);
/** initial settings */
const LEVEL_COUNT = 11;
const INITIAL_SPEED = 600;
const getStartXPos = (matrix) => Math.floor((matrix[0].length - 1) / 2);
let figureYpos = -1;
let figureXpos = getStartXPos(body);
let figures = figuresFactory();
let figure = figures[0];
let figureCount = 0;
let speed = INITIAL_SPEED;
let disableActions = false;

/** nextFigureCanvas */
const nextFigureCanvas = document.getElementById("nextFigureCanvas");
const nextFigureCanvasCtx = nextFigureCanvas.getContext("2d");
const printNextFigure = () => {
    const nextFigure = figures[figureCount + 1] || figures[0];
    const nextFigureMatrix = draw.generateBody(nextFigure.getFigureHeight(), nextFigure.getFigureWidth());
    nextFigureCanvas.width = nextFigure.getFigureWidth() * SIZE;
    nextFigureCanvas.height = nextFigure.getFigureHeight() * SIZE;
    draw.printNextFigure({
        ctx: nextFigureCanvasCtx,
        matrix: nextFigureMatrix,
        figure: nextFigure,
    });
};
printNextFigure();

/** start stop */
let interval;
let isApplyFigure = false;
const scoreDiv = document.getElementById("scoreDiv");
const levelDiv = document.getElementById("levelDiv");
const applyFigure = (cb) => {
    if (isApplyFigure) {
        isApplyFigure = false;
        figure.figureApply();
        figureYpos = -1;
        figureXpos = getStartXPos(body);
        figureCount++;
        if (figureCount > figures.length - 1) {
            figureCount = 0;
            figures = figuresFactory();
        }
        figure = figures[figureCount];
        body = draw.getNewBody(body);
        scoreDiv.innerText = draw.getScore();
    }
    if (draw.isNextLevel(LEVEL_COUNT)) {
        started.stop();
        speed -= 30;
        levelDiv.innerText = draw.getLevel();
        draw.printNextLevel(context, draw.getLevel());
        disableActions = true;
        setTimeout(() => {
            started.start();
            disableActions = false;
        }, 1300);
        return;
    }
    if (cb) {
        cb();
    }
    printNextFigure();
};

const start = () => {
    if (draw.isGameOver()) {
        draw.printEndGame(context);
        started.stop();
        body = getBody();
        draw = new Draw(SIZE, clear);
        speed = INITIAL_SPEED;
        levelDiv.innerText = draw.getLevel();
        scoreDiv.innerText = draw.getScore();
        return;
    }
    const applyCb = () => {
        isApplyFigure = draw.print(
            {
                ctx: context,
                matrix: body,
                figure: figure,
                figureYOffset: ++figureYpos,
                figureXOffset: figureXpos,
            }
        )
            .isApplyFigure;
    };
    applyFigure(applyCb);

};
start();
const startFn = () => {
    interval = setInterval(start, speed);
}
const stopFn = () => {
    clearInterval(interval);
}
const started = new StartStop(startFn, stopFn);
started.start();

/** keyboardActions */
const keyboardActions = {
    ArrowUp: () => {
        const nextFigure = figure.getNextRotateFigure();
        if (
            figure.isFigureCanMove(nextFigure, figureXpos, figureYpos, body)
        ) {
            figure.rotateFigure();
            return;
        }
        const xOffset = body[0].length - nextFigure[0].length;
        if (
            figure.isFigureCanMove(nextFigure, xOffset, figureYpos, body)
        ) {
            figure.rotateFigure();
            figureXpos = body[0].length - figure.getFigureWidth();
        }
    },
    ArrowRight: () => {
        if (
            figure.isFigureCanMove(figure.getFigure(), figureXpos + 1, figureYpos, body)
        ) {
            figureXpos++;
        }
    },
    ArrowLeft: () => {
        if (
            figure.isFigureCanMove(figure.getFigure(), figureXpos - 1, figureYpos, body)
        ) {
            figureXpos--;
        }
    },
    ArrowDown: () => {
        if (
            figure.isFigureCanMove(figure.getFigure(), figureXpos, figureYpos + 1, body)
        ) {
            figureYpos++;
        }
    },
    Space: () => {
        if (started.getIsPaused()) {
            started.start();
        } else {
            started.stop();
        }
    },
    Escape: () => {
        started.start();
    },
};

document.addEventListener("keydown", (e) => {
    if (disableActions) {
        return;
    }
    const code = e.code;
    if (code in keyboardActions) {
        if (started.getIsPaused() && code !== "Space") {
            keyboardActions.Space();
        }
        keyboardActions[code]();
        isApplyFigure = draw.print(
            {
                ctx: context,
                matrix: body,
                figure: figure,
                figureYOffset: figureYpos,
                figureXOffset: figureXpos,
            }
        )
            .isApplyFigure;
        if (code === "ArrowDown") {
            applyFigure();
        }
    }
});
