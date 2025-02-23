class DynamicValue {

    #value;
    #funcs = [];

    get value() { return this.#value; }

    set value(value) {

        if (this.#value !== value) {

            this.#value = value;
            this.callChangedNow();
        }
    }

    constructor(value) {

        this.value = value;
    }

    /**
     * @param {Function} func 
     * @param {Boolean} callInstantly 
     */
    addChangeListener(func, callInstantly = true) {

        this.#funcs.push(func);

        if (callInstantly)
            func(this.value);
    }

    /**
     * @param {Function} func 
     */
    removeChangeListener(func) {

        const index = this.#funcs.indexOf(func);

        if (index === -1) {

            console.error(`Trying to remove function which never was added? (func: ${func})`);
            return;
        }

        this.#funcs.splice(index, 1);
    }

    callChangedNow() {

        for (const func of this.#funcs)
            func(this.#value);
    }
}