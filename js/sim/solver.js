import {AgentState} from "./state.js";

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

        // TODO: infection
        if (particleA.state === AgentState.SICK) {
            particleB.state = AgentState.SICK;
        }
        if (particleB.state === AgentState.SICK) {
            particleA.state = AgentState.SICK;
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
}