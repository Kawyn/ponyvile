class Rigidbody extends Component {

    /** @type {'static'|'dynamic'} */
    #type;

    elasticity = 0.9;
    #collider;
    get type() { return this.#type; }
    #mass;

    #velocity;

    constructor(kit) {

        super({});
        this.#type = kit.type;
        delete kit.type;

        this.offset = kit.offset instanceof Vector ? kit.offset.clone() : new Vector(0, 0);
        this.size = kit.size instanceof Vector ? kit.size.clone() : new Vector(1, 1);

        this.trigger = kit.trigger instanceof Boolean ? kit.trigger : false;
    }

    onPostInitialize() {
        super.onPostInitialize();

        this.#collider = this.actor.GetComponentByType(BoxCollider);
        this.#velocity = this.actor.GetComponentByType(ObjectWithVelocity);

    }
    onEnable() {

        if (this.#type === 'dynamic')
            this.actor.EventManager.addEventListener(PhysicEventNames.ON_COLLISION_ENTER, this.onEnter);
    }

    onEnter = (eventName, data) => {

    }

    static types = {
        STATIC: 'static',
        DYNAMIC: 'dynamic',
    }
}