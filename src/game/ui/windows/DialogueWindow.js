class DialogueWindowContext extends WindowContextBase {

    characters = {};

    /**
     * 
     * @param {any} characters 
     * @param {Dialogue.Root} dialogue 
     */
    constructor(characters, dialogue, context = {}) {

        super();

        this.characters = characters;
        this.dialogue = dialogue;

        this.context = context;
    }
}


class DialogueWindow extends WindowBase {

    static NAME_ELEMENT_SELECTOR = '.dialogue-window-name';
    static TEXT_ELEMENT_SELECTOR = '.dialogue-window-text';

    static LEFT_CHARACTER_SELECTOR = '.dialogue-window-character-left';
    static RIGHT_CHARACTER_SELECTOR = '.dialogue-window-character-right';

    static CHARACTER_HIGHLIGHT_ATTRIBUTE_NAME = 'highlight';

    _name;
    _text;

    _left;
    _right;

    currentShownCharacters = {};

    initialize() {

        super.initialize();

        this._name = this._window.querySelector(DialogueWindow.NAME_ELEMENT_SELECTOR);
        this._text = this._window.querySelector(DialogueWindow.TEXT_ELEMENT_SELECTOR);

        this._left = this._window.querySelector(DialogueWindow.LEFT_CHARACTER_SELECTOR);
        this._right = this._window.querySelector(DialogueWindow.RIGHT_CHARACTER_SELECTOR);

        this._window.onclick = () => this.next();
    }

    /**
     * @param {DialogueWindowContext} context 
     */
    show(context) {

        Scene.Instance.InputManager.blockInput();
        super.show(context);

        const data = this._context.dialogue.data(this._context.context);

        if (this.evaluate(data))
            return;

        this.next();
    }

    next() {

        if (!this.visible)
            return;

        while (true) {

            const done = this._context.dialogue.next(this._context.context);

            if (done) {

                this.hide();
                return;
            }

            const data = this._context.dialogue.data(this._context.context);

            if (this.evaluate(data))
                break;
        }
    }

    evaluate(data) {

        if (data.type === 'text') {

            this._name.innerText = data.data.name;
            this._text.innerText = data.data.text;

            for (const character of Object.values(this.currentShownCharacters))
                character.setAttribute(DialogueWindow.CHARACTER_HIGHLIGHT_ATTRIBUTE_NAME, 'false');

            this.currentShownCharacters[data.data.name]?.setAttribute(DialogueWindow.CHARACTER_HIGHLIGHT_ATTRIBUTE_NAME, 'true');
        }

        else if (data.type === 'character') {

            const character = this._context.characters[data.data.name];
            const position = `_${data.data.position}`;

            this[position].src = character.src;
            this[position].setAttribute(DialogueWindow.CHARACTER_HIGHLIGHT_ATTRIBUTE_NAME, 'false');

            this.currentShownCharacters[data.data.name] = this[position];

            return false;
        }

        return true;
    }

    hide() {

        this._context.dialogue.clear();

        super.hide();

        Scene.Instance.InputManager.unblockInput();
    }
}