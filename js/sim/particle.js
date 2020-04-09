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
    constructor(positionX, positionY, velocityX, velocityY, radius, movable, state, environment) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.radius = radius;
        this.movable = movable;
        this.state = state;
        this.count = 0;
        this.environment = environment;
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

    /**
     * Returns the amount of time for this particle to collide with the specified
     * particle, assuming no intervening collisions.
     *
     * @param  that the other particle
     * @return number the amount of time for this particle to collide with the specified
     *         particle, assuming no intervening collisions;
     *         Number.POSITIVE_INFINITY if the particles will not collide
     */
    timeToHit(that) {
        if (this === that) return Number.POSITIVE_INFINITY;
        let deltaX = that.positionX - this.positionX;
        let deltaY = that.positionY - this.positionY;
        let deltaVX = that.velocityX - this.velocityX;
        let deltaVY = that.velocityY - this.velocityY;
        let dvdr = deltaX * deltaVX + deltaY * deltaVY;
        if (dvdr > 0) {
            return Number.POSITIVE_INFINITY;
        }
        let dvdv = deltaVX * deltaVX + deltaVY * deltaVY;
        if (dvdv === 0) {
            return Number.POSITIVE_INFINITY;
        }
        let drdr = deltaX * deltaX + deltaY * deltaY;
        let sigma = this.radius + that.radius;
        let d = (dvdr * dvdr) - dvdv * (drdr - sigma * sigma);
        if (d < 0) {
            return Number.POSITIVE_INFINITY;
        }
        return -(dvdr + Math.sqrt(d)) / dvdv;
    }

    /**
     * Returns the amount of time for this particle to collide with the vertical wall, assuming no intervening collisions.
     * @return {number} the amount of time for this particle to collide with the vertical wall, assuming no intervening collisions;
     *         Number.POSITIVE_INFINITY if the particle will not collide with the wall
     */
    timeToHitVerticalWall() {
        if (!this.movable) {
            return Number.POSITIVE_INFINITY;
        }
        if (this.velocityX > 0) {
            return (this.environment.boxWidth - this.positionX - this.radius) / this.velocityX;
        } else if (this.velocityX < 0) {
            return (this.radius - this.positionX) / this.velocityX;
        } else {
            return Number.POSITIVE_INFINITY;
        }
    }

    /**
     * Returns the amount of time for this particle to collide with the horizontal wall, assuming no intervening collisions.
     * @return {number} the amount of time for this particle to collide with the horizontal wall, assuming no intervening collisions;
     *         Number.POSITIVE_INFINITY if the particle will not collide with the wall
     */
    timeToHitHorizontalWall() {
        if (!this.movable) {
            return Number.POSITIVE_INFINITY;
        }
        if (this.velocityY > 0) {
            return (this.environment.boxHeight - this.positionY - this.radius) / this.velocityY;
        } else if (this.velocityY < 0) {
            return (this.radius - this.positionY) / this.velocityY;
        } else {
            return Number.POSITIVE_INFINITY;
        }
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