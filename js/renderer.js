import {AgentState} from './sim/state.js';

const END_ANGLE = Math.PI * 2;

export class Renderer {
    constructor(context, state) {
        this.context = context;
        this.state = state;
        this.boxWidth = state.environment.boxWidth;
        this.boxHeight = state.environment.boxHeight;
        this.canvasWidth = state.environment.canvasWidth;
        this.canvasHeight = state.environment.canvasHeight;
    }

    render(time = 0) {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        for (let particle of this.state.particles) {
            if (!particle.drawable(time)) {
                continue;
            }
            let x = particle.positionX * this.canvasWidth / this.boxWidth;
            let y = particle.positionY * this.canvasHeight / this.boxHeight;
            let radiusMultiplier = particle.state === AgentState.DECEASED ? 1 - particle.deactivationProgress(time) : 1;
            this.context.fillStyle = particle.state.color;
            this.context.beginPath();
            this.context.arc(x, y, particle.radius * this.canvasHeight * radiusMultiplier, 0, END_ANGLE, false);
            this.context.fill();
        }
    }

}

export class StatsRenderer {
    constructor(context, state, statHealthy, statSick, statImmune, statDeceased) {
        this.context = context;
        this.state = state;
        this.canvasWidth = state.environment.statsCanvasWidth;
        this.canvasHeight = state.environment.statsCanvasHeight;
        this.statHealthy = statHealthy;
        this.statSick = statSick;
        this.statImmune = statImmune;
        this.statDeceased = statDeceased;
    }

    render() {
        let stat = this.state.getCurrentStat();
        // update values
        this.statHealthy.innerText = stat.healthy;
        this.statSick.innerText = stat.sick;
        this.statImmune.innerText = stat.immune;
        this.statDeceased.innerText = stat.deceased;

        if (this.state.isStatsEmpty()) {
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            return;
        }

        // update one column of pixels at a time
        let column = this.state.getCurrentStatIndex();

        // from top to bottom: deceased, immune, healthy, sick
        let deceasedHeight = this.canvasHeight * stat.deceased / stat.total;
        this.context.fillStyle = AgentState.DECEASED.color;
        this.context.fillRect(column, 0, 1, deceasedHeight);

        let immuneHeight = this.canvasHeight * stat.immune / stat.total;
        this.context.fillStyle = AgentState.IMMUNE.color;
        this.context.fillRect(column, deceasedHeight, 1, immuneHeight);

        let healthyHeight = this.canvasHeight * stat.healthy / stat.total;
        this.context.fillStyle = AgentState.HEALTHY.color;
        this.context.fillRect(column, deceasedHeight + immuneHeight, 1, healthyHeight);

        let sickHeight = this.canvasHeight * stat.sick / stat.total;
        this.context.fillStyle = AgentState.SICK.color;
        this.context.fillRect(column, deceasedHeight + immuneHeight + healthyHeight, 1, sickHeight);
    }
}