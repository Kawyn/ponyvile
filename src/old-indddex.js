

/*

                        if (Input.keysDown['f']) {

                            if (!this.fillerTextes.includes(this.schedule.current.sentence)) {

                                this.schedule.insert(0, new Schedule.Say(this.fillerTextes.random(), 1, {
                                    parallel: !(this.schedule.current instanceof Schedule.Say)
                                }))
                            }

*/
Array.prototype.random = function () {

    console.log(this);
    return this[Math.floor(Math.random() * this.length)];
}


class Pony extends Entity {

    schedule;
    animator;

    speechBaloon;
    target;
    dialogue;
    fillerTextes = [

        'Nie teraz.',
        'Przepraszam, ale nie mogę teraz rozmawiać.',
        'Nie przeszkadzaj mi.'
    ]
    dialogueName = null;


    onRefresh = () => { };

    constructor (name, position, { schedule = [], animations = {}, onRefresh = null } = {}) {

        super(name, position, new Vector2(100, 100), {
            tags: ['pony'],

            colliders: [
                new Collider({
                    size: new Vector2(200, 200),
                    offset: new Vector2(-50, -50),

                    trigger: true,

                    onEnter: collider => {

                        const player = collider.entity;
                        player.target = this;
                    },
                    onExit: collider => {

                        const player = collider.entity;

                        if (player.target === this)
                            player.target = null;
                    }
                })
            ]
        });

        this.speechBaloon = new Text(position, new Vector2(500, 50), '', { target: this });

        const char = name[0].toLowerCase();

        name = name.split(' ').join('');
        name = char + name.slice(1);

        this.animator = new Animator(this, {
            'idle': PONIES_ATLAS_PATH + name + '_idle.gif',
            'trotting': PONIES_ATLAS_PATH + name + '_trotting.gif',
        });

        for (const k in animations)
            this.animator.animations[k] = PONIES_ATLAS_PATH + animations[k];

        this.schedule = new Schedule(this, schedule)
        this.animator.play('idle');

        this.onRefresh = onRefresh;
    }


    refresh() {

        if (typeof this.onRefresh === 'function')
            this.onRefresh(this);

        if (this.schedule) {

            if (this.schedule.current === null)
                return;

            if (this.schedule.current) {

                if (this.schedule.current.refresh(this))
                    this.schedule.next();
            }
        }
    }
}



class Player extends Entity {

    target;
    move() {

        const direction = new Vector2(this.destination.x - this.position.x, this.destination.y - this.position.y);

        direction.normalize()
        direction.scale(this.velocity * (Input.keys['shift'] ? 1.5 : 1) * Time.deltaTime / 1000);

        const position = Vector2.sum(this.position, direction);

        this.position = position;
        this.flip(direction.x < 0);
    }

    refresh() {

        if (Input.keysDown['f']) {
            console.log(this.target)
        }
        if (Input.mouseButtons[0]) {

            this.destination = Input.mouseDocumentPosition.substract(this.size.scale(0.5));

            if (Vector2.distance(this.position, this.destination) < 2.5)
                return;

            this.move();

            if (Input.keys['shift'])
                this.animator.play('sprint');
            else
                this.animator.play('trotting');
        }
        else {

            this.animator.play('idle');
        }

    }

    constructor (position, { animations = {} } = {}) {

        super('Player', position, new Vector2(100, 100), {
            tags: ['pony'],
            colliders: [new Collider()]
        });

        player = this;

        this.animator = new Animator(this, animations);
        this.destination = position;
        this.animator.play('idle');
    }

    sprint = false;
    velocity = 300;
}

class Animator {

    #entity;

    playing;
    animations;

    constructor (entity, animations) {

        this.#entity = entity;
        this.animations = animations || {};
    }


    play(name) {

        if (this.playing === name)
            return;

        if (name in this.animations) {

            this.#entity.sprite = this.animations[name];
            this.playing = name;
        }
        else console.warn('[PONYVILE] Nie zdefiniowano animacji \'' + name + '\' dla ' + this.#entity.name + '.');
    }
}



const Time = {

    now: new Date().getTime(),

    startTime: new Date().getTime(),

    time: 0,
    deltaTime: 0,


    refresh() {

        this.deltaTime = new Date().getTime() - this.now;
        this.now += this.deltaTime;

        if (!pause)
            this.time += this.deltaTime;
    },

    toString() {

        return `Start Time: ${this.startTime}, Now: ${this.now}, Time: ${this.time}, Delta Time: ${this.deltaTime}`
    }
}

const Camera = {

    target: null,
    interface: null,

    refresh() {

        if (!this.target)
            return;

        if (!this.interface)
            this.interface = document.querySelector('#interface');

        const x = this.target.position.x - window.scrollX - (window.innerWidth - this.target.size.x) / 2;
        const y = this.target.position.y - window.scrollY - (window.innerHeight - this.target.size.y) / 2;

        window.scrollBy(x, y)

        this.interface.style.left = window.scrollX + 'px';
        this.interface.style.top = window.scrollY + 'px';
    }
}

class Input {

