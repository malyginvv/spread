import Simulation from "./sim/simulation.js";

export default class Controller {
    constructor(state, renderer) {
        this.state = state;
        this.renderer = renderer;
        this.step = this.step.bind(this);
    }

    runSimulation() {
        this.simulation = new Simulation(this.state);
        this.simulation.init(10000);
        window.requestAnimationFrame(this.step);
    }

    step() {
        this.simulation.step(10000);
        this.renderer.render();
        window.requestAnimationFrame(this.step);
    }

}