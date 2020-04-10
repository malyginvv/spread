/**
 * Particle model.
 * Particle is a disc with known position, velocity, radius and state.
 * Particle can be immovable: it will participate in collisions but will never change its position.
 *
 * Based on Particle from algs4 by Robert Sedgewick and Kevin Wayne.
 * @see https://github.com/kevin-wayne/algs4/blob/master/src/main/java/edu/princeton/cs/algs4/Particle.java
 */
import {AgentState} from "./state.js";

export default class Particle {
    constructor(positionX, positionY, velocityX, velocityY, radius, movable, state) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.radius = radius;
        this.movable = movable;
        this.state = state;
        this.count = 0;
    }

    /**
     * Moves this particle in a straight line (based on its velocity)
     * for the specified amount of time.
     *
     * @param  dt the amount of time
     */
    move(dt) {
        this.positionX += this.velocityX * dt;
        this.positionY += this.velocityY * dt;
    }

    bounceOff(particle) {
        let deltaX = particle.positionX - this.positionX;
        let deltaY = particle.positionY - this.positionY;
        let deltaVX = particle.velocityX - this.velocityX;
        let deltaVY = particle.velocityY - this.velocityY;
        let dv = deltaX * deltaVX + deltaY * deltaVY;
        let distance = this.radius + particle.radius;
        let magnitude = dv / distance;

        // force
        let forceX = magnitude * deltaX / distance;
        let forceY = magnitude * deltaY / distance;

        // TODO: immovable particles
        this.velocityX += forceX;
        this.velocityY += forceY;
        particle.velocityX -= forceX;
        particle.velocityY -= forceY;

        // TODO: infection
        if (this.state === AgentState.SICK) {
            particle.state = AgentState.SICK;
        }
        if (particle.state === AgentState.SICK) {
            this.state = AgentState.SICK;
        }

        // update counts
        this.count++;
        particle.count++;
    }

    bounceOffVerticalWall() {
        this.velocityX = -this.velocityX;
        this.count++;
    }

    bounceOffHorizontalWall() {
        this.velocityY = -this.velocityY;
        this.count++;
    }
}