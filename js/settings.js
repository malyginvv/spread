import simulationParameters from "./sim/parameters.js";

export default class SettingsController {
    constructor(controller) {
        this.controller = controller;
        this.rangeIsolation = document.getElementById('range-isolation');
        this.isolationValue = document.getElementById('isolation-value');
        this.rangeSick = document.getElementById('range-sick');
        this.sickValue = document.getElementById('sick-value');

        this.onIsolationInput = this.onIsolationInput.bind(this);
        this.onSickInput = this.onSickInput.bind(this);
        this.rangeIsolation.addEventListener('input', this.onIsolationInput);
        this.rangeSick.addEventListener('input', this.onSickInput);
    }

    updateSettings() {
        let isolation = simulationParameters.isolationRate * 100;
        this.isolationValue.innerText = isolation + '%';
        this.rangeIsolation.value = isolation;
        let sickRate = simulationParameters.sickRate * 100;
        this.sickValue.innerText = sickRate + '%';
        this.rangeSick.value = sickRate;
    }

    onIsolationInput(event) {
        let value = event.target.value;
        this.isolationValue.innerText = value + '%';
        simulationParameters.isolationRate = value / 100;
        this.controller.onIsolationRateChange();
    }

    onSickInput(event) {
        let value = event.target.value;
        this.sickValue.innerText = value + '%';
        simulationParameters.sickRate = value / 100;
        this.controller.onSickRateChange();
    }
}
