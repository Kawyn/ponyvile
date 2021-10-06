class Vector2 {

    x;
    y;

    get magnitude() {

        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    constructor (x, y) {

        this.x = x || 0;
        this.y = y || 0;
    }

    scale(factor) {

        this.x *= factor;
        this.y *= factor;

        return this;
    }

    normalize() {

        const magnitude = this.magnitude;

        if (magnitude === 0)
            return;

        this.x /= magnitude;
        this.y /= magnitude;

        return this;
    }

    add(v) {

        this.x += v.x;
        this.y += v.y;
    }

    substract(v) {

        this.x -= v.x;
        this.y -= v.y;

        return this;
    }

    multiply(v) {

        this.x *= v.x;
        this.y *= v.y;

        return this;
    }

    divide(v) {

        this.x /= v.x;
        this.y /= v.y;

        return this;
    }

    static distance(a, b) {

        const x = a.x - b.x;
        const y = a.y - b.y;

        return Math.sqrt(x * x + y * y);
    }

    static sum() {

        const result = new Vector2(0, 0);

        for (const v of arguments) {

            result.x += v.x;
            result.y += v.y;
        }

        return result;
    }

    toString() {

        return `x: ${this.x}, y: ${this.y}`;
    }

    clone() {

        return new Vector2(this.x, this.y);
    }
}
