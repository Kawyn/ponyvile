class RotateOverTime extends Component {

    velocity = [0, 0, 0];

    /** @type {Transform} */ #transform;

    constructor(velocity) {
        super();

        this.velocity = velocity ?? [0, 0, 0];
    }

    onPostInitialize() {

        this.#transform = this.actor.GetComponentByType(Transform);
    }

    onEnable() {

        Scene.Instance.TimeManager.addObjectToRefresh(this);
    }

    onRefresh(deltaTime) {

        const rotation = [...this.#transform.rotation.value];

        rotation[0] += this.velocity[0] * deltaTime;
        rotation[1] += this.velocity[1] * deltaTime;
        rotation[2] += this.velocity[2] * deltaTime;

        this.#transform.rotation.value = rotation;
    }

    onDisable() {
        Scene.Instance.TimeManager.removeObjectToRefresh(this);
    }
}