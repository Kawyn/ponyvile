class Actor {

    /** @type {string} */ #identifier;
    get identifier() { return this.#identifier; }

    active = true;
    /** @type {Actor} */ #parent;

    get parent() { return this.#parent; }
    set parent(value) {

        if (value === this.#parent)
            return;

        if (this.#parent)
            this.EventManager.riseEvent(ActorEvents.ON_PARENT_REMOVED, this.parent);

        this.#parent = value;

        this.EventManager.riseEvent(ActorEvents.ON_PARENT_SET, this.parent);
    }

    /** @type {Actor[]} */ children;

    /** @type {EventManager} */ EventManager = new EventManager();

    /** @type {Component[]} */ #components = [];

    constructor(identifier = '', components = []) {

        this.#identifier = identifier;
        this.#components = components;
    }


    onInitialize() {

        for (const component of this.#components)
            component.onInitialize(this);
    }

    onPostInitialize() {

        for (const component of this.#components)
            component.onPostInitialize();
    }

    onEnable() {
        for (const component of this.#components)
            component.onEnable();
    }

    /**
     * @template {T}
     * @param {T} constructor 
     * @returns {T}
     */
    GetComponentByType(constructor) {

        for (let i = 0; i < this.#components.length; ++i) {

            if (this.#components[i] instanceof constructor)
                return this.#components[i];
        }

        return null;
    }

    GetCompnentsByType(constructor) {

        return this.#components.filter(x => x instanceof constructor);
    }

    onDisable() {

        if (!this.active)
            return;

        for (const component of this.#components)
            component.onDisable();

    }

    onDestroy() {

        for (const component of this.#components)
            component.onDestroy();
    }

    destroy() {

        Scene.Instance.RemoveActor(this);

    }
}