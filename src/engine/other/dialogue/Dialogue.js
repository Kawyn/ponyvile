class Dialogue {

    static Data = class {

        constructor(type, data) { this.type = type, this.data = data }
    }

    static Root = class {

        children = [];

        index = 0;

        constructor(children) {

            this.children = children;
        }

        next(context) {

            const done = this.children[this.index].next(context);

            if (done) {

                this.children[this.index].clear();
                this.index++;
            }

            return this.children.length === this.index;
        }

        data(context) {

            return this.children[this.index].data(context);
        }

        clear() {

            if (this.index < this.children.length)
                this.children[this.index].clear();

            this.index = 0;

            this.owner = null;
        }
    }

    static Character = class {

        constructor(name, position) {

            this.name = name;
            this.position = position;
        }

        next(context) { return true; }
        data() { return new Dialogue.Data('character', Object.assign({}, this)); }

        clear() { }
    }

    static Text = class {

        constructor(name, text) {

            this.name = name;
            this.text = text;
        }

        next(context) { return true; }
        data() { return new Dialogue.Data('text', Object.assign({}, this)); }

        clear() { }
    }

    static Menu = class {

        static Option = class {

            constructor(text, func) {

                this.text = text;
                this.func = func;
            }
        }

        constructor(options) {

            this.options = options;
        }

        next(context) { return true; }
        data() { return new Dialogue.Data('menu', Object.assign({}, this)); }

        clear() { }
    }

    static Action = class {

        constructor(action) {

            this.action = action;
        }

        next(context) {

            this.action(context);

            return false;
        }

        data() { }

        clear() { }
    }

    static Condition = class extends Dialogue.Root {

        constructor(func) {

            this.func = func;
        }

        next(context) {

            if (this.index === 0 && !this.func(context)) // we shouldn't exit condidition even if requirements are no longer met
                return true;

            return super.next(context);
        }
    }
}