class Visualization extends Component {

    /** @type {DynamicValue} */ state = new DynamicValue();

    constructor(kit = {}) {

        super(kit);

        this.state.value = kit.state || '';
    }
}