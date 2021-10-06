class Collider {

    #entity;

    _size;
    _offset;

    active;
    trigger;

    _collisions = [];

    _self;

    set entity(entity) {

        if (this.size.x === 0 && this.size.y === 0)
            this.size = entity.size;

        this.#entity = entity;
    }

    get entity() {

        return this.#entity;
    }

    set size(size) {

        this._size = size.clone();
    }

    get size() {

        return this._size.clone();
    }

    set offset(offset) {

        this._offset = offset.clone();
    }

    get offset() {

        return this._offset.clone();
    }

    get position() {

        return new Vector2(this.entity.position.x + this.offset.x, this.entity.position.y + this.offset.y);
    }

    constructor ({ size = new Vector2(0, 0), offset = new Vector2(0, 0), trigger = false, active = true, onEnter = null, onExit = null, onStay = null } = {}) {

        this.offset = offset || new Vector2(0, 0);
        this.size = size || new Vector2(0, 0);

        this.trigger = trigger === undefined ? false : trigger;
        this.active = active === undefined ? true : active;


        if (typeof onEnter === 'function')
            this.onEnter = onEnter;

        if (typeof onExit === 'function')
            this.onExit = onExit;

        if (typeof onStay === 'function')
            this.onStay = onStay;

        if (debug) {

            this._self = new Entity('box-collider', new Vector2(0, 0), this.size);

            window.addEventListener('refresh', () => {

                this._self.position = this.position;
                this._self.size = this.size.substract(new Vector2(1, 1));

                this._self._self.style.borderColor = this._collisions.length > 0 ? 'red' : 'greenyellow'

                if (!this.active)
                    this._self._self.style.borderColor = 'gray'
            });
        }
    }

    onEnter(collider) { }
    onExit(collider) { }

    onStay(collider) { }
}