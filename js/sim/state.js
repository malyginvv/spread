import Particle from "./particle.js";
import simulationParameters from "./parameters.js";

/**
 * Agent state.
 * @readonly
 * @enum {{color: string}}
 */
export const AgentState = Object.freeze({
    HEALTHY: {color: '#178000'},
    SICK: {color: '#806800'},
    IMMUNE: {color: '#6a0080'},
    DECEASED: {color: '#262626'},
});

export class SimulationState {
    constructor(environment) {
        this.particles = [];
        this.environment = environment;
        this.log = [];
    }

    initGrid() {
        this.log = [];
        this.particles = [];
        let infectedRate = 0.01;
        let minVelocity = 0.03;
        let maxVelocity = 0.09;
        let density = 25;
        for (let i = 1; i < density; i++) {
            for (let j = 1; j < density; j++) {
                let movable = Math.random() > simulationParameters.isolation;
                // velocity in polar coordinates
                let velocity = movable ? Math.random() * (maxVelocity - minVelocity) + minVelocity : 0;
                let angle = Math.random() * Math.PI * 2;
                this.particles.push(new Particle(i / density, j / density,
                    velocity * Math.cos(angle), velocity * Math.sin(angle),
                    0.007, movable, Math.random() < infectedRate ? AgentState.SICK : AgentState.HEALTHY));
            }
        }
    }

    addLogEntry(entry) {
        this.log.push(entry);
    }

    peekLogEntry() {
        return this.log[this.log.length - 1];
    }
}