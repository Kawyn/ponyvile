class CharacterController extends Component {

    #isMoving = false;
    /** @type {Number} */ speed = 300;

    /** @type {ObjectWithVelocity} */ #objectWithVelocity;
    /** @type {Renderable} */ #renderable;
    #transform;

    constructor(kit = {}) { super(kit); }

    onPostInitialize() {

        this.#objectWithVelocity = this.actor.GetComponentByType(ObjectWithVelocity);
        this.#renderable = this.actor.GetComponentByType(Renderable);
        this.#transform = this.actor.GetComponentByType(Transform);
    }

    onEnable() {

        Scene.Instance.TimeManager.addObjectToRefresh(this.onRefresh, 100);
    }
    prevX = 0;
    onRefresh = () => {

        const horizontal = Scene.Instance.InputManager.GetAxis('horizontal');
        const vertical = Scene.Instance.InputManager.GetAxis('vertical');

        let direction = new Vector(horizontal.value, -vertical.value);
        if (Scene.Instance.InputManager.pointer.down) {
            direction = Vector.sub(new Vector(...Scene.Instance.InputManager.pointer.position), Vector.sum(this.#transform.position.value, this.#transform.scale.value.scale(0.5)));

            if (direction.magnitude < 10)
                direction = Vector.zero
        }
        direction = direction.normalize();
        this.#objectWithVelocity.velocity.value.x = direction.x * this.speed;
        this.#objectWithVelocity.velocity.value.y = direction.y * this.speed;
        // same signs
        if (this.prevX * direction.x <= 0 && direction.x != 0)
            this.#renderable.flip(direction.x < 0);

        this.prevX = direction.x;
        this.#objectWithVelocity.velocity.callChangedNow();

        if ((direction.x || direction.y) && this.#isMoving == false) {
            this.actor.EventManager.riseEvent(VisualizationPriorityController.PUSH_STATE, { state: 'move', priority: 100 })
            this.#isMoving = true;

        }
        else if (direction.x === 0 && direction.y === 0 && this.#isMoving == true) {
            this.actor.EventManager.riseEvent(VisualizationPriorityController.REMOVE_STATE, { state: 'move', priority: 100 })
            this.#isMoving = false;
        }
    }

    onDisable() {

        Scene.Instance.TimeManager.removeObjectToRefresh(this.onRefresh);
    }
}