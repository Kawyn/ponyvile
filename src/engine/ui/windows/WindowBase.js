class WindowContextBase { }

class WindowBase {

    static IS_VISIBLE_ATTRIBUTE_NAME = 'is-visible';


    /** @type {Boolean} */ #visible = false;
    get visible() { return this.#visible; }

    /** @type {String} */ #name;
    get name() { return this.#name; }

    /** @type {String} */ #selector;

    /** @type {HTMLElement} */ _window;

    /** @type {WindowContextBase} */ _context;


    /**
     * @param {String} name 
     * @param {String} selector 
     */
    constructor(name, selector) {

        this.#name = name;
        this.#selector = selector;
    }

    initialize() {

        this._window = document.querySelector(this.#selector);
    }

    /**
     * @param {WindowContextBase} context 
     */
    show(context) {

        this._context = context;

        this.#visible = true;
        this._window.setAttribute(WindowBase.IS_VISIBLE_ATTRIBUTE_NAME, 'true');
    }

    hide() {

        this._context = null;

        this.#visible = false;
        this._window.setAttribute(WindowBase.IS_VISIBLE_ATTRIBUTE_NAME, 'false');
    }
}