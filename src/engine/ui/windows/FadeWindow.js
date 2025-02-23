class FadeWindowContext extends WindowContextBase {

    /** @type {number} */ time;

    /**
     * @param {number} time 
     */
    constructor(time) {

        super();

        this.time = time;
    }
}


class FadeWindow extends WindowBase {

    /**
     * @param {DialogueWindowContext} context 
     */
    show(context) {

        super.show(context);

        Scene.Instance.InputManager.blockInput();

        Scene.Instance.TimeManager.refreshAfterTime(() => this.hide(), context.time);
    }

    hide() {

        super.hide();

        Scene.Instance.InputManager.unblockInput();
    }
}