import {SimulationState} from './sim/state.js';
import Controller from './controller.js';
import Environment from './sim/environment.js';
import SettingsController from './settings.js';

const app = async () => {
    const environment = new Environment();
    const state = new SimulationState(environment);
    const controller = new Controller(state);
    controller.settingsController = new SettingsController(controller);
};

document.addEventListener('DOMContentLoaded', app);