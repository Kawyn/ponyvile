class CameraController extends Component {

    cameraIdentifier = 'camera';
    #sensitivity = 100;
    pitchMinValue = -89;
    pitchMaxValue = 89;

    /** @type {Transform} */ #transform;
    /** @type {Transform} */ #cameraTransform;

    constructor(cameraIdentifier = 'main') {
        super();

        this.cameraIdentifier = cameraIdentifier;
    }

    onPostInitialize() {

        this.horizontal = Scene.Instance.InputManager.GetAxis('mouse_x');
        this.vertical = Scene.Instance.InputManager.GetAxis('mouse_y');

        this.#transform = this.actor.GetComponentByType(Transform);

        const cameraObject = Scene.Instance.GetActorByIdentifier(this.cameraIdentifier);
        this.#cameraTransform = cameraObject.GetComponentByType(Transform);

    }

    onEnable() {

        this.#sensitivity = Settings.GetValueAsString(Settings.MOUSE_SENSITIVITY) ?? 10;

        Scene.Instance.TimeManager.addObjectToRefresh(this);
        Settings.EventManager.addEventListener(Settings.ON_VALUE_CHANGED, this.onEventCame);
    }

    onRefresh(deltaTime) {

        const deltaX = - this.vertical.value * deltaTime * this.#sensitivity / 10;
        const deltaY = - this.horizontal.value * deltaTime * this.#sensitivity / 10;
        if (deltaY != 0) {

            let newX = this.#cameraTransform.rotation.value[0] + deltaX;
            if (newX < this.pitchMinValue)
                newX = this.pitchMinValue;
            else if (newX > this.pitchMaxValue)
                newX = this.pitchMaxValue;

            if (this.#cameraTransform.rotation.value[0] !== newX) {

                this.#cameraTransform.rotation.value[0] = newX;
                this.#cameraTransform.rotation.callChangedNow();
            }
        }
        if (deltaX != 0) {

            this.#transform.rotation.value[1] += deltaY;
            this.#transform.rotation.callChangedNow();
        }
    }

    onEventCame = (eventName, data) => {

        if (data === Settings.MOUSE_SENSITIVITY)
            this.#sensitivity = Settings.GetValueAsString(Settings.MOUSE_SENSITIVITY);
    }

    onDisable() {

        Scene.Instance.TimeManager.removeObjectToRefresh(this);
        Settings.EventManager.removeEventListener(Settings.ON_VALUE_CHANGED, this.onEventCame);
    }
}