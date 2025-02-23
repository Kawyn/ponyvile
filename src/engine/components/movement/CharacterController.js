class CharacterController extends Component {

    speed = 30;
    #objectWithVelocity;

    /** @type {Transform} */ #transform;

    constructor(velocity) {
        super();

    }

    onPostInitialize() {

        this.#transform = this.actor.GetComponentByType(Transform);
        this.#objectWithVelocity = this.actor.GetComponentByType(ObjectWithVelocity);
    }

    onEnable() {
        document.addEventListener('keydown', data => {

            if (data.key !== ' ')
                return;

            // if (
            //   this.#objectWithVelocity.velocity.value[1] > 0.5
            //
            //    ) return;
            this.#objectWithVelocity.velocity.value[1] = 25;
            this.#objectWithVelocity.velocity.callChangedNow();


        });
        Scene.Instance.TimeManager.addObjectToRefresh(this);
    }

    onRefresh(deltaTime) {

        const horizontal = Scene.Instance.InputManager.GetAxis('horizontal');
        const vertical = Scene.Instance.InputManager.GetAxis('vertical');

        const deltaFront = this.#transform.front.map(
            v => v * this.speed * vertical.value);

        const deltaRight = this.#transform.right.map(
            v => v * this.speed * -horizontal.value);

        if (deltaFront.some(x => x != 0) || deltaRight.some(x => x != 0)) {

            let x = deltaFront.map((v, i) => v + deltaRight[i]);
            x[1] = this.#objectWithVelocity.velocity.value[1];

            this.#objectWithVelocity.velocity.value = x;
        }
        else {

            this.#objectWithVelocity.velocity.value[0] = 0;
            this.#objectWithVelocity.velocity.value[2] = 0;

            this.#objectWithVelocity.velocity.callChangedNow();
        }
    }

    onDisable() {

        Scene.Instance.TimeManager.removeObjectToRefresh(this);
    }
}