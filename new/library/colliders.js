class Collider2D {

    constructor(offset = new Vector2(0, 0), size = new Vector2(0, 0), { onEnter, onExit, onStay } = { undefined, undefined, undefined }) {

        // Required varibles...
        if (!offset || !(offset instanceof Vector2))
            offset = new Vector2(0, 0);

        this.offset = offset

        if (!size || !(size instanceof Vector2))
            size = new Vector2(0, 0);

        this.size = size;

        this.collide = false;


        // Events...
        this.onEnter = onEnter;
        this.onExit = onExit;

        this.onStay = onStay;
    }
}

const Colliders = {

    IsCollide(c1, c2) {

        if (c1.offset.x < c2.offset.x + c2.size.x)
            if (c1.offset.x + c1.size.x > c2.offset.x)
                if (c1.offset.y < c2.offset.y + c2.size.y)
                    if (c1.offset.y + c1.size.y > c2.offset.y)
                        return true;

        return false;
    }
}