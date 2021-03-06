import Particle from './particle.js';
import simulationParameters from './parameters.js';
import SimulationStats from './stats.js';

/**
 * Agent state.
 * @readonly
 * @enum {{color: string}}
 */
export const AgentState = Object.freeze({
    HEALTHY: {color: '#85c0f9'},
    SICK: {color: '#f5793a'},
    IMMUNE: {color: '#a95aa1'},
    DECEASED: {color: '#000000'},
});

const MIN_VELOCITY = 0.03;
const MAX_VELOCITY = 0.09;
const DENSITY = 21;

/**
 * State of the simulation and stats on current run.
 */
export class SimulationState {
    constructor(environment) {
        this.particles = [];
        this.environment = environment;
        this.log = [];
    }

    /**
     * Place all agents at random points without overlapping.
     * Clear stats.
     */
    reset() {
        this.log = [];
        this.particles = [];
        let offsetLimit = 0.5 / DENSITY - this.environment.agentRadius;
        for (let i = 1; i < DENSITY * this.environment.boxWidth; i++) {
            for (let j = 1; j < DENSITY * this.environment.boxHeight; j++) {
                this.particles.push(new Particle(i / DENSITY + (Math.random() - 0.5) * offsetLimit,
                    j / DENSITY + (Math.random() - 0.5) * offsetLimit,
                    0, 0, this.environment.agentRadius, false, AgentState.HEALTHY));
            }
        }
        this.updateIsolationRate();
        this.updateSickRate();
    }

    updateIsolationRate() {
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

    updateSickRate() {
        let sickRate = simulationParameters.sickRate;
        for (const particle of this.particles) {
            particle.state = Math.random() < sickRate ? AgentState.SICK : AgentState.HEALTHY;
        }
    }

    saveCurrentStat() {
        this.log.push(this._getCurrentStat());
    }

    _getCurrentStat() {
        let healthy = 0;
        let sick = 0;
        let immune = 0;
        let deceased = 0;
        for (let particle of this.particles) {
            if (particle.state === AgentState.HEALTHY) {
                healthy++;
            }
            if (particle.state === AgentState.SICK) {
                sick++;
            }
            if (particle.state === AgentState.IMMUNE) {
                immune++;
            }
            if (particle.state === AgentState.DECEASED) {
                deceased++;
            }
        }
        return new SimulationStats(healthy, sick, immune, deceased);
    }

    getCurrentStat() {
        if (this.isStatsEmpty()) {
            return this._getCurrentStat();
        }
        return this.log[this.log.length - 1];
    }

    getCurrentStatIndex() {
        return this.log.length - 1;
    }

    isStatsEmpty() {
        return this.log.length === 0;
    }
}