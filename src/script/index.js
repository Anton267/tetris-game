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

const getStartXPos = (matrix) => Math.floor((matrix[0].length - 1) / 2);
let figureYpos = -1;
let figureXpos = getStartXPos(body);
let figures = figuresFactory();
let figure = figures[0];
let figureCount = 0;
let speed = 600;
let disableActions = false;

/** start stop */
let int;
const startFn = () => {
    int = setInterval(() => {
        draw.print({
            ctx: context,
            matrix: body,
            figure: figure,
            figureYOffset: ++figureYpos,
            figureXOffset: figureXpos,
            cb: endCb,
        });
    }, speed);
}
const stopFn = () => {
    clearInterval(int);
}
const started = new StartStop(startFn, stopFn);
started.start();
/** nextFigureCanvas */
const nextFigureCanvas = document.getElementById("nextFigureCanvas");
const nextFigureCanvasCtx = nextFigureCanvas.getContext("2d");
const drawNextFigure = () => {
    const nextFigure = figures[figureCount + 1] || figures[0];
    const nextFigureMatrix = draw.generateBody(nextFigure.getFigure().length, nextFigure.getFigure()[0].length);
    nextFigureCanvas.width = nextFigureMatrix[0].length * SIZE;
    nextFigureCanvas.height = nextFigureMatrix.length * SIZE;
    draw.print({
        ctx: nextFigureCanvasCtx,
        matrix: nextFigureMatrix,
        figure: nextFigure,
        figureYOffset: 0,
        figureXOffset: 0,
        strokeStyle: "#ececec",
        cb: () => { },
    });
}
drawNextFigure();
const scoreDiv = document.getElementById("scoreDiv");
const levelDiv = document.getElementById("levelDiv");
/** endCb */
const endCb = () => {
    figureYpos = -1;
    figureXpos = getStartXPos(body);
    figureCount++;
    if (figureCount > figures.length - 1) {
        figureCount = 0;
        figures = figuresFactory();
    }
    if (draw.isGameOver(body)) {
        draw.printEndGame(context);
        started.stop();
        body = getBody();
        draw = new Draw(SIZE, clear);
        speed = 400;
        levelDiv.innerText = draw.getLevel();
        scoreDiv.innerText = draw.getScore();
        return;
    }
    figure = figures[figureCount];
    draw.applyFigure(body);
    body = draw.getNewBody(body);
    scoreDiv.innerText = draw.getScore();
    drawNextFigure();
    if (draw.isNextLevel(11)) {
        draw.print({
            ctx: context,
            matrix: body,
            figure: figure,
            figureYOffset: figureYpos,
            figureXOffset: figureXpos,
            cb: () => { },
        });
        speed = speed - 30;
        draw.nextLevel();
        levelDiv.innerText = draw.getLevel();
        draw.printNextLevel(context, draw.getLevel());
        started.stop();
        disableActions = true;
        setTimeout(() => {
            started.start();
            disableActions = false;
        }, 1300);
    }
}

/** keyboardActions */
const keyboardActions = {
    Enter: () => {
        figure.rotateFigure();
    },
    ArrowRight: () => {
        if (
            body[figureYpos + figure.getFigureHeight()]?.[figureXpos + figure.getFigureWidth()] === 0
        ) {
            figureXpos++;
        }
    },
    ArrowLeft: () => {
        if (
            body[figureYpos + figure.getFigureHeight()]?.[figureXpos - 1] === 0
        ) {
            figureXpos--;
        }
    },
    ArrowDown: () => {
        figureYpos++;
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
        draw.print({
            ctx: context,
            matrix: body,
            figure: figure,
            figureYOffset: figureYpos,
            figureXOffset: figureXpos,
            cb: endCb,
        });
    }
});

// function print(matrix) {
//     console.log(matrix.reduce((acc, arr) => (acc += arr.join("") + "\n"), ""));
// }
