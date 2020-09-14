new Node(new Vector2(1000, 1000));
new Node(new Vector2(1250, 4000), [nodes[0]]);
new Node(new Vector2(5000, 4000), [nodes[1]]);
new Node(new Vector2(5000, 600), [nodes[0]]);


const scene = {
    gameObjects: [
    ],
}



const player = new GameObject('Princes Luna',
    new Transform(new Vector2(0, 0)),
    [new Collider2D(new Vector2(0, 0), new Vector2(100, 100))],
    [
        'images/princessLuna_idle.gif',
        'images/princessLuna_trotting.gif',
        'images/princessLuna_flying.gif',
    ]
);

let hint = document.getElementById('hint');
hint.style.display = 'none';
let action = undefined;
const ss = new GameObject('Sunset Shimmer',
    new Transform(new Vector2(250, 250), new Vector2(1, 1)),
    /* Colliders2D */[

        new Collider2D(new Vector2(-50, -50), new Vector2(226, 216), {
            onEnter:

                function () {
                    hint.style.display = 'block';
                    action = () => {
                        dialogues.Start(ss);
                    };
                },
            onExit:
                function () {
                    hint.style.display = 'none';
                    action = undefined;
                }
        }),
    ],
    ['images/octavia_idle.gif', 'images/octavia_trotting.gif'], {
    onRefresh:
        function (a) {

            if (!a.hasOwnProperty('path')) {
                a.path = [nodes[0]];
                a.index = 0;
            }



            if (a.path.length !== 0) {

                if (Vectors.Distance(Vectors.Sum(a.transform.position, new Vector2(a.sprite.width / 2, a.sprite.height / 2)), a.path[a.index].position) <= 2) {
                    a.last = a.path.shift();
                    a.wait = 5;
                }
                else {
                    a.Move(new Vector2(100 * Time.deltaTime * (a.path[a.index].position.x - a.transform.position.x - a.sprite.width / 2), 100 * Time.deltaTime * (a.path[a.index].position.y - a.transform.position.y - a.sprite.height / 2)), 150);
                }
            }
            else {

                if (a.wait < 0) {
                    let start = a.last;
                    let destination = nodes[Math.floor(Math.random() * nodes.length)];

                    console.log(start, destination);
                    if (start.position == destination.position) {
                        return;
                    }
                    a.path = Nodes.Trace(start, destination);
                }
                else {
                    a.wait -= Time.deltaTime;

                    if (!a.sprite.src.includes(a.animations[0])) {
                        a.sprite.src = a.animations[0];
                    }
                }
            }
        }
}

);

ss.dialogue = {
    default: {
        index: 0,
        avatar: './images/Avatars/sunsetShimmer.png'
    },
    colors: {
        prime: '#A11137',
        secondary: '#E1464A'
    },
    quotes: [
        new Quote('Siema Anon!', [-2]),
        new Quote('exit', [0], function () { dialogues.Close() }),
        new Quote('Co u ciebie?', [0, 1]),
        new Quote('O nie! Co się stało?', [-1]),
        new Quote('To super! Szkoda, że u mnie tak nie jest...', [-1]),
    ],
    answers: [
        new Answer('Ach... szkoda gadać', 3),
        new Answer('Wszystko super!', 4),
    ]
};
let offset = new Vector2((window.innerWidth - player.sprite.width) / 2, (window.innerHeight - player.sprite.height) / 2);


new GameObject('House_0',
    new Transform(new Vector2(1000, 100), new Vector2(2, 2)),
    [
        new Collider2D(new Vector2(0, 0), new Vector2(50, 100)),
        new Collider2D(0, 0, {
            onEnter: function () {
                player.self.style.zIndex = -1;
            },
            onExit: function () {
                player.self.style.zIndex = 11;
            }
        })
    ],
    ['./images/environment/house.gif'], {

    onStart: function (a) {

        // Calculate Boxes...
        a.colliders[0].size.x = a.sprite.width * 0.6;
        a.colliders[0].offset.x = a.sprite.width * 0.2;
        a.colliders[0].offset.y = a.sprite.height * 0.7;

        a.colliders[1].size.x = a.sprite.width;
        a.colliders[1].offset.y = a.sprite.height * 0.1;
        a.colliders[1].size.y = a.sprite.height * 0.7;
    }
});


var pause = false;

const Refresh = setInterval(() => {


    if (!pause) {


        if (axis.x != 0 || axis.y != 0) {
            if (sprint) {
                player.Move(new Vector2(100 * Time.deltaTime * axis.x, 100 * Time.deltaTime * axis.y), 250);
            }
            else
                player.Move(new Vector2(100 * Time.deltaTime * axis.x, 100 * Time.deltaTime * axis.y), 150);

        } else {
            if (player.sprite.src.includes(player.animations[1]) || player.sprite.src.includes(player.animations[2])) {
                player.sprite.src = player.animations[0];
            }
        }
        scene.gameObjects.forEach(gameObject => {
            if (gameObject.onRefresh) {
                gameObject.onRefresh(gameObject);
            }
        });
        // Collision

        scene.gameObjects.forEach(gameObject => {

            if (gameObject == player)
                return;

            gameObject.colliders.forEach(collider => {

                const c1 = {
                    offset: Vectors.Sum(player.transform.position, player.colliders[0].offset),
                    size: player.colliders[0].size
                };
                const c2 = {
                    offset: Vectors.Sum(gameObject.transform.position, collider.offset),
                    size: collider.size
                };

                // If collide...
                if (Colliders.IsCollide(c1, c2)) {

                    if (!collider.collide) {

                        collider.collide = true;

                        if (collider.onEnter !== undefined)
                            collider.onEnter(gameObject);
                    }
                }

                // If no collide...
                else {

                    if (collider.collide) {

                        collider.collide = false;

                        if (collider.onExit !== undefined)
                            collider.onExit(gameObject);
                    }
                }
            })
        });





        // Camera...
        let camera = Vectors.Sub(player.transform.position, offset);

        window.scrollTo(camera.x, camera.y);
    }

    // Time...
    Time.deltaTime = (new Date().getTime() - Time.time) / 1000;
    Time.time = new Date().getTime();
}, 0);






let dname = document.getElementById('quote_author');
let dcontetnt = document.getElementById('quote_content');
let dquote = document.getElementById('quote');
let davatar = document.getElementById('interlocutor');
let danswers = document.getElementsByClassName('_answers');

player.self.style.zIndex = 10;