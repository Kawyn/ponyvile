class AxisToRotation extends Component {

    /** @type {Transform} */ #transform;


    constructor(inputAxisIdentifier, transformAxisIdentifier, multiplier) {
        super();

        this.inputAxisIdentifier = inputAxisIdentifier;
        this.transformAxisIdentifier = transformAxisIdentifier;

        this.multiplier = multiplier;
    }

    onInitialize(actor) {
        super.onInitialize(actor);

        this.axis = Scene.Instance.InputManager.GetAxis(this.inputAxisIdentifier);
    }

    onPostInitialize() {

        this.#transform = this.actor.GetComponentByType(Transform);
    }

    onEnable() {

        Scene.Instance.TimeManager.addObjectToRefresh(this);
    }

    onRefresh(deltaTime) {

        const delta = this.axis.value * deltaTime * this.multiplier;

        if (delta != 0) {

            this.#transform.rotation.value[this.transformAxisIdentifier] += delta;
            this.#transform.rotation.callChangedNow();
        }
    }

    onDisable() {

        Scene.Instance.TimeManager.removeObjectToRefresh(this);
    }
}