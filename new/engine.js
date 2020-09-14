class GameObject {

    constructor(name = 'new GameObject', transform = new Transform(), colliders = [], animations = undefined, { onStart, onRefresh } = { undefined, undefined }) {

        this.self = document.createElement('div');

        this.self.setAttribute('class', 'GameObject');
        this.self.setAttribute('name', name);

        document.body.append(this.self);


        this.name = name;


        if (!transform || !(transform instanceof Transform))
            transform = new Transform();

        this.transform = transform;


        this.self.style.left = transform.position.x + 'px';
        this.self.style.top = transform.position.y + 'px';


        this.colliders = colliders;


        if (animations) {

            this.sprite = new Image();

            this.sprite.src = animations[0];
            this.animations = animations;

            this.sprite.setAttribute('class', 'Sprite');
            this.self.append(this.sprite);
        }

        this.onRefresh = onRefresh;
        this.onStart = onStart;

        scene.gameObjects.push(this);


        setTimeout(() => {

            this.Scale(this.transform.scale.x, this.transform.scale.y);


            if (this.onStart)
                this.onStart(this);

            this.Debug();
        }, 100);

    }
    Scale(x, y) {

        console.log(x, y, this.sprite.width, this.sprite.height);
        [
            this.sprite.width, this.sprite.height
        ] = [
                this.sprite.width * x,
                this.sprite.height * y
            ];
        console.log(x, y, this.sprite.width, this.sprite.height);

    }
    Move(direction, velocity) {

        direction.Normalize();


        let distance = new Vector2(direction.x, direction.y);

        distance.Scale(Time.deltaTime);
        distance.Scale(velocity);


        // Collision
        if (player == this) {

            let newa = new Vector2(this.transform.position.x + distance.x + this.colliders[0].offset.x, this.transform.position.y + distance.y + this.colliders[0].offset.y);

            scene.gameObjects.forEach(gameObject => {

                if (gameObject == this)
                    return;

                gameObject.colliders.forEach(collider => {

                    if (collider.onEnter || collider.onExit || collider.onStay)
                        return;

                    const c1 = {
                        offset: newa,
                        size: player.colliders[0].size
                    };
                    const c2 = {
                        offset: Vectors.Sum(gameObject.transform.position, collider.offset),
                        size: collider.size
                    };

                    // If collide...
                    if (Colliders.IsCollide(c1, c2)) {


                        // If collide on X...
                        c1.offset = new Vector2(newa.x, this.transform.position.y + this.colliders[0].offset.y);

                        if (Colliders.IsCollide(c1, c2))
                            distance.x = 0;


                        // If collide on Y...
                        c1.offset = new Vector2(this.transform.position.x + this.colliders[0].offset.x, newa.y);

                        if (Colliders.IsCollide(c1, c2))
                            distance.y = 0;
                    }
                })
            });
        }

        this.transform.position.x += distance.x;
        this.transform.position.y += distance.y;

        this.self.style.left = this.transform.position.x + 'px';
        this.self.style.top = this.transform.position.y + 'px';


        if (distance.x !== 0) {
            let scale = distance.x > 0 ? 1 : -1;

            if (this.sprite.style.transform != 'scaleX(' + scale + ')')
                this.sprite.style.transform = 'scaleX(' + scale + ')';
        }


        let index = velocity > 200 ? 2 : 1;

        if (!this.sprite.src.includes(this.animations[index])) {
            this.sprite.src = this.animations[index];
        }
    }

    Debug() {

        if (debug) {
            this.colliders.forEach(collider => {

                let box = document.createElement('div');
                box.className = '_box_collider';
                box.style.width = collider.size.x + 'px';
                box.style.height = collider.size.y + 'px';
                box.style.left = collider.offset.x + 'px';
                box.style.top = collider.offset.y + 'px';
                this.self.append(box);
            });
        }
    }
}

const debug = true;



const Time = {
    time: new Date().getTime(),
    deltaTime: 0,
};



document.addEventListener('scroll', (event) => {

    let camera = Vectors.Sub(player.transform.position, offset);

    window.scrollTo(camera.x, camera.y);
    event.preventDefault();
})


let axis = new Vector2(0, 0);
let sprint = false;
window.addEventListener('keydown', function (event) {

    if (debug)
        console.log('Key Code [' + event.key + ']: ' + event.keyCode);

    event.preventDefault();

    switch (event.keyCode) {
        case 16: // Shift
            sprint = true;
            break;
        case 27: // Escape
            pause = !pause;
            break;
        case 32:

            if (speak) {
                let answer = lastquote.GetAnswers(ponytotalk);

                if (answer instanceof Quote)
                    dialogues.Display(answer);
            }
            break;

        case 49:
            if (speak) {

                let answer = lastquote.GetAnswers(ponytotalk)[0];

                if (answer) {
                    if (answer.event !== undefined)
                        answer.event();

                    let quote = answer.GetQuote(ponytotalk);
                    dialogues.Display(quote);
                }
            }
            break;
        case 50:
            if (speak) {

                let answer = lastquote.GetAnswers(ponytotalk)[1];

                if (answer) {
                    if (answer.event !== undefined)
                        answer.event();

                    let quote = answer.GetQuote(ponytotalk);
                    dialogues.Display(quote);
                }
            }
            break;
        case 51:
            if (speak) {

                let answer = lastquote.GetAnswers(ponytotalk)[2];

                if (answer) {
                    if (answer.event !== undefined)
                        answer.event();
                    let quote = answer.GetQuote(ponytotalk);
                    dialogues.Display(quote);
                }
            }
            break;
        case 65: // A 
            axis.x = -1;
            break;

        case 68: // D
            axis.x = 1;
            break;

        case 83: // S
            axis.y = 1;
            break;

        case 87: // W
            axis.y = -1;
            break;



        case 70: // F 

            if (action)
                action()
            break;
    }
});

