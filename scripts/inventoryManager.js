var items = [
    /* Pillow */ {
        name: "Pillow",
        position: { x: 1000, y: 2000},
        condition: false,

        event: "if(ponies[2].startStatement == 12) { ponies[2].startStatement = 13; }  worldCondition[0] = true;",
    },
]

function PickUp() {

    // Varibles...
    var item;
    var isNear = false;

    for (var i = 0; i < items.length; i++) {

        item = items[i];  


        if(item.condition)
            return;
        
        isNear = isCloseEnough({left: item.position.x, top: item.position.y});
          


        if(isNear) {

            if(typeof item.event !== 'undefined')
                toCode(item.event);
    
            items[i].condition = true;
        }
    }
}