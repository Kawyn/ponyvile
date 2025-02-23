class DisplayerBase {

    static IS_VISIBLE_ATTRIBUTE_NAME = 'is-visible';


    /** @type {boolean} */ #visible = false;
    get visible() { return this.#visible; }

    /** @type {string} */ #name;
    get name() { return this.#name; }

    /** @type {string} */ #selector;

    /** @type {HTMLElement} */ _displayer;


    /**
     * @param {string} name 
     * @param {string} selector 
     */
    constructor(name, selector, visible) {

        this.#name = name;
        this.#selector = selector;

        this.#visible = visible;
    }


    initialize() {

        this._displayer = document.querySelector(this.#selector);
    }

    clear() {

    }
}