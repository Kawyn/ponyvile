class Interactable extends Component {

    /** @type {Number} */ priority;


    constructor(kit = {}) {

        super(kit);

        this.priority = kit.priority ?? 0;
    }


    interact(owner) {

        this.actor.EventManager.riseEvent(InteractionEventNames.INTERACT, owner);
    }
}