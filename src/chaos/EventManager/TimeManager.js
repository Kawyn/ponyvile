class TimeManager {

    static DEFAULT_PRIORITY = 100;

    #objectsToRefresh = {};

    #prioritiesCache = [];

    #interval;

    #time;
    #deltaTime = 0;

    #currentFrame;
    #nextFrame;

    start() {

        this.#time = Date.now();
        this.#interval = setInterval(() => { this.refresh() }, 1000 / 60);
    }

    #afterTime = [];
    refreshAfterTime(func, time) {

        this.#afterTime.push({ action: func, time: this.#time + time * 1000 });
    }

    addObjectToRefresh(func, priority = TimeManager.DEFAULT_PRIORITY) {

        if (!this.#objectsToRefresh[priority])
            this.#objectsToRefresh[priority] = [];

        this.#objectsToRefresh[priority].push(func);

        if (!this.#prioritiesCache.includes(priority)) {

            this.#prioritiesCache.push(priority);
            this.#prioritiesCache.sort((a, b) => a - b);
        }
    }

    removeObjectToRefresh(func) {

        for (const priority in this.#objectsToRefresh) {

            const index = this.#objectsToRefresh[priority].indexOf(func);

            if (index !== -1) {

                this.#objectsToRefresh[priority].splice(index, 1);

                if (this.#objectsToRefresh[priority].length === 0) {

                    delete this.#objectsToRefresh[priority];
                    this.#prioritiesCache = this.#prioritiesCache.filter(p => p !== Number(priority));
                }

                break;
            }
        }
    }

    refresh() {

        const currentTime = Date.now();
        this.#deltaTime = (currentTime - this.#time) / 1000;

        this.#time = currentTime;

        for (const priority of this.#prioritiesCache) {

            for (const func of this.#objectsToRefresh[priority])
                func(this.#deltaTime);
        }

        for (let i = this.#afterTime.length - 1; i >= 0; i--) {

            if (this.#afterTime[i].time < this.#time) {

                this.#afterTime[i].action();
                this.#afterTime.splice(i, 1);
            }
        }
    }

    stop() {
        clearInterval(this.#interval);
    }
}