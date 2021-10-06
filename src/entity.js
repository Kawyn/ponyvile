class Entity {

    _position;
    _size;

    _self;

    colliders = [];
    components = [];


    set name(name) {

        this._self.setAttribute('name', name);
    }

    get name() {

        return this._self.getAttribute('name');
    }

    set position(position) {

        this._self.style.left = position.x + 'px';
        this._self.style.top = position.y + 'px';

        this._position = position.clone();
    }

    get position() {

        return this._position.clone();
    }

    set size(size) {

        if (this._self) {

            this._self.style.width = size.x + 'px';
            this._self.style.height = size.y + 'px';
        }

        this._size = size.clone();
    }

    get size() {

        return this._size.clone();
    }

    set sprite(path) {
        if (path)
            this._self.style.backgroundImage = 'url(' + path + ')';
    }

    get sprite() {

        return this._self ? this._self.src : null;
    }

    // size, sprite, tags, colliders
    constructor (name, position = new Vector2(0, 0), size = new Vector2(50, 50), { ...kwargs } = {}) {

        this._self = document.createElement('div');
        this._self.style.position = 'absolute';

        this.name = name;
        this.position = position;
        this.size = size;

        this.sprite = kwargs.sprite;

        if (kwargs.tags)
            kwargs.tags.push('entity');
        else
            kwargs.tags = ['entity']

        this._self.setAttribute('class', kwargs.tags.join(' '))

        this.colliders = kwargs.colliders || [];
        for (const collider of this.colliders)
            collider.entity = this;

        document.body.appendChild(this._self);
        entities.push(this);
        this.flip();
    }

    flip(x = false, y = false) {
        this._self.style.transform = 'scale(' + (x ? -1 : 1) + ', ' + (y ? -1 : 1) + ')';
        return this;
    }

    refresh() { }


    destroy() {
        this._self.remove();
        // TODO:COLLIDERS DELETION
        entities.splice(entities.indexOf(this), 1);
    }
}

class Interface {


}

class Text extends Entity {

    #target;

    set text(text) {

        this._self.textContent = text;
    }

    get text() {

        return this._self.textContent;
    }

    constructor (position, size, text, { target = null } = {}) {
        super('text', position, size, {
            tags: ['text']
        });

        this.text = text;
        this.#target = target;
    }

    refresh() {

        if (this.#target)
            this.position = this.#target.position;
    }
}