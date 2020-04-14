export default class SimulationLogEntry {
    constructor(healthy, sick, immune) {
        this.healthy = healthy;
        this.sick = sick;
        this.immune = immune;
        this.total = healthy + sick + immune;
    }
}