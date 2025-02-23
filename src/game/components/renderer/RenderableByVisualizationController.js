class RenderableByVisualizationController extends Component {

    /**  */ #visualization;
    #renderable;

    onStateChanged = value => {

        this.#renderable.src = this.states[value];
    }

    onPostInitialize() {

        this.#visualization = this.actor.GetComponentByType(Visualization);

        this.#renderable = this.actor.GetComponentByType(Renderable);
    }

    onEnable() {

        this.#visualization.state.addChangeListener(this.onStateChanged);
    }

    onDisable() {

        this.#visualization.state.removeChangeListener(this.onStateChanged);
    }
}