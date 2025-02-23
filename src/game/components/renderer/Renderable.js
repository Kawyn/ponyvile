class Renderable extends Component {

    #element;
    #image;

    get src() {
        return this.#image.src;

    }
    set src(value) {
        this.#image.src = value;
    }
	/** @type {Transform} */ #transform;
    get transform() { return this.#transform; }

    /** @type {Mesh} */ mesh;
	/** @type {Material} */ material;

    onPositionChanged = value => {

        this.#element.style.left = value.x + 'px';
        this.#element.style.top = value.y + 'px';
    }

    // src, classes
    constructor(kit = {}) {

        super(kit);
    }

    onPostInitialize() {
        this.#transform = this.actor.GetComponentByType(Transform);

        this.#element = this.createElement();
        document.querySelector("#scene").appendChild(this.#element);

    }

    flip(x, y) {
        this.#element.style.transform = 'scale(' + (x ? -1 : 1) + ', ' + (y ? -1 : 1) + ')';

    }
    createElement() {

        let element = document.createElement('div');
        element.className = this.classes;
        element.style.position = 'absolute';
        element.style.width = this.#transform.scale.value.x + 'px';
        element.style.height = this.#transform.scale.value.y + 'px';

        let image = new Image();
        image.src = this.sprite;
        image.style.left = '50%';
        image.style.top = '50%';
        image.style.position = 'absolute';
        image.style.transform = 'translate(-50%, -50%)';

        this.#image = image;
        element.appendChild(image);




        element.style.display = 'none';

        return element;
    }

    onEnable() {

        this.#transform.position.addChangeListener(this.onPositionChanged);
        this.#element.style.display = 'block';
    }


    onDisable() {

        this.#transform.position.removeChangeListener(this.onPositionChanged);
        this.#element.style.display = 'none';
    }
}