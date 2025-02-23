class Avatar extends Component {

    /** @type {String} */ name;
    /** @type {String} */ src;

    constructor(kit = {}) {

        super(kit);

        this.name = kit.name;
        this.src = kit.src;
    }
}