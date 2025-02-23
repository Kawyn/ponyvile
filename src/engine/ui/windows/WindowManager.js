class WindowManager {

    #owner;

    /** @type {WindowBase[]} */ windows = []

    initialize(owner) {

        this.#owner = owner;

        for (const window of this.windows)
            window.initialize();
    }

    push(window) {

        this.windows.push(window);
    }

    /**
     * @param {String} name 
     * @returns 
     */
    windowByName(name) {

        for (const window of this.windows) {

            if (window.name === name)
                return window;
        }

        return null;
    }

    /**
     * @param {any} type 
     * @returns 
     */
    windowByType(type) {

        for (const window of this.windows) {

            if (window instanceof type)
                return window;
        }

        return null;
    }
}