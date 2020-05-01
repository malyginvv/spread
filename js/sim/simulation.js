import PriorityQueue from "./priority-queue.js";
import {CollisionWithWall, EventType, ParticleCollision, Redraw} from './event.js'
import Predictor from "./predictor.js";
import Solver from "./solver.js";

/**
 * Port of CollisionSystem from algs4 by Robert Sedgewick and Kevin Wayne.
 * @see https://github.com/kevin-wayne/algs4/blob/master/src/main/java/edu/princeton/cs/algs4/CollisionSystem.java
 */
export default class Simulation {

    constructor(state, limit, fps) {
        this.state = state;
        this.limit = limit;
        // simulation clock time in seconds
        this.time = 0.0;
        this.pq = new PriorityQueue();
        this.predictor = new Predictor(state.environment);
        this.solver = new Solver();
        this.fps = fps;
    }

    init() {
        // reset clock
        this.time = 0.0;
        // clear events
        this.pq.clear();
        // initialize PQ with collision events for every pair of two particles
        for (let particle of this.state.particles) {
            this.predict(particle);
            let event = this.solver.solveInitiallySick(particle);
            if (event) {
                this.pq.insert(event);
            }
        }
        this.pq.insert(new Redraw(0));
    }

    /**
     * Simulates the system of particles for the specified amount of time.
     */
    step() {
        // the main event-driven simulation loop
        while (!this.pq.isEmpty()) {
            // get impending event, discard if invalidated
            let event = this.pq.poll();
            if (!event.isValid()) {
                continue;
            }

            // update positions and then simulation clock
            for (let particle of this.state.particles) {
                particle.move(event.time - this.time);
            }
            this.time = event.time;

            // process event
            if (event.type === EventType.PARTICLE_COLLISION) {
                this.solver.solveParticleCollision(event.particleA, event.particleB);
                // particle interaction can produce new events
                let possibleEvent = this.solver.solveInteraction(event.particleA, event.particleB, this.time);
                if (possibleEvent) {
                    this.pq.insert(possibleEvent);
                }
                this.predict(event.particleA);
                this.predict(event.particleB);
            } else if (event.type === EventType.COLLISION_WITH_WALL) {
                if (event.vertical) {
                    this.solver.solveParticleOnVerticalWallCollision(event.particle);
                } else {
                    this.solver.solveParticleOnHorizontalWallCollision(event.particle);
                }
                this.predict(event.particle);
            } else if (event.type === EventType.RECOVERY) {
                this.solver.solveRecovery(event.particle);
            } else if (event.type === EventType.DEATH) {
                this.solver.solveDeath(event.particle, this.time);
            } else if (event.type === EventType.REDRAW) {
                this.redraw();
                return;
            }
        }
    }

    // updates priority queue with all new events for a particle
    predict(particle) {
        // particle-particle collisions
        for (let otherParticle of this.state.particles) {
            let dt = this.predictor.timeToHit(particle, otherParticle);
            let collisionTime = this.time + dt;
            if (collisionTime <= this.limit) {
                this.pq.insert(new ParticleCollision(collisionTime, particle, otherParticle));
            }
        }

        // particle-wall collisions
        let dtX = this.predictor.timeToHitVerticalWall(particle);
        let dtY = this.predictor.timeToHitHorizontalWall(particle);
        if (this.time + dtX <= this.limit) {
            this.pq.insert(new CollisionWithWall(this.time + dtX, particle, true));
        }
        if (this.time + dtY <= this.limit) {
            this.pq.insert(new CollisionWithWall(this.time + dtY, particle, false));
        }
    }

    redraw() {
        if (this.time < this.limit) {
            this.pq.insert(new Redraw(this.time + 1.0 / this.fps));
        }
    }
}