import {LogRenderer, Renderer} from './renderer.js'
import {SimulationState} from './sim/state.js';
import Controller from './controller.js';
import Environment from "./sim/environment.js";
import SettingsController from "./settings.js";

const app = async () => {
    let canvas = document.getElementById('simulation');
    let context = canvas.getContext('2d');
    let logCanvas = document.getElementById('simulation-log');
    let logContext = logCanvas.getContext('2d');

    let buttonRun = document.getElementById('button-run');
    let buttonReset = document.getElementById('button-reset');

    let settingsController = new SettingsController();
    settingsController.updateSettings();

    const environment = new Environment(1, 1); // unit box for now
    const state = new SimulationState(environment);
    const renderer = new Renderer(context, state);
    const logRenderer = new LogRenderer(logContext, state);
    const controller = new Controller(state, renderer, logRenderer, buttonRun, buttonReset);
    controller.prepareSimulation();

    buttonRun.addEventListener('click', () => {
        controller.runSimulation();
    });
    buttonReset.addEventListener('click', () => {
        controller.prepareSimulation();
    })
};

document.addEventListener('DOMContentLoaded', app);