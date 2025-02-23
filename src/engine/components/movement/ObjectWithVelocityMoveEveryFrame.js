class ObjectWithVelocityMoveEveryFrame extends Component {

    #objectWithVelocity;
    #transform;

    onPostInitialize() {

        this.#objectWithVelocity = this.actor.GetComponentByType(ObjectWithVelocity);
        this.#transform = this.actor.GetComponentByType(Transform);

    }

    onEnable() {
        Scene.Instance.TimeManager.addObjectToRefresh(this.onRefresh, 10000);

    }
    onRefresh = (deltaTime) => {

        this.#transform.position.value = Vector.sum(this.#transform.position.value, this.#objectWithVelocity.velocity.value.scale(deltaTime));
    }

    onDisable() {
        Scene.Instance.TimeManager.removeObjectToRefresh(this.onRefresh, 10000);

    }
}