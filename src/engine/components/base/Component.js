class Component {

    /** @type {string} */ #identifier;
    get identifier() { return this.#identifier };

    /** @type {Actor} */ #actor;
    get actor() { return this.#actor }

    /** @type {boolean} */
    #active = true;

    get active() { return this.#active; }
    set active(value) {

        if (value != this.#active) {

            this.#active = value;

            if (value)
                this.onEnable();
            else
                this.onDisable();
        }
    }

    constructor(data) {

        if (!data)
            return;

        for (const key of Object.keys(data))
            this[key] = data[key];

        if (!this.#identifier)
            this.#identifier = crypto.randomUUID();
    }

    /**
     * @param {Actor} actor 
     */
    onInitialize(actor) {

        this.#actor = actor;
    }

    onPostInitialize() { }

    onEnable() { }
    onDisable() { }

    onDestroy() { delete this; }
}