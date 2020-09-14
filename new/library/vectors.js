class Vector2 {

    constructor(x, y) {

        this.x = x || 0;
        this.y = y || 0;
    }

    Length() {

        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    Normalize() {

        const length = this.Length();

        if (length === 0)
            return;

        this.x /= length;
        this.y /= length;
    }

    Scale(factor) {

        this.x *= factor;
        this.y *= factor;
    }
}

const Vectors = {

    Sum(v1, v2) {

        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    },

    Sub(v1, v2) {

        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    },

    Distance(v1, v2) {

        return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y));
    }
}
