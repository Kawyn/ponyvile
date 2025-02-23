class PriorityQueue {

    #items = [];

    get values() {
        return this.#items.map(x => x.value);
    }

    get length() {

        return this.#items.length;
    }

    constructor(items = []) {

        for (let item of items)
            this.push(item.value, item.priority);
    }

    push(value, priority) {

        let low = 0;
        let mid = 0;

        let high = this.#items.length;

        while (low < high) {

            mid = (low + high) >>> 1;

            if (priority < this.#items[mid])
                low = mid + 1;
            else
                high = mid;
        }

        this.#items.splice(low, 0, { value: value, priority: priority });
    }

    first() {

        if (this.#items.length === 0)
            return null;

        return this.#items[0].value;
    }

    pop() {
        return this.#items.shift();
    }

    remove(value, priority) {

        this.#items = this.#items.filter(x => x.value !== value || x.priority !== priority);
    }
}