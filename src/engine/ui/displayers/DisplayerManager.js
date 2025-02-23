class DisplayerManager {

    /** @type {DisplayerBase[]} */ #displayers = []

    #state = false;

    initialize() {

        for (const displayer of this.#displayers)
            displayer.initialize();

        this.#state = 1;
    }

    push(displayer) {

        this.#displayers.push(displayer);

        if (this.#state)
            displayer.initialize();
    }

    clear() {

    }
}