import Simulation from "./sim/simulation.js";
import {AgentState} from "./sim/state.js";
import SimulationLogEntry from "./sim/log.js";

const LOG_UPDATE_TIME = 100;

export default class Controller {
    constructor(state, renderer, logRenderer) {
        this.state = state;
        this.renderer = renderer;
        this.logRenderer = logRenderer;
        this.lastTimestamp = 0;
        this.step = this.step.bind(this);
    }

    runSimulation() {
        this.simulation = new Simulation(this.state);
        this.simulation.init(10000);
        window.requestAnimationFrame(this.step);
    }

    step(timestamp) {
        this.simulation.step(10000);
        if (timestamp - this.lastTimestamp > LOG_UPDATE_TIME) {
            this.lastTimestamp = timestamp;
            this._addAndRenderLogEntry();
        }
        this.renderer.render();
        window.requestAnimationFrame(this.step);
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