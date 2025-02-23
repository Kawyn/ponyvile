class VisualizationPriorityController extends Component {

    static PUSH_STATE = 'PUSH_STATE';
    static REMOVE_STATE = 'REMOVE_STATE';

    /** @type {Visualization} */ #visualization;

    /** @type {PriorityQueue} */ #queue;

    pushState = (eventName, data) => {

        this.#queue.push(data.state, data.priority);
        this.#visualization.state.value = this.#queue.first();
    }

    removeState = (eventName, data) => {

        this.#queue.remove(data.state, data.priority);
        this.#visualization.state.value = this.#queue.first();
    }

    constructor(kit = {}) {

        super(kit);

        this.#queue = new PriorityQueue(kit.state ? [kit.state] : [], PriorityQueue.PRIORITY_SELECTOR);
    }

    onInitialize(actor) {

        super.onInitialize(actor);

        this.actor.EventManager.addEventListener(VisualizationPriorityController.PUSH_STATE, this.pushState);
        this.actor.EventManager.addEventListener(VisualizationPriorityController.REMOVE_STATE, this.removeState);
    }

    onPostInitialize() {

        this.#visualization = this.actor.GetComponentByType(Visualization);
        this.#visualization.state.value = this.#queue.first();
    }
}

