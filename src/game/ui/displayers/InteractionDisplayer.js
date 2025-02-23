class InteractionDisplayer extends DisplayerBase {

    static CONTENT_ELEMENT_SELECTOR = '.content';

    static KEY_ELEMENT_SELECTOR = '.interaction-displayer-key';
    static TEXT_ELEMENT_SELECTOR = '.interaction-displayer-text';


    /** @type {String} */ #target;

    /** @type {InteractionState} */ #state;

    /** @type {HTMLElement} */ _content;

    /** @type {HTMLElement} */ _key;
    /** @type {HTMLElement} */ _text;


    onInteractableChanged = (value) => {

        if (value) {
            this._content.setAttribute(DisplayerBase.IS_VISIBLE_ATTRIBUTE_NAME, 'true');

            this._displayer.textContent = `Press F to interact with ${value.name}`;

        } else {
            this._content.setAttribute(DisplayerBase.IS_VISIBLE_ATTRIBUTE_NAME, 'false');

            this._displayer.textContent = '';

        }
    }


    /**
     * @param {String} name 
     * @param {String} selector 
     * @param {Boolean} visible 
     * @param {String} target 
     */
    constructor(name, selector, visible, target) {

        super(name, selector, visible);

        this.#target = target;
    }


    initialize() {

        super.initialize();

        this._content = this._displayer.querySelector(InteractionDisplayer.CONTENT_ELEMENT_SELECTOR);

        this._key = this._displayer.querySelector(InteractionDisplayer.KEY_ELEMENT_SELECTOR);
        this._text = this._displayer.querySelector(InteractionDisplayer.TEXT_ELEMENT_SELECTOR);

        const target = Scene.Instance.GetActorByIdentifier(this.#target);
        this.#state = target.GetComponentByType(InteractionState);

        this.#state.interactable.addChangeListener(this.onInteractableChanged);
    }
}