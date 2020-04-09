export const EventType = Object.freeze({
    COLLISION_WITH_WALL: Symbol('CollisionWithWall'),
    PARTICLE_COLLISION: Symbol('ParticleCollision'),
    REDRAW: Symbol('Redraw')
});

class SimulationEvent {
    constructor(time, type) {
        this.time = time;
        this.type = type;
    }

    compareTo(event) {
        return this.time - event.time;
    }

    isValid() {
        return true;
    }
}

export class CollisionWithWall extends SimulationEvent {
    constructor(time, particle, isVertical) {
        super(time, EventType.COLLISION_WITH_WALL);
        this.particle = particle;
        this.vertical = isVertical;
        this.count = particle.count;
    }

    /**
     * @returns {boolean} if a collision occurred between when event was created and now
     */
    isValid() {
        return this.particle.count === this.count;
    }
}

export class ParticleCollision extends SimulationEvent {
    constructor(time, particleA, particleB) {
        super(time, EventType.PARTICLE_COLLISION);
        this.particleA = particleA;
        this.particleB = particleB;
        this.countA = particleA.count;
        this.countB = particleB.count;
    }

    isValid() {
        return this.particleA.count === this.countA && this.particleB.count === this.countB;
    }
}

export class Redraw extends SimulationEvent {
    constructor(time) {
        super(time, EventType.REDRAW);
    }
}