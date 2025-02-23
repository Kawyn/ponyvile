class CopyPositionFromOtherObject extends Component {

    targetIdentifier = 'player';

    /** @type {Transform} */ #transform;
    /** @type {Transform} */ #targetTransform;
    startTime = new Date().getTime();

    onTargetPositionChanged = (value) => {

        this.#transform.position.value = value.map((v, i) => v + this.offset[i]);
    };

    constructor(kit) {

        if (!kit.offset) kit.offset = [0, 0, 0];

        super(kit);

    }

    onPostInitialize() {

        this.#transform = this.actor.GetComponentByType(Transform);

        const target = Scene.Instance.GetActorByIdentifier(this.targetIdentifier);
        this.#targetTransform = target.GetComponentByType(Transform);

    }


    onRefresh() {

        const normalizeArray = (arr) => {
            const length = Math.sqrt(arr[0] ** 2 + arr[1] ** 2 + arr[2] ** 2);
            return length === 0 ? [0, 0, 0] : arr.map(val => val / length);
        };

        let cycle = (this.startTime - new Date().getTime() / 1000 / 3) % 24;
        let angle = (cycle / 24.0) * 2.0 * 3.14159; // Kąt słońca w radianach
        this.offset = normalizeArray([Math.cos(angle), Math.sin(angle), 0.4]).map(v => v * 1000);
        this.onTargetPositionChanged(this.#targetTransform.position.value);

    }
    onEnable() {

        Scene.Instance.TimeManager.addObjectToRefresh(this);

    }

    onDisable() {

        Scene.Instance.TimeManager.removeObjectToRefresh(this);

    }
}