class LCG {

    constructor(seed = Date.now()) {

        this.seed = seed;
    }

    random() {

        const a = 1664525;
        const c = 1013904223;

        const m = 2 ** 32;

        this.seed = (a * this.seed + c) % m;

        return this.seed / m;
    }

    /**
     * 
     * @param {number} min - include
     * @param {number} max - exclude
     * @returns 
     */
    range(min, max) {

        return min + this.random() * (max - min);
    }
}
