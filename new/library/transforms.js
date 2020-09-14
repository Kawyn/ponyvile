class Transform {

    constructor(position = new Vector2(0, 0), scale = new Vector2(1, 1)) {

        if (!position || !(position instanceof Vector2))
            position = new Vector2(0, 0);

        this.position = position;

        if (!scale || !(scale instanceof Vector2))
            scale = new Vector2(1, 1);

        this.scale = scale;
    }
}