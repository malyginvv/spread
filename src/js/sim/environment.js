const WIDESCREEN_WIDTH = 820;
const AGENT_SIM_RADIUS = 0.001;

/**
 * Simulation environment.
 */
export default class Environment {
    constructor() {
        if (window.innerWidth >= WIDESCREEN_WIDTH) {
            this.boxWidth = 1.6;
            this.boxHeight = 1.0;
            this.canvasWidth = 800;
            this.statsCanvasWidth = 600;
            this.statsCanvasHeight = 100;
        } else {
            let content = document.getElementById('content');
            let contentWidth = Math.round(parseFloat(getComputedStyle(content).width));
            this.boxWidth = 1.0;
            this.boxHeight = 1.0;
            this.canvasWidth = contentWidth;
            this.statsCanvasWidth = this.canvasWidth;
            this.statsCanvasHeight = this.canvasWidth / 6;
        }
        this.canvasHeight = Math.round(this.boxHeight * this.canvasWidth / this.boxWidth);
        let divisor;
        if (this.canvasHeight > 500) {
            divisor = 80;
        } else if (this.canvasHeight > 400) {
            divisor = 60;
        } else if (this.canvasHeight > 300) {
            divisor = 40;
        } else if (this.canvasHeight > 200) {
            divisor = 20;
        } else {
            divisor = 10;
        }
        this.agentRadius = AGENT_SIM_RADIUS * this.canvasHeight / divisor;
    }
}