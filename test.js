
new Entity('wall', new Vector2(100, 100), new Vector2(5000, 10), {
    colliders: [
        new Collider({}),
    ]
});

var ss = new Pony('Sunset Shimmer', new Vector2(200, 200), {
    schedule: [
        new Schedule.Move(new Vector2(4900, 200)),
        new Schedule.Wait(5, { animation: 'e' }),
        new Schedule.Say('Co ja tutaj robię?', 5, { parallel: true }),
        new Schedule.Move(new Vector2(200, 200))
    ],
    animations: {
        'e': 'sunsetShimmer_teleport.gif'
    }
})

new Player(new Vector2(1000, 500), {
    animations: {
        'idle': './images/flufflePuff_idle.gif',
        'trotting': './images/flufflePuff_trotting.gif'
    }
});

Camera.target = player;
