class InteractOnKeyPress extends Component {

    /** @type {InteractionState} */ #state;


    onKeyDown = () => {

        this.#state.interactable.value?.interact(this.actor);
    }


    constructor(kit) {

        super(kit);

        this.key = kit.key;
    }


    onPostInitialize() {

        this.#state = this.actor.GetComponentByType(InteractionState);
    }

    onEnable() {

        Scene.Instance.InputManager.waitForKey(this.key, this.onKeyDown);
    }

    onDisable() {

        Scene.Instance.InputManager.removeWaitForKey(this.key, this.onKeyDown);
    }
}