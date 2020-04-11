import Renderer from './renderer.js'
import Particle from './sim/particle.js';
import {AgentState, SimulationState} from './sim/state.js';
import Controller from './controller.js';
import Environment from "./sim/environment.js";
import simulationParameters from "./sim/parameters.js";

const app = async () => {
    let canvas = document.getElementById('simulation');
    let context = canvas.getContext('2d');

    let particles = [];
    let infectedRate = 0.01;
    let movableRate = 0.75;
    let density = 25;
    for (let i = 1; i < density; i++) {
        for (let j = 1; j < density; j++) {
            let movable = Math.random() < movableRate;
            particles.push(new Particle(i / density, j / density,
                movable ? Math.random() * 0.03 - 0.015 : 0, movable ? Math.random() * 0.03 - 0.015 : 0,
                0.007, movable, Math.random() < infectedRate ? AgentState.SICK : AgentState.HEALTHY));
        }
    }
    simulationParameters.infectionProbability = 0.5;
    const environment = new Environment(1, 1); // unit box for now
    const state = new SimulationState(particles, environment);
    const renderer = new Renderer(canvas, context, state);
    const controller = new Controller(state, renderer);
    controller.runSimulation();
};

document.addEventListener('DOMContentLoaded', app);