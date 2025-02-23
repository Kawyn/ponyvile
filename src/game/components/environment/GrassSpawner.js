class GrassSpawner extends Component {

    src = "images/environment/grass/1.png"
    cellSize = 500;

    constructor(kit = {}) {
        super(kit);
    }

    onPostInitialize() {

        const random = new LCG(120);

        for (let x = 0; x < window.document.body.clientWidth; x += this.cellSize) {
            for (let y = 0; y < window.document.body.clientHeight; y += this.cellSize) {

                const position = Vector.sum(
                    new Vector(x, y),
                    new Vector(random.random(), random.random()).scale(this.cellSize)
                );

                const grass = this.createGrass(position, `images/environment/grass/${Math.floor(random.range(1, 18))}.png`);
                grass.parent = this.actor;

                Scene.Instance.PushActor(grass);
            }
        }
    }

    /**
     * @param {Vector} position 
     * @param {string} src 
     * @returns {Actor}
     */
    createGrass(position, src) {

        return new Actor(`grass_${position.toString()}`, [

            new Transform({ position: position }),
            new Renderable({ sprite: src, classes: 'environment-floor' })
        ]);
    }
}