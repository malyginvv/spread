const WIDESCREEN_WIDTH = 1200;

/**
 * Simulation environment.
 */
export default class Environment {
    constructor() {
        if (window.innerWidth >= WIDESCREEN_WIDTH) {
            this.boxWidth = 1.6;
            this.boxHeight = 1.0;
            this.canvasWidth = 800;
            this.canvasHeight = this.boxHeight * this.canvasWidth / this.boxWidth;
            this.statsCanvasWidth = 600;
            this.statsCanvasHeight = 100;
        } else {

        }
    }
}