import Renderer from './renderer.js'
import Particle from './sim/particle.js';
import {AgentState, SimulationState} from './sim/state.js';
import Controller from './controller.js';
import Environment from "./sim/environment.js";

const app = async () => {
    let canvas = document.getElementById('simulation');
    let context = canvas.getContext('2d');

    let particles = [];
    let infectedRate = 0.01;
    let density = 25;
    const environment = new Environment(1, 1); // unit box for now
    for (let i = 1; i < density; i++) {
        for (let j = 1; j < density; j++) {
            particles.push(new Particle(i / density, j / density,
                Math.random() * 0.03 - 0.015, Math.random() * 0.03 - 0.015,
                0.007, true, Math.random() < infectedRate ? AgentState.SICK : AgentState.HEALTHY,
                environment));
        }
    }
    const state = new SimulationState(particles);
    const renderer = new Renderer(canvas, context, state);
    const controller = new Controller(state, renderer);
    controller.runSimulation();
};

document.addEventListener('DOMContentLoaded', app);