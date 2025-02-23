class InteractionByTriggerController extends Component {

    /** @type {InteractionState} */ #state;

    /** @type {PriorityQueue} */ #queue = new PriorityQueue();


    onTriggerEnter = (eventName, data) => {

        if (data instanceof Collider === false)
            return;

        const interactable = data.actor.GetComponentByType(Interactable);

        if (!interactable)
            return;

        this.#queue.push(interactable, interactable.priority);

        if (this.active)
            this.#state.interactable.value = this.#queue.first();
    }

    onTriggerExit = (eventName, data) => {

        if (data instanceof Collider === false)
            return;

        const interactable = data.actor.GetComponentByType(Interactable);

        if (!interactable)
            return;

        this.#queue.remove(interactable, interactable.priority);

        if (this.active)
            this.#state.interactable.value = this.#queue.first();
    }


    onPostInitialize() {

        this.#state = this.actor.GetComponentByType(InteractionState);

        this.actor.EventManager.addEventListener(PhysicEventNames.ON_COLLISION_ENTER, this.onTriggerEnter);
        this.actor.EventManager.addEventListener(PhysicEventNames.ON_COLLISION_EXIT, this.onTriggerExit);
    }

    onEnable() {

        this.#state.interactable.value = this.#queue.first();
    }

    onDisable() {

        this.#state.interactable.value = null;
    }
}