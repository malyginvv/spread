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

const MIN_VELOCITY = 0.03;
const MAX_VELOCITY = 0.09;

export class SimulationState {
    constructor(environment) {
        this.particles = [];
        this.environment = environment;
        this.log = [];
    }

    initGrid() {
        this.log = [];
        this.particles = [];
        let density = 25;
        for (let i = 1; i < density; i++) {
            for (let j = 1; j < density; j++) {
                this.particles.push(new Particle(i / density, j / density,
                    0, 0, 0.007, false, AgentState.HEALTHY));
            }
        }
        this.changeIsolationRate();
        this.changeSickRate();
    }

    changeIsolationRate() {
        let isolationRate = simulationParameters.isolationRate;
        for (const particle of this.particles) {
            let movable = Math.random() > isolationRate;
            particle.movable = movable;
            // velocity in polar coordinates
            let angle = Math.random() * Math.PI * 2;
            let velocity = movable ? Math.random() * (MAX_VELOCITY - MIN_VELOCITY) + MIN_VELOCITY : 0;
            particle.velocityX = velocity * Math.cos(angle);
            particle.velocityY = velocity * Math.sin(angle);
        }
    }

    changeSickRate() {
        let sickRate = simulationParameters.sickRate;
        for (const particle of this.particles) {
            particle.state = Math.random() < sickRate ? AgentState.SICK : AgentState.HEALTHY;
        }
    }

    addLogEntry(entry) {
        this.log.push(entry);
    }

    peekLogEntry() {
        return this.log[this.log.length - 1];
    }
}