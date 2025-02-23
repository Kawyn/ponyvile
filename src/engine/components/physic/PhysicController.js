class PhysicController extends Component {
    #colliders = [];
    #collisions = {};

    registerCollider = (eventName, data) => {
        this.#colliders.push(data);
    };

    unregisterCollider = (eventName, data) => {
        this.#colliders.splice(this.#colliders.indexOf(data), 1);
    };

    onInitialize(actor) {
        super.onInitialize(actor);

        Scene.Instance.EventManager.addEventListener(PhysicEventNames.REGISTER_COLLIDER, this.registerCollider);
        Scene.Instance.EventManager.addEventListener(PhysicEventNames.UNREGISTER_COLLIDER, this.unregisterCollider);
    }

    onEnable() {
        Scene.Instance.TimeManager.addObjectToRefresh(this.refresh, 1000); // Check collisions periodically
    }

    onDisable() {
        Scene.Instance.TimeManager.removeObjectToRefresh(this.refresh);
    }

    overlap(a, b) {
        const aPos = a.position;
        const bPos = b.position;

        return (
            aPos.x < bPos.x + b.size.x &&
            aPos.x + a.size.x > bPos.x &&
            aPos.y < bPos.y + b.size.y &&
            aPos.y + a.size.y > bPos.y
        );
    }

    /**
     * Handles collision detection and response.
     */
    refresh = () => {
        const maxIterations = 10; // Maksymalna liczba iteracji
        for (let iteration = 0; iteration < maxIterations; iteration++) {
            let collisionResolved = false;

            for (let i = 0; i < this.#colliders.length - 1; i++) {
                const a = this.#colliders[i];

                for (let j = i + 1; j < this.#colliders.length; j++) {
                    const b = this.#colliders[j];

                    if (this.overlap(a, b)) {

                        if (!this.#collisions[a.identifier + b.identifier]) {
                            a.onEnter(b);
                            b.onEnter(a);

                            this.#collisions[a.identifier + b.identifier] = true;
                        }
                        else {
                            a.onStay(b);
                            b.onStay(a);
                        }
                        if (a.trigger || b.trigger)
                            continue;

                        this.resolveCollision(a, b);
                        collisionResolved = true;
                    }
                    else {
                        if (this.#collisions[a.identifier + b.identifier]) {
                            a.onExit(b);
                            b.onExit(a);

                            this.#collisions[a.identifier + b.identifier] = false;
                        }
                    }
                }
            }

            if (!collisionResolved) break; // Jeśli wszystkie kolizje zostały rozwiązane, kończymy iteracje
        }
    }

    /**
     * 
     * @param {Collider} a 
     * @param {Collider} b 
     * @returns 
     */
    resolveCollision(a, b) {
        const aRigidbody = a.actor.GetComponentByType(Rigidbody);
        const bRigidbody = b.actor.GetComponentByType(Rigidbody);

        if (!aRigidbody && !bRigidbody) return;

        let collisionDirection = PhysicController.getCollisionDirection(a, b);
        if (!collisionDirection) return;

        let staticCollider = null;
        let dynamicCollider = null;

        if (aRigidbody?.type === "static" || bRigidbody?.type === "static") {
            if (aRigidbody && aRigidbody.type === "static") {
                staticCollider = a;
                dynamicCollider = b;
                collisionDirection = collisionDirection.scale(-1);
            } else if (bRigidbody && bRigidbody.type === "static") {
                staticCollider = b;
                dynamicCollider = a;
            }

            // Korekcja penetracji
            this.correctPenetration(dynamicCollider, staticCollider, collisionDirection);

            // Obsługa kolizji statyczno-dynamicznej
            this.handleStaticDynamicCollision(dynamicCollider, collisionDirection);
        } else {
            // Korekcja pozycji i obsługa dynamiczno-dynamiczna
            this.correctPenetration(a, b, collisionDirection);
            this.handleDynamicDynamicCollision(a, b);
        }
    } static getPenetrationDepth(a, b, collisionDirection) {
        const overlapX = (a.size.x / 2 + b.size.x / 2) - Math.abs(a.position.x - b.position.x);
        const overlapY = (a.size.y / 2 + b.size.y / 2) - Math.abs(a.position.y - b.position.y);

        return collisionDirection.x !== 0 ? overlapX : overlapY;
    }
    correctPenetration(dynamicCollider, staticCollider, collisionDirection) {
        const penetrationDepth = PhysicController.getPenetrationDepth(dynamicCollider, staticCollider, collisionDirection);
        const correction = collisionDirection.scale(penetrationDepth);
        dynamicCollider.position = Vector.sum(dynamicCollider.position, correction);
    }

    handleStaticDynamicCollision(dynamicCollider, collisionDirection) {
        const velocity = dynamicCollider.actor.GetComponentByType(ObjectWithVelocity);
        if (!velocity) return;

        const reflectedVelocity = Vector.reflect(velocity.velocity.value, collisionDirection);
        if (Vector.dot(velocity.velocity.value, collisionDirection) < 0) {
            velocity.velocity.value = reflectedVelocity.scale(dynamicCollider.elasticity || 1);
        }
    }

    handleDynamicDynamicCollision(a, b) {
        const velocityA = a.actor.GetComponentByType(ObjectWithVelocity);
        const velocityB = b.actor.GetComponentByType(ObjectWithVelocity);

        if (!velocityA || !velocityB) return;

        const resultingVelocities = PhysicController.calculateResultingVelocities(
            {
                position: a.position,
                size: a.size,
                mass: 55,
                elasticity: a.elasticity || 1,
                velocity: velocityA.velocity.value,
            },
            {
                position: b.position,
                size: b.size,
                mass: 1,
                elasticity: b.elasticity || 0.5,
                velocity: velocityB.velocity.value,
            }
        );

        velocityA.velocity.value = resultingVelocities.body1Velocity;
        velocityB.velocity.value = resultingVelocities.body2Velocity;
    }

    static calculateResultingVelocities(body1, body2) {
        const relativeVelocity = Vector.sub(body1.velocity, body2.velocity);
        const collisionNormal = PhysicController.getCollisionDirection(body1, body2);

        if (!collisionNormal) return { body1Velocity: body1.velocity, body2Velocity: body2.velocity };

        const velocityAlongNormal = Vector.dot(relativeVelocity, collisionNormal);
        if (velocityAlongNormal > 0) return { body1Velocity: body1.velocity, body2Velocity: body2.velocity };

        const restitution = Math.min(body1.elasticity || 1, body2.elasticity || 1);
        const impulseMagnitude = -(1 + restitution) * velocityAlongNormal / (1 / body1.mass + 1 / body2.mass);

        const impulse = collisionNormal.scale(impulseMagnitude);

        return {
            body1Velocity: Vector.sum(body1.velocity, impulse.scale(1 / body1.mass)),
            body2Velocity: Vector.sub(body2.velocity, impulse.scale(1 / body2.mass)),
        };
    }

    static getCollisionDirection(rect1, rect2) {
        const dx = rect1.position.x + rect1.size.x / 2 - (rect2.position.x + rect2.size.x / 2);
        const dy = rect1.position.y + rect1.size.y / 2 - (rect2.position.y + rect2.size.y / 2);

        const combinedHalfWidths = rect1.size.x / 2 + rect2.size.x / 2;
        const combinedHalfHeights = rect1.size.y / 2 + rect2.size.y / 2;

        if (Math.abs(dx) < combinedHalfWidths && Math.abs(dy) < combinedHalfHeights) {
            const overlapX = combinedHalfWidths - Math.abs(dx);
            const overlapY = combinedHalfHeights - Math.abs(dy);

            if (overlapX < overlapY) {
                return dx > 0 ? new Vector(1, 0) : new Vector(-1, 0);
            } else {
                return dy > 0 ? new Vector(0, 1) : new Vector(0, -1);
            }
        }

        return null; // No collision
    }
}
