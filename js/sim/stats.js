export default class SimulationStats {
    constructor(healthy, sick, immune, deceased) {
        this.healthy = healthy;
        this.sick = sick;
        this.immune = immune;
        this.deceased = deceased;
        this.total = healthy + sick + immune + deceased;
    }
}