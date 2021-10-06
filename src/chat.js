class ChatSystem {

    static interface = {

        root: document.querySelector('#chat'),

        background: document.querySelector('#chat-background'),
        portrait: document.querySelector('#chat-portrait'),

        bar: document.querySelector('#chat-bar'),

        character: document.querySelector('#chat-character'),
        text: document.querySelector('#chat-text'),

        responses: [...document.querySelectorAll('.chat-response')]
    };

    static graph = null;
    static node = null;

    static start(file) {

        this.fetchChatGraph(file).then(graph => {

            this.graph = graph;

            if (!graph['start'])
                return console.error('[PONYVILE] Missing start node in: ' + file)

            pause = true;

            this.continue();

            this.interface.root.style.display = 'block';
        });
    }

    static continue(next = undefined) {

        if (!this.node) {

            this.node = this.graph['start'];
        }
        else {

            if (next === undefined)
                next = this.node.next;

            if (next === 'close')
                return this.close();

            this.node = this.graph[next];
        }

        if (this.node instanceof ChatNode.Event)
            this.node.action();

        else if (this.node instanceof ChatNode.Dialogue)
            this.refresh();


        if (this.node instanceof ChatNode.Condition || this.node instanceof ChatNode.Event)
            this.continue()
    }

    static choose(index) {

        if (!this.node.responses)
            return console.error('[PONYVILE] coś jest źle');

        this.continue(this.node.responses[index].next);
    }

    static close() {

        pause = false;

        this.graph = null;
        this.node = null;

        this.interface.root.style.display = 'none';
    }

    static async fetchChatGraph(file) {

        return fetch(file).then(response => {

            if (response.status > 400 && response.status < 600)
                return;

            return response.json().then(json => {

                const graph = {};

                for (const key in json)
                    graph[key] = ChatNode.fromJSON(json[key]);

                return graph;
            });
        });
    }

    static refresh() {

        this.interface.character.textContent = this.node.character;
        this.interface.text.textContent = this.node.text;

        if (this.node.responses) {

            this.interface.bar.onclick = () => { };

            for (let i = 0; i < this.node.responses.length; i++) {

                this.interface.responses[i].style.display = 'block';
                this.interface.responses[i].textContent = this.node.responses[i].text;
            }
        }
        else {

            this.interface.bar.onclick = () => { this.continue() };

            this.interface.responses.forEach(response => {
                response.style.display = 'none';
            });
        }

        if (this.node.environment) {

            const environment = this.node.environment;

            if (environment.portrait)
                this.interface.portrait.src = environment.portrait;
            if (environment.primary)
                document.querySelector(':root').style.setProperty('--primary', environment.primary);
            if (environment.secondary)
                document.querySelector(':root').style.setProperty('--secondary', environment.secondary);
        }
    }
}


















class ChatNode {


    static Condition = class {

        variable;
        outputs;

        get next() {

            let value;

            try {

                value = '' + event(this.variable)
            }
            catch {

                console.warn('[PONYVILE] Zmienna \'' + this.variable + '\' jest nie zdefinowana.');
                value = 'default';
            }

            return this.outputs[value] || this.outputs['default'];
        }

        constructor (variable, outputs) {

            this.variable = variable;
            this.outputs = outputs;
        }
    }

    static Dialogue = class {

        character;
        text;

        next;

        responses;

        environment;

        constructor (character, text, next, { responses = null, environment = null } = {}) {

            this.character = character;
            this.text = text;

            this.next = next;

            this.responses = responses;
            this.environment = environment;
        }
    }

    static Event = class {

        action;
        next;

        constructor (action, next) {

            if (typeof action === 'string')
                this.action = new Function(action);
            else
                this.action = action;

            this.next = next;
        }
    }

    static fromJSON(json) {

        json.type = json.type.toLowerCase();

        if (json.type === 'condition')
            return new ChatNode.Condition(json.variable, json.outputs);
        else if (json.type === 'dialogue')
            return new ChatNode.Dialogue(json.character, json.text, json.next, { responses: json.responses, environment: json.environment })
        else if (json.type === 'event')
            return new ChatNode.Event(json.action, json.next);

        console.error('[PONYVILE] unknow chat node type: ' + json.type)
    }
}