import {AgentState} from './state.js';
import simulationParameters from './parameters.js';
import {Death, Recovery} from './event.js';

/**
 * Solves collisions and state changes.
 */
export default class Solver {

    solveParticleCollision(particleA, particleB) {
        let deltaX = particleB.positionX - particleA.positionX;
        let deltaY = particleB.positionY - particleA.positionY;
        let deltaVX = particleB.velocityX - particleA.velocityX;
        let deltaVY = particleB.velocityY - particleA.velocityY;
        let dv = deltaX * deltaVX + deltaY * deltaVY;
        let distance = particleA.radius + particleB.radius;
        let magnitude = dv / distance;

        // force, assuming all particles have the same mass
        let forceX = magnitude * deltaX / distance;
        let forceY = magnitude * deltaY / distance;

        if (particleA.movable) {
            // if particle B is immovable then it cannot change its velocity, so all the momentum must stay with particle A
            let multiplier = particleB.movable ? 1 : 2;
            particleA.velocityX += multiplier * forceX;
            particleA.velocityY += multiplier * forceY;
        }
        if (particleB.movable) {
            // same as above
            let multiplier = particleA.movable ? 1 : 2;
            particleB.velocityX -= multiplier * forceX;
            particleB.velocityY -= multiplier * forceY;
        }

        // update counts
        particleA.count++;
        particleB.count++;
    }

    solveParticleOnVerticalWallCollision(particle) {
        particle.velocityX = -particle.velocityX;
        particle.count++;
    }

    solveParticleOnHorizontalWallCollision(particle) {
        particle.velocityY = -particle.velocityY;
        particle.count++;
    }

    solveInteraction(particleA, particleB, time) {
        let possibleEvent = this._solveInteraction(particleA, particleB, time);
        if (possibleEvent) {
            return possibleEvent;
        }
        return this._solveInteraction(particleB, particleA, time);
    }

    _solveInteraction(particle, anotherParticle, time) {
        if (particle.state === AgentState.SICK && anotherParticle.state === AgentState.HEALTHY) {
            if (Math.random() < simulationParameters.infectionProbability) {
                anotherParticle.state = AgentState.SICK;
                return this._solveOutcome(time, anotherParticle);
            }
        }
    }

    _solveOutcome(time, particle) {
        if (Math.random() < simulationParameters.caseFatalityRate) {
            return new Death(time + this._getRandomDuration(), particle);
        }
        return new Recovery(time + this._getRandomDuration(), particle);
    }

    _getRandomDuration() {
        return simulationParameters.diseaseDuration + (Math.random() - 0.5) * simulationParameters.diseaseDuration / 10;
    }

    solveInitiallySick(particle) {
        if (particle.state === AgentState.SICK) {
            return this._solveOutcome(0, particle);
        }
    }

    solveRecovery(particle) {
        particle.state = AgentState.IMMUNE;
    }

    solveDeath(particle, time) {
        particle.state = AgentState.DECEASED;
        particle.movable = false;
        particle.velocityX = 0;
        particle.velocityY = 0;
        particle.count = -1;
        particle.deactivationTime = time * 1000;
    }
}