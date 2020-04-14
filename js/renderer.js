import {AgentState} from "./sim/state.js";

const END_ANGLE = Math.PI * 2;

export class Renderer {
    constructor(context, state) {
        this.context = context;
        this.state = state;
    }

    render() {
        this.context.clearRect(0, 0, 600, 600);
        for (let particle of this.state.particles) {
            let x = particle.positionX * 600;
            let y = particle.positionY * 600;
            this.context.fillStyle = particle.state.color;
            this.context.beginPath();
            this.context.arc(x, y, particle.radius * 600, 0, END_ANGLE, false);
            this.context.fill();
        }
    }

}

export class LogRenderer {
    constructor(context, state) {
        this.context = context;
        this.state = state;
    }

    render() {
        let column = this.state.log.length - 1;
        let logEntry = this.state.peekLogEntry();
        this.context.fillStyle = AgentState.HEALTHY.color;
        let healthyHeight = 40 * logEntry.healthy / logEntry.total;
        this.context.fillRect(column, 0, 1, healthyHeight);
        this.context.fillStyle = AgentState.SICK.color;
        let sickHeight = 40 * logEntry.sick / logEntry.total;
        this.context.fillRect(column, healthyHeight, 1, sickHeight);
        this.context.fillStyle = AgentState.IMMUNE.color;
        this.context.fillRect(column, healthyHeight + sickHeight, 1, 40 * logEntry.immune / logEntry.total);
    }
}