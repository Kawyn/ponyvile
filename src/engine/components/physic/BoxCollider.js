class Collider extends Component { }


class BoxCollider extends Collider {

    #transform;

    get position() {

        return Vector.sum(this.#transform.position.value, this.offset);
    }

    set position(value) {

        this.#transform.position.value = Vector.sub(value, this.offset);
    }

    constructor(kit) {

        super({});

        kit = kit ?? {};
        this.offset = kit.offset instanceof Vector ? kit.offset.clone() : new Vector(0, 0);
        this.size = kit.size instanceof Vector ? kit.size.clone() : null;

        this.trigger = kit.trigger ?? false;

    }

    onPostInitialize() {

        this.#transform = this.actor.GetComponentByType(Transform);

        if (this.size === null)
            this.size = this.#transform.scale.value.clone();
    }

    onEnable() {

        Scene.Instance.EventManager.riseEvent(PhysicEventNames.REGISTER_COLLIDER, this);
    }

    onEnter(collider) {
        console.log(this.trigger);

        this.actor.EventManager.riseEvent(PhysicEventNames.ON_COLLISION_ENTER, collider);
    }

    onExit(collider) {

        this.actor.EventManager.riseEvent(PhysicEventNames.ON_COLLISION_EXIT, collider);
    }

    onStay(collider) {

        this.actor.EventManager.riseEvent(PhysicEventNames.ON_COLLISION_STAY, collider);
    }

    onDisable() {

        Scene.Instance.EventManager.riseEvent(PhysicEventNames.UNREGISTER_COLLIDER, this);
    }
}