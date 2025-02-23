class ActionOnActorEvent extends Component {

    /** @type {String} */ #eventName;

    /** @type {Function} */ #action;


    onEventCame = (eventName, data) => {

        this.#action(this.actor, { eventName, data });
    }


    constructor(kit = {}) {

        super({});

        this.#eventName = kit.eventName;
        this.#action = kit.action;
    }


    onEnable() {

        this.actor.EventManager.addEventListener(this.#eventName, this.onEventCame);

    }

    onDisable() {

        this.actor.EventManager.removeEventListener(this.#eventName, this.onEventCame);
    }
}