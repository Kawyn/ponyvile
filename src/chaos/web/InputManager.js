class InputManager {

    #count = 0;

    pointer = {
        down: false,
        position: [0, 0]
    }
    keys = {};
    axes = {};
    points = {};
    constructor(timeManager) {

        this.axes['horizontal'] = new Axis('D', 'A');
        this.axes['vertical'] = new Axis('W', 'S');

        this.axes['mouse_x'] = new Axis();
        this.axes['mouse_y'] = new Axis();
        timeManager.addObjectToRefresh(this.onRefresh, 50);
        document.addEventListener('mousemove', data => {

            if (this.#count !== 0)
                return;

            this.axes['mouse_x'].value = data.movementX * 2;
            this.axes['mouse_y'].value = data.movementY * 2;

            this.pointer.position = [data.pageX, data.pageY];
        });

        document.addEventListener('mousedown', data => {
            if (this.#count !== 0)
                return;
            this.pointer.down = true;
        });
        document.addEventListener('mouseup', data => {
            if (this.#count !== 0)
                return;
            this.pointer.down = false;
        });

        document.addEventListener('keydown', data => {
            if (this.#count !== 0)
                return;

            if (this.keys[data.key.toUpperCase()] == 1)
                return;

            this.keys[data.key.toUpperCase()] = 1;

            for (let key in this.axes) {
                if (this.axes[key].positiveKey == data.key.toUpperCase())
                    this.axes[key].value++;

                if (this.axes[key].negaticeKey == data.key.toUpperCase())
                    this.axes[key].value--;
            }
        });

        document.addEventListener('keyup', data => {

            if (this.#count !== 0)
                return;

            this.keys[data.key.toUpperCase()] = 0;

            for (let key in this.axes) {
                if (this.axes[key].positiveKey == data.key.toUpperCase())
                    this.axes[key].value--;

                if (this.axes[key].negaticeKey == data.key.toUpperCase())
                    this.axes[key].value++;
            }
        });
    }

    waitForKey(key, action) {

        document.addEventListener('keydown', data => {

            if (this.#count !== 0)
                return;

            if (key.toUpperCase() !== data.key.toUpperCase())
                return;

            action();
        });
    }

    removeWaitForKey() {
        throw "implement this";
    }

    blockInput() {

        console.warn('[INPUT MANAGER] Block input');

        this.#count++;

        if (this.#count === 1) {

            this.pointer.down = false;

            this.axes['mouse_x'].value = 0;
            this.axes['mouse_y'].value = 0;

            for (let key in this.axes)
                this.axes[key].value = 0;
        }
    }

    unblockInput() {
        console.warn('[INPUT MANAGER] Unblock input');
        if (this.#count > 0)
            this.#count--;
    }
    GetAxis(name) {
        return this.axes[name];
    }

    onRefresh = () => {
        this.axes['mouse_x'].value = 0;
        this.axes['mouse_y'].value = 0;
    }
}

class Axis {

    positiveKey;
    negaticeKey;

    value = 0;
    constructor(positiveKey, negaticeKey) {
        this.positiveKey = positiveKey;
        this.negaticeKey = negaticeKey;
    }
}