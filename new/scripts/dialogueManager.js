var dialogue = {
    isStarted: false,

    pony: null,
    statement: null
}

var avatarDefaultPath = "images/Avatars/";
var avatars = [
    "flufflePuff.png",
    "sunsetShimmer.png",
];

// ---- Dialogue Database ----
var dialogueDatabase = [
    /* 0 - fluffy Puff */ {
        text: "Pffft...",
        avatar: 0,
        
        anserws: [
            {
                text: "What are you doing?",
                avatar: "",
                
                anserw: 1
            }, 
            {
                text: "Goodbye",
                avatar: "",
                
                anserw: -1
            }
        ],
    },
    /* 1 - fluffy Puff */ {
        text: "Bllblllbl... Pfffft. Pfft?",
        avatar: 0,
        
        anserws: [
            {
                text: "Of course",
                avatar: "",
                
                anserw: 2,

                special: { varibleID: 0, anserw: 13}
            },
            {
                text: "I don't understand",
                avatar: "",

                anserw: 3
            }, 
            {
                text: "Goodbye",
                avatar: "",
                
                anserw: -1
            }
        ],
    },
    /* 2 - fluffy Puff */ {
        text: "Hehehe!!! Pfffft.",
        avatar: 0,
        
        anserws: [
            {
                text: "Goodbye",
                avatar: "",
                
                anserw: -1,

                // Optionals...
                newStartStatement: 12
            }
        ],
    },
    /* 3 - fluffy Puff */ {
        text: "Pffft, bllblbbll?",
        avatar: 0,
        
        anserws: [
            {
                text: "I still don't understand",
                avatar: "",

                anserw: 4
            }, 
            {
                text: "Goodbye",
                avatar: "",
                
                anserw: -1
            }
        ],
    },
    /* 4 - fluffy Puff */ {
        text: "Pfft, pffft?",
        avatar: 0,
        
        anserws: [
            {
                text: "I still don't understand",
                avatar: "",

                anserw: 5
            }, 
            {
                text: "Goodbye",
                avatar: "",
                
                anserw: -1
            }
        ],
    },
    /* 5 - fluffy Puff */ {
        text: "Pffft, bllblbbll?",
        avatar: 0,
        
        anserws: [
            {
                text: "I still don't understand",
                avatar: "",

                anserw: 6
            }, 
            {
                text: "Goodbye",
                avatar: "",
                
                anserw: -1
            }
        ],
    },
    /* 6 - fluffy Puff */ {
        text: "Pfft, pffft?",
        avatar: 0,
        
        anserws: [
            {
                text: "I still don't understand",
                avatar: "",

                anserw: 7
            }, 
            {
                text: "Goodbye",
                avatar: "",
                
                anserw: -1
            }
        ],
    },
    /* 7 - fluffy Puff */ {
        text: "Pffft, bllblbbll?",
        avatar: 0,
        
        anserws: [
            {
                text: "I still don't understand",
                avatar: "",

                anserw: 8
            }, 
            {
                text: "Goodbye",
                avatar: "",
                
                anserw: -1
            }
        ],
    },
    /* 8 - fluffy Puff */ {
        text: "Pfft, pffft?",
        avatar: 0,
        
        anserws: [
            {
                text: "I still don't understand",
                avatar: "",

                anserw: 9
            }, 
            {
                text: "Goodbye",
                avatar: "",
                
                anserw: -1
            }
        ],
    },
    /* 9 - fluffy Puff */ {
        text: "Pffft, bllblbbll?",
        avatar: 0,
        
        anserws: [
            {
                text: "I still don't understand",
                avatar: "",

                anserw: 10
            }, 
            {
                text: "Goodbye",
                avatar: "",
                
                anserw: -1
            }
        ],
    },
    /* 10 - fluffy Puff */ {
        text: "*Fluffy Puff is showing you pillow image*",
        avatar: 0,
        
        anserws: [
            {
                text: "Do you want a pillow?",
                avatar: "",

                anserw: 11,

                special: {worldCondition: 0, anserw: 13}
            }, 
            {
                text: "Goodbye",
                avatar: "",
                
                anserw: -1
            }
        ],
    },
    /* 11 - fluffy Puff */ {
        text: "Pfft, firb!",
        avatar: 0,
        
        anserws: [
            {
                text: "OK. I will bring you pillow",
                avatar: "",

                anserw: 2
            }, 
            {
                text: "Sorry... I can't bring you it this",
                avatar: "",

                anserw: 12
            }, 
            {
                text: "Goodbye",
                avatar: "",
                
                anserw: -1
            }
        ],
    },
    /* 12 - fluffy Puff */ {
        text: "Pfffblfft!",
        avatar: 0,
        
        anserws: [
            {
                text: "Bye",
                avatar: "",
                
                anserw: -1,
                
                // Optionals...
                newStartStatement: 12
            }
        ],
    },
    /* 13 - fluffy Puff */ {
        text: "Pffts?",
        avatar: 0,
        
        anserws: [
            {
                text: "Please, take it",
                avatar: "",
                
                anserw: 14,

                newStartStatement: 14
            },
            {
                text: "I will back later...",
                avatar: "",
                
                anserw: -1
            }
        ],
    },
    /* 14 - fluffy Puff */ {
        text: "Hehehe! Pffts.",
        avatar: 0,
        
        anserws: [
            {
                text: "No, problemo.",
                avatar: "",
                
                anserw: -1,
            },
        ],
    }
];



