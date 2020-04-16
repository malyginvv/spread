import Simulation from "./sim/simulation.js";
import {AgentState} from "./sim/state.js";
import SimulationLogEntry from "./sim/log.js";

const SIM_LENGTH = 20000;
const LOG_UPDATE_TIME = SIM_LENGTH / 600;

export default class Controller {
    constructor(state, renderer, logRenderer, buttonRun, buttonReset) {
        this.state = state;
        this.renderer = renderer;
        this.logRenderer = logRenderer;
        this.buttonRun = buttonRun;
        this.buttonReset = buttonReset;
        this.lastTimestamp = 0;
        this.started = 0;
        this.firstRun = true;
        this.simulation = new Simulation(state);
        this._step = this._step.bind(this);
    }

    prepareSimulation() {
        this.started = 0;
        this.lastTimestamp = 0;
        this.state.initGrid();
        this.renderer.render();
        this.logRenderer.render();
    }

    runSimulation() {
        if (!this.firstRun) {
            this.prepareSimulation();
        }
        this.buttonRun.disabled = true;
        this.buttonReset.disabled = true;
        this.simulation.init(10000);
        window.requestAnimationFrame(this._step);
    }

    _step(timestamp) {
        if (!this.started) {
            this.started = timestamp;
        }

        // main loop
        this.simulation.step(10000);
        this.renderer.render();
        // update log if needed
        if (timestamp - this.lastTimestamp > LOG_UPDATE_TIME) {
            this.lastTimestamp = timestamp;
            this._addAndRenderLogEntry();
        }

        // request next frame if sim time not exceeded
        if (timestamp - this.started < SIM_LENGTH) {
            window.requestAnimationFrame(this._step);
        } else {
            this._onSimulationEnd();
        }
    }

    _onSimulationEnd() {
        this.firstRun = false;
        this.buttonRun.value = 'Повторить';
        this.buttonRun.disabled = false;
        this.buttonReset.disabled = false;
    }

    _addAndRenderLogEntry() {
        let healthy = 0;
        let sick = 0;
        let immune = 0;
        for (let particle of this.state.particles) {
            if (particle.state === AgentState.HEALTHY) {
                healthy++;
            }
            if (particle.state === AgentState.SICK) {
                sick++;
            }
            if (particle.state === AgentState.IMMUNE) {
                immune++;
            }
        }
        this.state.addLogEntry(new SimulationLogEntry(healthy, sick, immune));
        this.logRenderer.render();
    }
}