    static keys = {};
    static keysDown = {};

    static mouseButtons = [false, false, false];

    static mouseScreenPosition = new Vector2(0, 0);

    static get mouseDocumentPosition() {

        return new Vector2(Input.mouseScreenPosition.x + window.scrollX, Input.mouseScreenPosition.y + window.scrollY);
    }
}

window.addEventListener('keydown', event => {

    const key = event.key.toLowerCase();

    if (Input.keys[key])
        return;

    Input.keys[key] = true;
    Input.keysDown[key] = true;

})
window.addEventListener('keyup', event => {

    const key = event.key.toLowerCase();

    if (!Input.keys[key])
        return;

    Input.keys[event.key.toLowerCase()] = false;
    Input.keysDown[event.key.toLowerCase()] = false;

})
window.addEventListener('mousedown', event => {

    if (event.button < Input.mouseButtons.length)
        Input.mouseButtons[event.button] = true;
});


window.addEventListener('mouseup', event => {

    if (event.button < Input.mouseButtons.length)
        Input.mouseButtons[event.button] = false;
});

window.addEventListener('mousemove', event => {

    Input.mouseScreenPosition = new Vector2(event.x, event.y);
})

var pause = false;

setInterval(() => {

    Time.refresh();
    if (pause)
        return;
    for (const entity of entities)
        entity.refresh();
    Camera.refresh();
    UI.refresh();
    Physics.refresh();


    window.dispatchEvent(new Event('refresh'));
    for (const k in Input.keysDown)
        Input.keysDown[k] = false;
});


const Physics = {

    overlap(a, b) {

        const aPos = a.position;
        const bPos = b.position;

        return (aPos.x < bPos.x + b.size.x) && (aPos.x + a.size.x > bPos.x) && (aPos.y < bPos.y + b.size.y) && (aPos.y + a.size.y > bPos.y);
    },
    /**
     * 
     * @param {Vector2} origin 
     * @param {Vector2} direction 
     * @param {Collider} target 
     * @returns
     */
    raycast(origin, direction, target) {

        const near = new Vector2(target.position.x - origin.x, target.position.y - origin.y);
        const far = new Vector2(near.x + target.size.x, near.y + target.size.y);

        near.x /= direction.x;
        near.y /= direction.y;

        far.x /= direction.x;
        far.y /= direction.y;

        if (near.x > far.x)
            [near.x, far.x] = [far.x, near.x];

        if (near.y > far.y)
            [near.y, far.y] = [far.y, near.y];

        if (near.x > far.y || near.y > far.x)
            return false;

        const nearHit = Math.max(near.x, near.y);
        const farHit = Math.min(far.x, far.y);

        if (farHit < 0)
            return false;

        const dir = direction.clone()
        dir.scale(nearHit);

        const point = new Vector2(origin.x + dir.x, origin.y + dir.y);
        const normal = new Vector2(0, 0);


        if (near.x > near.y) {
            if (direction.x < 0)
                normal.x = 1;
            else
                normal.x = -1
        }
        else {
            if (direction.y < 0)
                normal.y = 1;
            else
                normal.y = -1;
        }

        return { point: point, normal: normal };
    },

    refresh() {

        for (const entity of entities) {

            if (entity === player)
                continue;

            if (!entity.colliders)
                continue;

            if (entity.colliders.length === 0)
                continue;

            for (const a of player.colliders) {

                if (!a.active)
                    continue;

                for (const b of entity.colliders) {

                    if (!b.active)
                        continue;

                    if (!Physics.overlap(a, b)) {

                        if (a._collisions.includes(b)) {

                            a.onExit(b);
                            b.onExit(a);

                            a._collisions.splice(a._collisions.indexOf(b), 1);
                            b._collisions.splice(b._collisions.indexOf(a), 1);
                        }
                    }

                    else if (a.trigger || b.trigger) {

                        if (a._collisions.includes(b)) {

                            a.onStay(b);
                            b.onStay(a);
                        }

                        else {

                            a.onEnter(b);
                            b.onEnter(a);

                            a._collisions.push(b);
                            b._collisions.push(a);
                        }
                    }

                    else {

                        const origin = Vector2.sum(a.position, a.size.scale(0.5));
                        const direction = Vector2.sum(b.position, b.size.scale(0.5)).substract(origin).normalize();

                        const ray = Physics.raycast(origin, direction, b);

                        if (ray) {

                            if (ray.normal.x === 1)
                                player.position = new Vector2(b.position.x + b.size.x, a.entity.position.y);
                            else if (ray.normal.x === -1)
                                player.position = new Vector2(b.position.x - a.size.x, a.entity.position.y);
                            else if (ray.normal.y === 1)
                                player.position = new Vector2(a.entity.position.x, b.position.y + b.size.y);
                            else if (ray.normal.y === -1)
                                player.position = new Vector2(a.entity.position.x, b.position.y - a.size.y);
                        }
                    }
                }
            }
        }
    }
}