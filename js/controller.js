import Simulation from "./sim/simulation.js";
import {Renderer, StatsRenderer} from "./renderer.js";

export const SIM_LENGTH = 20000;
const DEFAULT_FPS = 60;

/**
 * Application controller.
 */
export default class Controller {
    constructor(state) {
        let canvas = document.getElementById('simulation');
        let context = canvas.getContext('2d');
        let statsCanvas = document.getElementById('simulation-log');
        let statsContext = statsCanvas.getContext('2d');
        let statHealthy = document.getElementById('stat-healthy');
        let statSick = document.getElementById('stat-sick');
        let statImmune = document.getElementById('stat-immune');
        let statDeceased = document.getElementById('stat-deceased');

        canvas.width = state.environment.canvasWidth;
        canvas.height = state.environment.canvasHeight;
        statsCanvas.width = state.environment.statsCanvasWidth;
        statsCanvas.height = state.environment.statsCanvasHeight;
        this.statsUpdateTime = SIM_LENGTH / state.environment.statsCanvasWidth;

        this.buttonRun = document.getElementById('button-run');
        this.buttonReset = document.getElementById('button-reset');

        this.state = state;
        this.renderer = new Renderer(context, state);
        this.statsRenderer = new StatsRenderer(statsContext, state, statHealthy, statSick, statImmune, statDeceased);
        this.lastTimestamp = 0;
        this.lastStatsTimestamp = 0;
        this.started = 0;
        this.ready = false;
        this.simulation = new Simulation(state, SIM_LENGTH / 1000, DEFAULT_FPS);
        this.animationFrameHandle = null;
        this.settingsController = null;
        this._step = this._step.bind(this);
        this._resetSimulation = this._resetSimulation.bind(this);
        this._onRunClick = this._onRunClick.bind(this);
        this._onResetClick = this._onResetClick.bind(this);

        this.buttonRun.addEventListener('click', this._onRunClick);
        this.buttonReset.addEventListener('click', this._onResetClick);

        this._prepareSimulation();
    }

    _prepareSimulation() {
        if (!this.ready) {
            this.state.reset();
            this.ready = true;
        }
        this.renderer.render();
        this.statsRenderer.render();
    }

    onSickRateChange() {
        this.state.updateSickRate();
        this.renderer.render();
        this.statsRenderer.render();
    }

    _runSimulation() {
        this._prepareSimulation();
        this.started = 0;
        this.lastTimestamp = 0;
        this.lastStatsTimestamp = 0;
        this.buttonRun.disabled = true;
        this.simulation.init();
        this.animationFrameHandle = window.requestAnimationFrame(this._step);
    }

    _resetSimulation() {
        if (this.animationFrameHandle) {
            window.cancelAnimationFrame(this.animationFrameHandle);
        }
        this._onSimulationEnd();
        this._prepareSimulation();
    }

    _onRunClick() {
        this.settingsController.disableControls();
        this._runSimulation();
    }

    _onResetClick() {
        this.settingsController.enableControls();
        this._resetSimulation();
    }

    _step(timestamp) {
        if (!this.started) {
            this.started = timestamp;
        }

        // update simulation FPS
        this.simulation.fps = this.lastTimestamp ? Math.round(1000 / (timestamp - this.lastTimestamp)) : DEFAULT_FPS;

        // main loop
        this.simulation.step();
        let timePassed = timestamp - this.started;
        this.renderer.render(timePassed);

        // update log if needed
        if (timestamp - this.lastStatsTimestamp > this.statsUpdateTime) {
            this.lastStatsTimestamp = this.lastStatsTimestamp ? this.lastStatsTimestamp + this.statsUpdateTime : timestamp;
            this.state.saveCurrentStat();
            this.statsRenderer.render();
        }

        if (timePassed < SIM_LENGTH) {
            // request next frame if sim time not exceeded
            this.animationFrameHandle = window.requestAnimationFrame(this._step);
        } else {
            this._onSimulationEnd();
        }

        this.lastTimestamp = timestamp;
    }

    _onSimulationEnd() {
        this.animationFrameHandle = null;
        this.buttonRun.disabled = false;
        this.ready = false;
        this.settingsController.enableControls();
    }
}