window.addEventListener('keyup', function (event) {

    event.preventDefault();

    switch (event.keyCode) {
        case 16: // Shift
            sprint = false;
            break;

        case 65: // A 
            if (axis.x === -1)
                axis.x = 0;
            break;

        case 68: // D
            if (axis.x === 1)
                axis.x = 0;
            break;

        case 83: // S
            if (axis.y === 1)
                axis.y = 0;
            break;

        case 87: // W
            if (axis.y === -1)
                axis.y = 0;
            break;
    }
});





class Quote {

    constructor(content, answers, event) {

        this.content = content || '';
        this.answers = answers || [];

        this.event = event || undefined;
    }

    GetAnswers(pony) {

        if (this.answers.length === 0) {
            return undefined;
        }
        else if (this.answers[0] < 0) {
            return pony.dialogue.quotes[this.answers * -1];
        }
        else {
            let answers = [];

            for (let i = 0; i < this.answers.length; i++)
                answers.push(pony.dialogue.answers[this.answers[i]]);

            return answers;
        }
    }
}
class Answer {

    constructor(content, quote, event) {

        this.content = content || '';
        this.quote = quote;

        this.event = event;
    }

    GetQuote(pony) {

        return pony.dialogue.quotes[this.quote];
    }
}

let speak = false;
let lastquote = null;
let ponytotalk;
const dialogues = {

    Start(pony) {

        fade(true);

        setTimeout(() => {
            fade(false);
            document.getElementById('dialogue').style.display = 'block';

            davatar.style.backgroundImage = 'url(' + pony.dialogue.default.avatar + ')';
            dname.textContent = pony.name.toUpperCase()

            let quote = pony.dialogue.quotes[pony.dialogue.default.index];
            ponytotalk = pony;
            speak = true;
            lastquote = quote;
            // ustaw

            this.Display(quote);


            pause = true;
        }, 550)


    },

    Display(quote) {


        if (quote.event !== undefined)
            quote.event();

        if (quote.content === 'exit')
            return;
        dcontetnt.textContent = quote.content;


        if (quote.answers[0] < 0) {

            for (let i = 0; i < danswers.length; i++) {
                danswers[i].style.display = 'none';
            }

            dquote.style.bottom = '5%';

        }


        else {
            let i;
            for (i = 0; i < quote.answers.length; i++) {
                danswers[i].style.display = 'block';
                danswers[i].style.bottom = (quote.answers.length - 1 - i) * 10 + 5 + '%';
                danswers[i].getElementsByClassName('_answers_content')[0].textContent = ponytotalk.dialogue.answers[i].content;
            }

            dquote.style.bottom = 5 + i * 10 + '%';
        }
        lastquote = quote;
    },

    Close() {

        fade(true);
        setTimeout(() => {
            fade(false);
            document.getElementById('dialogue').style.display = 'none';
            pause = false;
            speak = false;

        }, 550);

    },
}


const nodes = [];

class Node {

    constructor(position, neighbors) {

        this.position = position || new Vector2(0, 0);
        this.neighbors = neighbors || [];

        this.previous = null;

        this.neighbors.forEach(neighbor => {

            neighbor.neighbors.push(this);
        });

        nodes.push(this);


        if (debug) {

            let point = document.createElement('div');

            point.className = 'waypoint'

            point.style.top = position.y - 3 + 'px';
            point.style.left = position.x - 3 + 'px';

            document.body.append(point);
        }
    }
}

const Nodes = {

    Trace(start, destination) {

        if (start === destination)
            return [];

        Nodes.Clear();


        let open = [start];

        while (open.length > 0) {

            let path = [];

            open[0].neighbors.forEach(node => {

                if (path.length !== 0)
                    return;

                if (node == destination) {

                    destination.previous = open[0];

                    let current = destination;

                    while (start != current) {

                        path.push(current);
                        current = current.previous;
                    }

                }

                if (node.previous !== null)
                    return;

                node.previous = open[0];
                open.push(node);
            });

            if (path.length > 0) {

                path.push(start);
                path.reverse;

                return path;
            }

            open.shift();
        }
    },

    Clear() {
        nodes.forEach(node => {
            node.previous = null;
        });
    }
}


function fade(out) {
    let overlay = document.getElementById('overlay');
    let i = out ? 1 : -1;
    if (out) {
        overlay.style.display = 'block';

    }

    const coroutine = setInterval(() => {
        overlay.style.opacity = parseFloat(overlay.style.opacity) + i * 0.01;

        if (out) {
            if (overlay.style.opacity > 1) {
                clearInterval(coroutine);

            }
        }
        else {
            if (overlay.style.opacity < 0) {
                clearInterval(coroutine);
                overlay.style.display = 'none';
            }
        }
    }, 5);

}












/*


        }*/
