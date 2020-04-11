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

        // force
        let forceX = magnitude * deltaX / distance;
        let forceY = magnitude * deltaY / distance;

        // TODO: immovable particles
        particleA.velocityX += forceX;
        particleA.velocityY += forceY;
        particleB.velocityX -= forceX;
        particleB.velocityY -= forceY;

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