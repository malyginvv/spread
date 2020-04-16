import simulationParameters from "./sim/parameters.js";

export default class SettingsController {
    constructor() {
        this.rangeIsolation = document.getElementById('range-isolation');
        this.isolationValue = document.getElementById('isolation-value');

        this.isolationChange = this.isolationChange.bind(this);
        this.rangeIsolation.addEventListener('input', this.isolationChange);
    }

    updateSettings() {
        let isolation = simulationParameters.isolation * 100;
        this.isolationValue.innerText = isolation + '%';
        this.rangeIsolation.value = isolation;
    }

    isolationChange(event) {
        let value = event.target.value;
        this.isolationValue.innerText = value + '%';
        simulationParameters.isolation = value / 100;
    }
}
