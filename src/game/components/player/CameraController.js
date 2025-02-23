class CameraController extends Component {

    /** @type {Number} */ modifier = 0.05;

    /** @type {Transform} */  #transform;


    onRefresh = (deltaTime) => {

        const targetPosition = this.getTargetCameraPosition();

        const nextX = window.scrollX + (targetPosition.x - window.scrollX) * this.modifier;
        const nextY = window.scrollY + (targetPosition.y - window.scrollY) * this.modifier;

        window.scrollTo(nextX, nextY);
    };


    constructor(kit = {}) {

        super(kit);

        this.modifier = kit.modifier ?? 0.05;
    }


    onPostInitialize() {

        const target = Scene.Instance.GetActorByIdentifier(this.target);
        this.#transform = target.GetComponentByType(Transform);
    }

    getTargetCameraPosition() {

        const targetPosition = Vector.sum(this.#transform.position.value, this.#transform.scale.value.scale(0.5));

        const targetX = targetPosition.x - window.innerWidth / 2;
        const targetY = targetPosition.y - window.innerHeight / 2;

        return new Vector(targetX, targetY);
    }

    onEnable() {

        Scene.Instance.TimeManager.addObjectToRefresh(this.onRefresh, 100);
    }

    onDisable() {

        Scene.Instance.TimeManager.removeObjectToRefresh(this.onRefresh, 100);
    }
}