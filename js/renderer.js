import {AgentState} from "./sim/state.js";

const END_ANGLE = Math.PI * 2;

export class Renderer {
    constructor(context, state) {
        this.context = context;
        this.state = state;
    }

    render(time = 0) {
        this.context.clearRect(0, 0, 600, 600);
        for (let particle of this.state.particles) {
            if (!particle.drawable(time)) {
                continue;
            }
            let x = particle.positionX * 600;
            let y = particle.positionY * 600;
            let radiusMultiplier = particle.state === AgentState.DECEASED ? 1 - particle.deactivationProgress(time) : 1;
            this.context.fillStyle = particle.state.color;
            this.context.beginPath();
            this.context.arc(x, y, particle.radius * 600 * radiusMultiplier, 0, END_ANGLE, false);
            this.context.fill();
        }
    }

}

const LOG_HEIGHT = 100;

export class StatsRenderer {
    constructor(context, state) {
        this.context = context;
        this.state = state;
    }

    render() {
        let stat = this.state.getLastStat();
        if (!stat) {
            this.context.fillStyle = 'rgb(255,255,255)';
            this.context.fillRect(0, 0, 600, LOG_HEIGHT);
            return;
        }
        // update one column of pixels at a time
        let column = this.state.log.length - 1;
        // from top to bottom: deceased, immune, healthy, sick
        let deceasedHeight = LOG_HEIGHT * stat.deceased / stat.total;
        this.context.fillStyle = AgentState.DECEASED.color;
        this.context.fillRect(column, 0, 1, deceasedHeight);

        let immuneHeight = LOG_HEIGHT * stat.immune / stat.total;
        this.context.fillStyle = AgentState.IMMUNE.color;
        this.context.fillRect(column, deceasedHeight, 1, immuneHeight);

        let healthyHeight = LOG_HEIGHT * stat.healthy / stat.total;
        this.context.fillStyle = AgentState.HEALTHY.color;
        this.context.fillRect(column, deceasedHeight + immuneHeight, 1, healthyHeight);

        let sickHeight = LOG_HEIGHT * stat.sick / stat.total;
        this.context.fillStyle = AgentState.SICK.color;
        this.context.fillRect(column, deceasedHeight + immuneHeight + healthyHeight, 1, sickHeight);
    }
}