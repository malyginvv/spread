import simulationParameters from "./sim/parameters.js";
import {SIM_LENGTH} from "./controller.js";

export default class SettingsController {
    constructor(controller) {
        this.controller = controller;
        this.rangeIsolation = document.getElementById('range-isolation');
        this.isolationValue = document.getElementById('isolation-value');
        this.rangeSick = document.getElementById('range-sick');
        this.sickValue = document.getElementById('sick-value');
        this.rangeInfection = document.getElementById('range-infection');
        this.infectionValue = document.getElementById('infection-value');
        this.rangeDuration = document.getElementById('range-duration');
        this.durationValue = document.getElementById('duration-value');
        this.rangeCfr = document.getElementById('range-cfr');
        this.cfrValue = document.getElementById('cfr-value');

        this.onIsolationInput = this.onIsolationInput.bind(this);
        this.onSickInput = this.onSickInput.bind(this);
        this.onInfectionInput = this.onInfectionInput.bind(this);
        this.onDurationInput = this.onDurationInput.bind(this);
        this.onCfrInput = this.onCfrInput.bind(this);
        this.rangeIsolation.addEventListener('input', this.onIsolationInput);
        this.rangeSick.addEventListener('input', this.onSickInput);
        this.rangeInfection.addEventListener('input', this.onInfectionInput);
        this.rangeDuration.addEventListener('input', this.onDurationInput);
        this.rangeCfr.addEventListener('input', this.onCfrInput);

        this.updateSettings();
    }

    updateSettings() {
        let isolation = simulationParameters.isolationRate * 100;
        this.isolationValue.innerText = isolation + '%';
        this.rangeIsolation.value = isolation;
        let sickRate = simulationParameters.sickRate * 100;
        this.sickValue.innerText = sickRate + '%';
        this.rangeSick.value = sickRate;
        let infectionRate = simulationParameters.infectionProbability * 100;
        this.infectionValue.innerText = infectionRate + '%';
        this.rangeInfection.value = infectionRate;
        let durationPercent = simulationParameters.diseaseDuration * 100000 / SIM_LENGTH;
        this.durationValue.innerText = durationPercent + '%';
        this.rangeDuration.value = durationPercent;
        let caseFatalityRate = simulationParameters.caseFatalityRate * 100;
        this.cfrValue.innerText = caseFatalityRate + '%';
        this.rangeCfr.value = caseFatalityRate;
    }

    onIsolationInput(event) {
        let value = event.target.value;
        this.isolationValue.innerText = value + '%';
        simulationParameters.isolationRate = value / 100;
    }

    onSickInput(event) {
        let value = event.target.value;
        this.sickValue.innerText = value + '%';
        simulationParameters.sickRate = value / 100;
        this.controller.onSickRateChange();
    }

    onInfectionInput(event) {
        let value = event.target.value;
        this.infectionValue.innerText = value + '%';
        simulationParameters.infectionProbability = value / 100;
    }

    onDurationInput(event) {
        let value = event.target.value;
        this.durationValue.innerText = value + '%';
        simulationParameters.diseaseDuration = SIM_LENGTH * value / 100000;
    }

    onCfrInput(event) {
        let value = event.target.value;
        this.cfrValue.innerText = value + '%';
        simulationParameters.caseFatalityRate = value / 100;
    }

    disableControls() {
        this.rangeIsolation.disabled = true;
        this.rangeSick.disabled = true;
        this.rangeInfection.disabled = true;
        this.rangeDuration.disabled = true;
        this.rangeCfr.disabled = true;
    }

    enableControls() {
        this.rangeIsolation.disabled = false;
        this.rangeSick.disabled = false;
        this.rangeInfection.disabled = false;
        this.rangeDuration.disabled = false;
        this.rangeCfr.disabled = false;
    }
}