function ActionManager()
{
                        
    var object;
    var isNear;
    
    actionHint.main.style.display = "none";
    
    
    for (var i = 0; i < ponies.length; i++) 
    {

        object = ponies[i];             
        isNear = isCloseEnough(object.div.style);
          
                       
        if(isNear)
        {

            // Interface...
            actionHint.main.style.display = "block";
            actionHintAction.innerHTML= "<span>E</span> Talk";
            actionHintObject.innerHTML= object.name;

            return;
        }
    }
    for (var i = 0; i < items.length; i++) 
    {

        object = items[i];
        if(object.condition)
            return;
                    
        isNear = isCloseEnough({left: object.position.x, top: object.position.y});
          
                       
        if(isNear)
        {

            // Interface...
            actionHint.main.style.display = "block";
            actionHintAction.innerHTML= "<span>E</span> Pick Up";
            actionHintObject.innerHTML= object.name;

            return;
        }
    }
}

// Input Manager...
window.addEventListener("keydown", function (input) {
    
    // Is Player talking with somepony???
    if(dialogue.isStarted) {

        if(input.key == '1')
            Anserw(0);

        if(input.key == '2')
            Anserw(1);
        
        if(input.key == '3')
            Anserw(2);
    }
})


// Start && End...
function StartConversation() {

    // Varibles...
    var pony;
    var isNear;
    

    // Find Pony to talk...
    for (var i = 0; i < ponies.length; i++) {

        // More varibles...
        pony = ponies[i];             
        isNear = isCloseEnough(pony.div.style);
          
                       
        if(isNear) {

            Fade();

            // Don't flash...
            setTimeout(function() {

                // Start dialogue....
                dialogue.pony = pony;
                dialogue.isStarted = true;
                dialogue.statement = dialogueDatabase[pony.startStatement];

                // Interface!!!
                dialogueInterface.pony.src = pony.avatar;
                dialogueInterface.main.style.display = "block";

                RefreshDialogueInterface();
            }, 200);


            // STOP!!!
            return;
        }
    }
}
function EndConversation() {
    
    Fade();

    // Don't flash...
    setTimeout(function() {
       
        // End dialogue...
        dialogue.pony = null;
        dialogue.isStarted = false;

        // Interface!!!
        dialogueInterface.main.style.display = "none";
    }, 200);
}


// Anserw...
function Anserw(index)
{

    // STOP!!!
    if(dialogue.statement.anserws.length <= index)
        return;

    
    // Varibles...
    var anserw = dialogue.statement.anserws[index];


    // Specialls...
    if(typeof anserw.newStartStatement !== 'undefined')
        dialogue.pony.startStatement = anserw.newStartStatement;
    
    if(typeof anserw.soundEffect !== 'undefined')
        anserw.soundEffect.play();

    if(typeof anserw.special !== 'undefined')
    {

        if(worldCondition[anserw.special.item])
        {
        
            dialogue.statement = dialogueDatabase[anserw.special.anserw];
            RefreshDialogueInterface();

            return;
        }
    }



    // God bless Mr. Brown...
    if(anserw.anserw == -1)
        EndConversation();
    
    else
    {

        dialogue.statement = dialogueDatabase[anserw.anserw];
        RefreshDialogueInterface();
    }
}

// Interface... 
function RefreshDialogueInterface () {

    // Statement...
    dialogueInterface.statement.innerHTML = dialogue.statement.text;


    // Anserws...
    dialogueInterface.anserws.forEach(function (element) {
        element.innerHTML = "";
    });

    for(var i = 0; i < dialogue.statement.anserws.length; i++)
        dialogueInterface.anserws[i].innerHTML = (i + 1)  + ". " + dialogue.statement.anserws[i].text;
}