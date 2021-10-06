class Schedule {

    #entity;
    tasks;

    get current() {

        return this.tasks[0] || null;
    }

    constructor (entity, tasks) {

        this.#entity = entity;
        this.tasks = tasks || [];

        if (this.current)
            this.current.setup(this.#entity);
    }

    insert(position, task) {

        this.tasks.splice(position, 0, task);

        if (position === 0 && typeof this.current.setup === 'function')
            this.current.setup(this.#entity);
    }

    next() {

        this.tasks.splice(0, 1);

        if (this.current)
            if (typeof this.current.setup === 'function')
                this.current.setup(this.#entity);
    }

    static Wait = class {

        #time;
        #remaining;

        #animation;

        constructor (time, { animation = 'idle' } = {}) {

            this.#time = time;
            this.#animation = animation;
        }

        setup() {

            this.#remaining = this.#time;
        }

        refresh(pony) {

            this.#remaining -= Time.deltaTime / 1000;

            if (this.#animation)
                pony.animator.play(this.#animation);

            if (this.#remaining <= 0) {

                pony.animator.play('idle');
                return true;
            }
        }
    }

    static Move = class {

        #destination;
        #direction;

        #animation;

        constructor (destination, { animation = 'trotting' } = {}) {

            this.#destination = destination;
            this.#animation = animation;
        }

        setup(pony) {

            this.#direction = this.#destination.clone().substract(pony.position).normalize();
        }

        refresh(pony) {

            pony.position = Vector2.sum(this.#direction.clone().scale(300 * Time.deltaTime / 1000), pony.position);
            pony.flip(this.#direction.x < 0).animator.play(this.#animation);

            if (Vector2.distance(pony.position, this.#destination) < 10) {

                pony.animator.play('idle');
                return true;
            }

        }
    }

    static Say = class {

        sentence;
        #remaining;
        #parallel;

        #animation;

        constructor (sentence, time, { animation = 'idle', parallel = false } = {}) {

            this.sentence = sentence;
            this.#remaining = time;

            this.#animation = animation;
            this.#parallel = parallel;
        }

        setup(pony) {

            pony.speechBaloon.text = this.sentence;

            if (this.#parallel) {

                setTimeout(() => {

                    if (this.sentence === pony.speechBaloon.text)
                        pony.speechBaloon.text = '';
                }, this.#remaining * 1000)
            }
        }

        refresh(pony) {

            if (this.#parallel)
                return true;

            this.#remaining -= Time.deltaTime / 1000;
            pony.animator.play(this.#animation);

            if (this.#remaining <= 0) {

                pony.speechBaloon.text = '';
                return true;
            }
        }
    }
}