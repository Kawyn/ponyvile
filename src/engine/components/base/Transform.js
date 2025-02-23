class Transform extends Component {

    /** @type {DynamicValue} */ position = new DynamicValue();
    /** @type {DynamicValue} */ scenePosition = new DynamicValue(new Vector(0, 0));

    /** @type {DynamicValue} */ scale = new DynamicValue();


    /** @type {Transform} */ #parentTransform;

    onParentChanged = (eventName, data) => {

        if (this.#parentTransform) {

            console.error("Implement recalculation of position");

            this.#parentTransform.scenePosition.removeChangeListener(this.onParentScenePositionChanged);
            this.#parentTransform = null;
        }

        if (!data)
            return;

        this.#parentTransform = data.GetComponentByType(Transform);

        if (this.#parentTransform) {

            this.#parentTransform.scenePosition.addChangeListener(this.onParentScenePositionChanged);
        }
    }

    onParentScenePositionChanged = (value) => {

        this.updateScenePosition();
    }

    constructor(kit = {}) {

        super(kit);

        if (kit.position instanceof Vector)
            this.position.value = kit.position.clone();
        else
            this.position.value = new Vector(0, 0);

        if (kit.scale instanceof Vector)
            this.scale.value = kit.scale.clone();
        else
            this.scale.value = new Vector(1, 1);
    }

    onEnable() {

        super.onEnable();

        this.actor.EventManager.addEventListener(ActorEvents.ON_PARENT_SET, this.onParentChanged);
        this.onParentChanged('', this.actor.parent);
    }

    updateScenePosition() {

        if (!this.#parentTransform)
            this.scenePosition.value = this.position.value.clone();
        else
            this.scenePosition.value = Vector.sum(this.#parentTransform.scenePosition.value, this.position.value);
    }

    onDisable() {

        super.onDisable();

        this.actor.EventManager.addEventListener(ActorEvents.ON_PARENT_SET, this.onParentChanged);
        this.onParentChanged('', this.actor.parent);
    }
}