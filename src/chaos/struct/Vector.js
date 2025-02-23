class Vector {

    x;
    y;

    get magnitude() {

        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    constructor(x, y) {

        this.x = x || 0;
        this.y = y || 0;
    }

    scale(factor) {

        const v = this.clone();
        v.x *= factor;
        v.y *= factor;

        return v;
    }

    normalize() {

        const magnitude = this.magnitude;
        const result = this.clone();

        if (magnitude === 0 || magnitude === 1)
            return result;

        result.x /= magnitude;
        result.y /= magnitude;

        return result;
    }

    add(v) {

        this.x += v.x;
        this.y += v.y;
    }

    substract(v) {

        const result = this.clone();
        result.x -= v.x;
        result.y -= v.y;

        return this;
    }

    multiply(v) {

        const result = this.clone();
        result.x *= v.x;
        result.y *= v.y;

        return this;
    }

    perpendicular() {
        return new Vector(-this.y, this.x);
    }

    divide(v) {

        this.x /= v.x;
        this.y /= v.y;

        return this;
    }

    toString() {

        return `x: ${this.x}, y: ${this.y}`;
    }

    clone() {

        return new Vector(this.x, this.y);
    }

    static distance(a, b) {

        const x = a.x - b.x;
        const y = a.y - b.y;

        return Math.sqrt(x * x + y * y);
    }

    /**
     * @param  {...Vector} vectors 
     * @returns {Vector}
     */
    static sum(...vectors) {

        const result = new Vector(0, 0);

        for (const v of vectors) {

            result.x += v.x;
            result.y += v.y;
        }

        return result;
    }

    /**
     * @param  {...Vector} vectors 
     * @returns {Vector}
     */
    static sub(...vectors) {

        const v = vectors[0]?.clone() || new Vector(0, 0);

        for (let i = 1; i < vectors.length; i++) {

            v.x -= vectors[i].x;
            v.y -= vectors[i].y;
        }

        return v;
    }

    static reflect(v, n) {

        return Vector.sub(v, n.scale(2 * Vector.dot(v, n)))
    }

    static dot(a, b) {
        return a.x * b.x + a.y * b.y;
    }

    static get zero() {
        return new Vector(0, 0);
    }

}
