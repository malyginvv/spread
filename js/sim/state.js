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
    constructor(particles, environment) {
        this.particles = particles;
        this.environment = environment;
        this.log = [];
    }

    addLogEntry(entry) {
        this.log.push(entry);
    }

    peekLogEntry() {
        return this.log[this.log.length - 1];
    }
}