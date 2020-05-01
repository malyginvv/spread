import {AgentState} from './state.js';

/**
 * Calculates particle-on-particle and particle-on-wall collision times.
 */
export default class Predictor {

    constructor(environment) {
        this.environment = environment;
    }

    /**
     * Returns the amount of time for particle A to collide with particle B, assuming no intervening collisions.
     *
     * @param  particleB particle A
     * @param  particleA particle B
     * @return {number} the amount of time for particle A to collide with particle B, assuming no intervening collisions;
     *         Number.POSITIVE_INFINITY if the particles will not collide
     */
    timeToHit(particleA, particleB) {
        if (particleA === particleB || !particleA.movable && !particleB.movable
            || particleA.state === AgentState.DECEASED || particleB.state === AgentState.DECEASED) {
            // a particle cannot collide with itself and two immovable particles cannot collide with each other
            return Number.POSITIVE_INFINITY;
        }
        let deltaX = particleA.positionX - particleB.positionX;
        let deltaY = particleA.positionY - particleB.positionY;
        let deltaVX = particleA.velocityX - particleB.velocityX;
        let deltaVY = particleA.velocityY - particleB.velocityY;
        let dvdr = deltaX * deltaVX + deltaY * deltaVY;
        if (dvdr > 0) {
            return Number.POSITIVE_INFINITY;
        }
        let dvdv = deltaVX * deltaVX + deltaVY * deltaVY;
        if (dvdv === 0) {
            return Number.POSITIVE_INFINITY;
        }
        let drdr = deltaX * deltaX + deltaY * deltaY;
        let sigma = particleB.radius + particleA.radius;
        let d = (dvdr * dvdr) - dvdv * (drdr - sigma * sigma);
        if (d < 0) {
            return Number.POSITIVE_INFINITY;
        }
        return -(dvdr + Math.sqrt(d)) / dvdv;
    }

    /**
     * Returns the amount of time for the particle to collide with the vertical wall, assuming no intervening collisions.
     * @return {number} the amount of time for the particle to collide with the vertical wall, assuming no intervening collisions;
     *         Number.POSITIVE_INFINITY if the particle will not collide with the wall
     */
    timeToHitVerticalWall(particle) {
        return this._timeToHitWall(particle.movable, particle.velocityX, particle.positionX, particle.radius, this.environment.boxWidth);
    }

    /**
     * Returns the amount of time for the particle to collide with the horizontal wall, assuming no intervening collisions.
     * @return {number} the amount of time for the particle to collide with the horizontal wall, assuming no intervening collisions;
     *         Number.POSITIVE_INFINITY if the particle will not collide with the wall
     */
    timeToHitHorizontalWall(particle) {
        return this._timeToHitWall(particle.movable, particle.velocityY, particle.positionY, particle.radius, this.environment.boxHeight);
    }

    _timeToHitWall(movable, velocity, position, radius, boxDimension) {
        let result;
        if (!movable) {
            // immovable particle cannot hit the wall
            result = Number.POSITIVE_INFINITY;
        } else if (velocity > 0) {
            // particle moving down or right
            // distance to the wall is environment - position - radius
            result = (boxDimension - position - radius) / velocity;
        } else if (velocity < 0) {
            // particle moving up or left
            // distance to the wall is position - radius
            result = (radius - position) / velocity;
        } else {
            result = Number.POSITIVE_INFINITY;
        }
        return result;
    }

}