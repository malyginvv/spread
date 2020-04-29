import Simulation from "./sim/simulation.js";
import {StatsRenderer, Renderer} from "./renderer.js";

export const SIM_LENGTH = 20000;
const LOG_UPDATE_TIME = SIM_LENGTH / 600;

/**
 * Application controller.
 */
export default class Controller {
    constructor(state) {
        let canvas = document.getElementById('simulation');
        let context = canvas.getContext('2d');
        let logCanvas = document.getElementById('simulation-log');
        let logContext = logCanvas.getContext('2d');
        this.buttonRun = document.getElementById('button-run');
        this.buttonReset = document.getElementById('button-reset');

        this.state = state;
        this.renderer = new Renderer(context, state);
        this.logRenderer = new StatsRenderer(logContext, state);
        this.lastTimestamp = 0;
        this.started = 0;
        this.ready = false;
        this.simulation = new Simulation(state, SIM_LENGTH / 1000);
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
        this.logRenderer.render();
    }

    onSickRateChange() {
        this.state.updateSickRate();
        this.renderer.render();
    }

    _runSimulation() {
        this._prepareSimulation();
        this.started = 0;
        this.lastTimestamp = 0;
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

        // main loop
        this.simulation.step();
        let timePassed = timestamp - this.started;
        this.renderer.render(timePassed);

        // update log if needed
        if (timestamp - this.lastTimestamp > LOG_UPDATE_TIME) {
            this.lastTimestamp = timestamp;
            this.state.saveCurrentStats();
            this.logRenderer.render();
        }

        if (timePassed < SIM_LENGTH) {
            // request next frame if sim time not exceeded
            this.animationFrameHandle = window.requestAnimationFrame(this._step);
        } else {
            this._onSimulationEnd();
        }
    }

    _onSimulationEnd() {
        this.animationFrameHandle = null;
        this.buttonRun.disabled = false;
        this.ready = false;
        this.settingsController.enableControls();
    }
}