const DEACTIVATION_ANIMATION_LENGTH = 2000;

/**
 * Particle model.
 * Particle is a hard disc with known position, velocity, radius and state.
 * Particle can be immovable: it will participate in collisions but will never change its position.
 *
 * Based on Particle from algs4 by Robert Sedgewick and Kevin Wayne.
 * @see https://github.com/kevin-wayne/algs4/blob/master/src/main/java/edu/princeton/cs/algs4/Particle.java
 */
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
        this.deactivationTime = null;
    }

    /**
     * Moves this particle in a straight line (based on its velocity)
     * for the specified amount of time.
     *
     * @param  dt the amount of time
     */
    move(dt) {
        if (this.movable) {
            this.positionX += this.velocityX * dt;
            this.positionY += this.velocityY * dt;
        }
    }

    drawable(time) {
        return this.deactivationTime ? this.deactivationTime + DEACTIVATION_ANIMATION_LENGTH > time : true;
    }

    deactivationProgress(time) {
        return this.deactivationTime ? (time - this.deactivationTime) / DEACTIVATION_ANIMATION_LENGTH : 0;
    }
}