// objects: gamePlay and charObj
// gamePlay:
//     gameSpace - 2 dimensional Array, length is dependent on level 
//     itemArr - an array of the items that can be found throughout the game
//     trail - an array that holds the last few spaces walked on by the character (gamePlay or charObj?)
//     enemyArr - an array of the enemies that can be encountered in the game
    
// charObj:
//     statsObj - object, character stats (health, energy, morale, strength, luck, xp, coins)
//     currentLocation - a specific value of gameSpace that tells where the user currently is
//     isFighting - a boolean value to set to whether the character is currently in combat or Not 
//     attackMoves - obj or array that holds all the characters attack moves 
//     levelUp() - a function that is executed whenever the character levels up . 
//                 Increases stats, gameSpace, itemArr, attackMoves, enemyArr, and skillpoints
//     skillPoints - number of skillpoints character has, used to unlock different traits 
//     skills/traits object - holds different skills/traits that can be chosen upon leveling.  
//                 Example: extra damage on attack, takes less damage from enemies, increases rare items, increases items usefulness
//                         increases luck level, etc.  talk with Alex for game creativity.

// make quests later in the game play
// use the blarney stone

$(document).ready(function() {

let upArrowButton = $("#up-arrow");
let rightArrowButton = $("#right-arrow");
let downArrowButton = $("#down-arrow");
let leftArrowButton = $("#left-arrow");
let userSelect = $("#user-interaction");
let itemArr =                 
    ["nothing", 
    "an empty Guinness can",
    "some Irish Stew" ,
    "an empty Jameson bottle",
    "a U2 Album",
    "a full Guinness can",
    "a full Jameson bottle",
    "a Shamrock" ];
let gameSpaceDimension = 7;

let charObject = {
    stats: {
        health: 20,
        strength: 1,
        energy: 10,
        morale: 5,
        luck: 0,
        coins: 0
    },
    currentLocationX: (gameSpaceDimension - (gameSpaceDimension + 1) / 2),
    currentLocationY: (gameSpaceDimension - (gameSpaceDimension + 1) / 2),
    trailX: [],
    trailY: [],
    itemFound: null,
    inventoryArr: [],

    inventory: {
        emptyGuinness: 0,
        irishStew: 0,
        emptyJameson: 0,
        u2Album: 0,
        fullGuinness: 0,
        fullJameson: 0,
        shamrock: 0
    },

    addTrail: function() {
        this.trailX.push(this.currentLocationX);
        this.trailY.push(this.currentLocationY);
        //reassignItem(trailX[])
        if(this.trailX.length > 5) {
            this.trailX.shift();
            this.trailY.shift();
        }
    },
    moveUp: function() {
        charObject.currentLocationY--;
        if (charObject.currentLocationY < 1) {
            charObject.currentLocationY = 0;
        }
        gamePlay.itemPickup();
        userSelect.text("You walk one step north and find " + charObject.itemFound + "." + "(" + charObject.currentLocationX + ", " + charObject.currentLocationY + ")");
        charObject.stats.energy--;
        $("#energy-bar").css("width", "50%");
        gamePlay.removeArrows();
        charObject.addTrail();
        gamePlay.checkTrail();
        gamePlay.displayInInventory();
        //console.log(charObject.trailX, charObject.trailY);
    },
    moveRight: function() {
        upArrowButton.removeAttr("disabled");
        charObject.currentLocationX++;
        if (charObject.currentLocationX > (gameSpaceDimension - 1)) {
            charObject.currentLocationX = (gameSpaceDimension - 1);
        }
        gamePlay.itemPickup();
        userSelect.text("You walk one step east and find " + charObject.itemFound + "." + "(" + charObject.currentLocationX + ", " + charObject.currentLocationY + ")");
        charObject.stats.energy--;
        $("#energy-bar").css("width", "50%");
        gamePlay.removeArrows();
        charObject.addTrail();
        gamePlay.checkTrail();
        gamePlay.displayInInventory();
        //console.log(charObject.trailX, charObject.trailY);
    },
    moveDown: function() {
        charObject.currentLocationY++;
        if (charObject.currentLocationY > (gameSpaceDimension - 1)) {
            charObject.currentLocationY = (gameSpaceDimension - 1);
        }
        gamePlay.itemPickup();
        userSelect.text("You walk one step south and find " + charObject.itemFound + "." + "(" + charObject.currentLocationX + ", " + charObject.currentLocationY + ")");
        charObject.stats.energy--;
        $("#energy-bar").css("width", "50%");
        gamePlay.removeArrows();
        charObject.addTrail();
        gamePlay.checkTrail();
        gamePlay.displayInInventory();
        //console.log(charObject.trailX, charObject.trailY);
    },
    moveLeft: function() {
        charObject.currentLocationX--;
        if (charObject.currentLocationX < 1) {
            charObject.currentLocationX = 0;
        }
        gamePlay.itemPickup();
        userSelect.text("You walk one step west and find " + charObject.itemFound + "." + "(" + charObject.currentLocationX + ", " + charObject.currentLocationY + ")");
        charObject.stats.energy--;
        $("#energy-bar").css("width", "50%");
        gamePlay.removeArrows();
        charObject.addTrail();
        gamePlay.checkTrail();
        gamePlay.displayInInventory();
        //console.log(charObject.trailX, charObject.trailY);
    },
    addToInventory: function(imageSrc) {
        let inventory = $("#inventory");
        let itemImage = $("<img>");
        inventory.append(itemImage);
        itemImage.attr("src", imageSrc);
        itemImage.attr("class", "inventory-item");
    }
}

let gamePlay = {
    gameSpace: new Array(gameSpaceDimension),
    itemSelect: new Array(gameSpaceDimension),
    currentLocation: null,

    createGameSpace: function() {
        for(let j = 0; j < gameSpaceDimension; j++) {
            this.gameSpace[j] = new Array(gameSpaceDimension);
        };
    },
    assignGameSpaceRand: function() {
        for(let i = 0; i < gameSpaceDimension; i++) {
            for(let j = 0; j < gameSpaceDimension; j++) {
                this.gameSpace[i][j] = Math.floor(Math.random()*1000);
            }
        }
        //console.log(this.gameSpace);
        
    },
    assignGrid: function() {
        gridDivRow = []
        gridDiv = []
        gridContainer = $("<div>");
        gridContainer.appendTo("body");
        for(let i = 0; i < gameSpaceDimension; i++) {
            gridDivRow[i] = $("<div>");
            gridDivRow[i].appendTo(gridContainer);
            gridDiv[i] = new Array(gameSpaceDimension);
            for(let j = 0; j < gameSpaceDimension; j++) {
                gridDiv[i][j] = $("<img>");
                gridDiv[i][j].appendTo(gridDivRow[i]);
                gridDiv[i][j].css("width", "50px");
                gridDiv[i][j].css("height", "50px");
                gridDiv[i][j].css("background-color", "#ccc");
                gridDiv[i][j].css("margin", "6");
                gridDiv[i][j].attr("x-value", j)
                gridDiv[i][j].attr("y-value", i);
            }
        }
    },
    assignItems: function() {
        for(let i = 0; i < gameSpaceDimension; i++) {
            this.itemSelect[i] = new Array(gameSpaceDimension);
            for(let j = 0; j < gameSpaceDimension; j++) {
                // 0 ["nothing.", 
                // 1 "an empty Guinness can.",
                // 2"some Irish Stew." ,
                // 3 "an empty Jameson bottle.",
                // 4 "a U2 Album.",
                // 5 "a full Guiness can.",
                // 6 "a full Jameson bottle.",
                // 7 "a Shamrock." ];
                if(this.gameSpace[i][j] < 500) {   
                    this.itemSelect[i][j] = itemArr[0];         
                }
                else if(this.gameSpace[i][j] < 700) {
                    this.itemSelect[i][j] = itemArr[1];                   
                }
                else if(this.gameSpace[i][j] < 850) {
                    this.itemSelect[i][j] = itemArr[2];                    
                }
                else if(this.gameSpace[i][j] < 900) {
                    this.itemSelect[i][j] = itemArr[3];             
                }    
                else if(this.gameSpace[i][j] < 940) {
                    this.itemSelect[i][j] = itemArr[4];             
                }
                else if(this.gameSpace[i][j] < 974) {
                    this.itemSelect[i][j] = itemArr[5];     
                }
                else if(this.gameSpace[i][j] < 999) {
                    this.itemSelect[i][j] = itemArr[6];                  
                }
                else if(this.gameSpace[i][j] < 1000) {
                    this.itemSelect[i][j] = itemArr[7];
                }
            }
        }
        //console.log(this.itemSelect);
    },
    itemPickup: function() {
        for(let i = 0; i < gameSpaceDimension; i++) {
            for(let j = 0; j < gameSpaceDimension; j++) {
                if(charObject.currentLocationX === i && charObject.currentLocationY === j) {
                    console.log(i, j);
                    console.log("rand value before" + this.gameSpace[i][j]);
                    console.log("item before " + this.itemSelect[i][j]);
                    this.gameSpace[i][j] = Math.floor(Math.random()*1000);
                    console.log("rand value after" + this.gameSpace[i][j]);
                    if(this.gameSpace[i][j] < 500) {   
                        charObject.itemFound = this.itemSelect[i][j];
                        this.itemSelect[i][j] = itemArr[0];
                        console.log("item after " + this.itemSelect[i][j]);       
                    }
                    else if(this.gameSpace[i][j] < 700) {
                        charObject.itemFound = this.itemSelect[i][j];
                        this.itemSelect[i][j] = itemArr[1]; 
                        console.log("item after " + this.itemSelect[i][j]);                    
                    }
                    else if(this.gameSpace[i][j] < 850) {
                        charObject.itemFound = this.itemSelect[i][j];
                        this.itemSelect[i][j] = itemArr[2]; 
                        console.log("item after " + this.itemSelect[i][j]);                     
                    }
                    else if(this.gameSpace[i][j] < 900) {
                        this.itemSelect[i][j] = itemArr[3]; 
                        charObject.itemFound = this.itemSelect[i][j]; 
                        console.log("item after " + this.itemSelect[i][j]);             
                    }    
                    else if(this.gameSpace[i][j] < 940) {
                        this.itemSelect[i][j] = itemArr[4];  
                        charObject.itemFound = this.itemSelect[i][j];            
                    }
                    else if(this.gameSpace[i][j] < 974) {
                        this.itemSelect[i][j] = itemArr[5];   
                        charObject.itemFound = this.itemSelect[i][j];   
                    }
                    else if(this.gameSpace[i][j] < 999) {
                        this.itemSelect[i][j] = itemArr[6];    
                        charObject.itemFound = this.itemSelect[i][j];               
                    }
                    else if(this.gameSpace[i][j] < 1000) {
                        this.itemSelect[i][j] = itemArr[7];
                        charObject.itemFound = this.itemSelect[i][j]; 
                    }
                    // pushes items to inventoryArr
                    charObject.inventoryArr.push(charObject.itemFound);
                    console.log(charObject.inventoryArr);
                    charObject.inventoryArr = charObject.inventoryArr.filter(a => a !== 'nothing');
                    console.log(charObject.inventoryArr);

                    //Changes user position on grid. For development purposes only.
                    gridDiv[j][i].css("background-color", "#333");
                    gridDiv[j][i].css("transition-property", "background-color");
                    gridDiv[j][i].css("transition-duration", "0.5s");
                    gridDiv[j][i].css("transition-timing-function", "ease");
                }
                else {
                    gridDiv[j][i].css("background-color", "#ccc");
                    gridDiv[j][i].css("transition-property", "background-color");
                    gridDiv[j][i].css("transition-duration", "0.3s");
                    gridDiv[j][i].css("transition-timing-function", "ease");
                }
            }
        }
    },

    // ["nothing", 
    // "an empty Guinness can",
    // "some Irish Stew" ,
    // "an empty Jameson bottle",
    // "a U2 Album",
    // "a full Guinness can",
    // "a full Jameson bottle",
    // "a Shamrock" ];
    displayInInventory() {
        switch(charObject.itemFound) {
            case itemArr[1]:
                charObject.addToInventory("images/empty-beer.svg");
                console.log("added empty beer");
                break;
            case itemArr[2]:
                charObject.addToInventory("images/irish-stew.svg");
                console.log("added empty beer");
                break;
            case itemArr[3]:
                charObject.addToInventory("images/empty-whiskey.svg");
                console.log("added empty beer");
                break;
            case itemArr[4]:
                charObject.addToInventory("images/U2-album.svg");
                console.log("added empty beer");
                break;
            case itemArr[5]:
                charObject.addToInventory("images/full-beer.svg");
                console.log("added full beer");
                break;
            case itemArr[6]:
                charObject.addToInventory("images/full-whiskey.svg");
                console.log("added empty beer");
                break;
            case itemArr[7]:
                charObject.addToInventory("images/shamrock.svg");
                console.log("added empty beer");
                break;
        }
    },
    removeArrows: function() {
        if(charObject.currentLocationX === 0) {
            //console.log("Arrows removed");
            leftArrowButton.css("opacity", 0);
            leftArrowButton.attr("disabled", "disabled");
        }
        else {
            leftArrowButton.removeAttr("disabled");
            leftArrowButton.css("opacity", 1);
        }
        if(charObject.currentLocationY === 0) {
            //console.log("Arrows removed");
            upArrowButton.css("opacity", 0);
            upArrowButton.attr("disabled", "disabled");
        }
        else {
            upArrowButton.removeAttr("disabled");
            upArrowButton.css("opacity", 1);
        }
        if(charObject.currentLocationX === (gameSpaceDimension - 1)) {
            //console.log("Arrows removed");
            rightArrowButton.css("opacity", 0);
            rightArrowButton.attr("disabled", "disabled");
        }
        else {
            rightArrowButton.removeAttr("disabled");
            rightArrowButton.css("opacity", 1);
        }
        if(charObject.currentLocationY === (gameSpaceDimension - 1)) {
            //console.log("Arrows removed");
            downArrowButton.css("opacity", 0);
            downArrowButton.attr("disabled", "disabled");
        }
        else {
            downArrowButton.removeAttr("disabled");
            downArrowButton.css("opacity", 1);
        }
            //console.log(this.itemSelect[charObject.currentLocationY][charObject.currentLocationX]);
    },
    checkTrail: function() {
        for(let i = 0; i < charObject.trailX.length - 1; i++) {
            if((charObject.trailX[i] === charObject.currentLocationX) && (charObject.trailY[i] === charObject.currentLocationY)) {
                userSelect.text("You don't find anything, it seems you have recently been here before.");
            }
        }
    },
}

document.onkeyup = function(e) {
    switch (e.keyCode) {
        case 37:
            charObject.moveLeft();
            break;
        case 38:
            charObject.moveUp();
            break;
        case 39:
            charObject.moveRight();
            break;
        case 40:
            charObject.moveDown();
            break;
    }
};
upArrowButton.on("click", charObject.moveUp);
rightArrowButton.on("click", charObject.moveRight);
downArrowButton.on("click", charObject.moveDown);
leftArrowButton.on("click", charObject.moveLeft);

gamePlay.createGameSpace();
gamePlay.assignGameSpaceRand();
gamePlay.assignItems();
gamePlay.assignGrid();


//console.log(gamePlay.gameSpace[1][1]);
});
