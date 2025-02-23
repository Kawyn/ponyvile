
const exampleDialogue = new Dialogue.Root(
    [
        new Dialogue.Character('andrzej', 'left'),

        new Dialogue.Text('andrzej', 'raz dwa trzy, test'),
        new Dialogue.Text('andrzej', 'raz dwa trzy, test'),
        new Dialogue.Text('andrzej', 'raz dwa trzy, test'),
        new Dialogue.Text('andrzej', 'aaa dwa trzy, test'),
        new Dialogue.Character('xyz', 'right'),
        new Dialogue.Text('xyz', 'bbb dwa trzy, test'),
        new Dialogue.Text('andrzej', 'ccc dwa trzy, test'),
    ]
);
const dialogueWindow = new DialogueWindow('DialogueWindow', '#dialogue-window');
dialogueWindow.initialize();
dialogueWindow.show(new DialogueWindowContext({ andrzej: { src: './images/Avatars/vinylScratch.png' }, xyz: { src: './images/Avatars/twilightSparkle.png' } }, exampleDialogue));

const fadeWindow = new FadeWindow('FadeWindow', '#fade-window');
const camera = new Actor('camera', [new CameraController({ target: 'player' })]);
Scene.Instance.WindowManager.push(fadeWindow);
let physic = new Actor('physic_controller', [
    new PhysicController(),
]);

let sunsetShimmer = new Actor('player', [

    new Transform({ scale: new Vector(100, 100) }),
    new Renderable({ classes: 'non-selectable' }),

    new Rigidbody({ type: Rigidbody.types.DYNAMIC }),
    new CharacterController(),
    new BoxCollider({ size: new Vector(100, 100) }),

    new ObjectWithVelocity(),
    new ObjectWithVelocityMoveEveryFrame(),

    new Visualization(),
    new VisualizationPriorityController({ state: { value: 'idle', priority: 0 } }),

    new RenderableByVisualizationController({
        states: {
            idle: './images/sunsetShimmer_idle.gif',
            move: './images/sunsetShimmer_trotting.gif',
        }
    }),

    new InteractionState(),
    new InteractionByTriggerController(),

    new InteractOnKeyPress({ key: 'f' }),

]);

let box = new Actor('box', [

    new Transform({ position: new Vector(200, 200), scale: new Vector(200, 100) }),
    new Renderable({ classes: 'box-collider' }),

    new BoxCollider({ trigger: true }),

    new Interactable({ priority: 20 }),

    new ActionOnActorEvent({
        eventName: InteractionEventNames.INTERACT, action: () =>
            dialogueWindow.show(
                new DialogueWindowContext({
                    andrzej: { src: './images/Avatars/vinylScratch.png' },
                    xyz: { src: './images/Avatars/twilightSparkle.png' }
                }, exampleDialogue))
    })
]);
let boxe = new Actor('boxe', [
    new Transform({ position: new Vector(200, 400), size: new Vector(500, 100) }),
    new Renderable({ classes: 'box-collider' }),
    new BoxCollider({ size: new Vector(500, 100) }),
    new GrassSpawner({})
]);

const interactionDisplayer = new InteractionDisplayer('interaction_displayer', '#interaction-displayer', true, 'player');
Scene.Instance.DisplayerManager.push(interactionDisplayer);

Scene.Instance.actors = [camera, physic, boxe, box, sunsetShimmer],
    Scene.Instance.Start();
fadeWindow.show(new FadeWindowContext(1));
