"use strict";
var app = app || {};
app.main = {
    //properties
    WIDTH: 800
    , HEIGHT: 800
    , canvas: undefined
    , ctx: undefined
    , frameCounter: 0
    , sound: undefined
    , player: false
    , playerDirection: 0
    , score: 0
    , health: undefined
    , pLocX: undefined
    , pLocY: undefined
    , locX: undefined
    , loxY: undefined
    , gridSpace: undefined
    , spawnSpace: undefined
    , cells: []
    , overworld: []
    , TILES: Object.freeze({
        BOX_SIZE: 40
    })
    , OVERWORLD_TILES: Object.freeze({
        BG_COLOR: "lightblue"
        , LAND_COLOR: "green"
        , LAND_NUM: 30
        , DUNGEON_NUM: 3
    })
    , DUNGEON_TILES: Object.freeze({
        BOX_SIZE: 50
        , BLOCK_NUM: 80
        , GOLD_NUM: 3
        , ENEMY_NUM: 3
    })
    , PLAYER: {
        HEALTH: 3
        , WALK: 1
        , DASH: 2
        , SIZE: 5
    }
    , ENEMY: {
        HEALTH: 3
        , SPEED: 1
        , DMG: 1
    }
    , GAMESTATE: {
        INTRO: 0
        , OVERWORLD: 1
        , DUNGEON: 2
        , PAUSE: 3
        , DEAD: 4
    }
    , numBoxes: this.BLOCK_NUM
    , init: function () {
        console.log("app.main.init() called");
        // initialize properties
        this.canvas = document.querySelector('canvas');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        this.bgAudio = document.querySelector("#bgAudio");
        this.bgAudio.volume = 0.25;
        this.effectAudio = document.querySelector("#effectAudio");
        this.effectAudio.volume = 0.3;
        var border = document.querySelector("#border");
        var stone = document.querySelector("#stone");
        var stoneBG = document.querySelector("#stoneBG");
        var playerUp = document.querySelector("#playerUp");
        var treasure = document.querySelector("#treasure");
        var enemy = document.querySelector('#enemy');
        var ladder = document.querySelector('ladder');
        var water = document.querySelector("water");
        var redX = document.querySelector("redX");
        this.health = this.PLAYER.HEALTH;
        this.pLocX = this.TILES.BOX_SIZE / 2;
        this.pLocY = this.TILES.BOX_SIZE / 2;
        this.gridSpace = this.canvas.width / this.TILES.BOX_SIZE;
        this.spawnSpace = this.gridSpace - 1;
        for (var i = 0; i < this.gridSpace; i++) {
            this.cells[i] = [];
            this.overworld[i] = [];
        }
        this.GAMESTATE = this.GAMESTATE.OVERWORLD;
        console.log(this.GAMESTATE);
        //this.numBoxes = this.TILES.BLOCK_NUM;
        this.generateOverworld();
        //this.generateDungeon();
        this.drawTiles();
        this.update();
    }
    , update: function () {
        // schedule a call to update()
        this.animationID = requestAnimationFrame(this.update.bind(this));
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTiles();
        fillText(this.ctx, "Score: " + this.score, 20, this.canvas.height - 15, "24pt  verdana", "#F00");
        fillText(this.ctx, "Health: " + this.health, this.canvas.width - 200, this.canvas.height - 15, "24pt verdana", "#F00");
        if (this.frameCounter % 50 == 0) {
            this.moveEnemy();
        }
        this.frameCounter++;
        //console.log(this.GAMESTATE);
    }
    , generateOverworld: function () {
        this.player = false;
        //clear cells array
        for (var i = 0; i < this.gridSpace;) {
            for (var j = 0; j < this.gridSpace;) {
                this.cells[i][j] = null;
                //console.log(this.cells[i][j]);
                j++;
            }
            i++;
        }
        //set bounds
        for (var i = 0; i < this.gridSpace; i++) {
            this.cells[0][i] = 99;
            this.cells[i][0] = 99;
            this.cells[this.gridSpace - 1][i] = 99;
            this.cells[i][this.gridSpace - 1] = 99;
        }
        //assign block tiles
        for (var i = 0; i < this.OVERWORLD_TILES.LAND_NUM; i++) {
            this.locX = Math.floor(getRandom(1, this.spawnSpace));
            this.locY = Math.floor(getRandom(1, this.spawnSpace));
            this.cells[this.locX][this.locY] = 1;
        }
        for (var i = 0; i < this.OVERWORLD_TILES.DUNGEON_NUM; i++) {
            this.locX = Math.floor(getRandom(1, this.spawnSpace));
            this.locY = Math.floor(getRandom(1, this.spawnSpace));
            if (this.cells[this.locX - 1][this.locY] == 1 || this.cells[this.locX + 1][this.locY] == 1 || this.cells[this.locX][this.locY - 1] == 1 || this.cells[this.locX][this.locY + 1] == 1) {
                this.cells[this.locX][this.locY] = 2;
            }
        }
        while (this.player == false) {
            this.locX = Math.floor(getRandom(1, this.spawnSpace));
            this.locY = Math.floor(getRandom(1, this.spawnSpace));
            if (this.cells[this.locX][this.locY] == null) {
                this.player = true;
                this.cells[this.locX][this.locY] = 0;
            }
            console.log("player check ran");
        }
        for (var i = 0; i < this.gridSpace;) {
            for (var j = 0; j < this.gridSpace;) {
                this.overworld[i][j] = this.cells[i][j];
                //console.log(this.cells[i][j]);
                j++;
            }
            i++;
        }
    }
    , generateDungeon: function () {
        this.player = false;
        //clear cells array
        for (var i = 0; i < this.gridSpace;) {
            for (var j = 0; j < this.gridSpace;) {
                this.cells[i][j] = null;
                //console.log(this.cells[i][j]);
                j++;
            }
            i++;
        }
        //set bounds
        for (var i = 0; i < this.gridSpace; i++) {
            this.cells[0][i] = 99;
            this.cells[i][0] = 99;
            this.cells[this.gridSpace - 1][i] = 99;
            this.cells[i][this.gridSpace - 1] = 99;
        }
        //assign block tiles
        for (var i = 0; i < this.DUNGEON_TILES.BLOCK_NUM; i++) {
            this.locX = Math.floor(getRandom(1, this.spawnSpace));
            this.locY = Math.floor(getRandom(1, this.spawnSpace));
            this.cells[this.locX][this.locY] = 1;
        }
        for (var i = 0; i < this.DUNGEON_TILES.GOLD_NUM; i++) {
            this.locX = Math.floor(getRandom(1, this.spawnSpace));
            this.locY = Math.floor(getRandom(1, this.spawnSpace));
            this.cells[this.locX][this.locY] = 2;
        }
        for (var i = 0; i < this.DUNGEON_TILES.ENEMY_NUM; i++) {
            //var e = {};
            this.locX = Math.floor(getRandom(1, this.spawnSpace));
            this.locY = Math.floor(getRandom(1, this.spawnSpace));
            /*e.locX = this.locX;
                e.locY = this.locY;
            
                e.health = this.ENEMY.HEALTH;*/
            this.cells[this.locX][this.locY] = 3;
        }
        while (this.player == false) {
            this.locX = Math.floor(getRandom(1, this.spawnSpace));
            this.locY = Math.floor(getRandom(1, this.spawnSpace));
            if (this.cells[this.locX][this.locY] == null) {
                this.player = true;
                this.cells[this.locX][this.locY] = 0;
            }
            console.log("player check ran");
        }
        for (var i = 0; i < 1; i++) {
            this.locX = Math.floor(getRandom(1, this.spawnSpace));
            this.locY = Math.floor(getRandom(1, this.spawnSpace));
            this.cells[this.locX][this.locY] = 4;
        }
        for (var i = 0; i < this.spawnSpace;) {
            for (var j = 0; j < this.spawnSpace;) {
                //console.log("Cell " + i + "," + j + " = " + this.cells[i][j]);
                j++;
            }
            i++;
        }
    }
    , drawTiles: function () {
        //this.gridSpace = this.canvas.width / this.TILES.BOX_SIZE;
        //var cellNum = this.gridSpace * this.gridSpace;
        for (var i = 0; i < this.gridSpace;) {
            for (var j = 0; j < this.gridSpace;) {
                if (this.GAMESTATE == 1) {
                    this.ctx.drawImage(water, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                    if (this.cells[i][j] == 99) {
                        this.ctx.drawImage(border, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                        //console.log(i + ',' + j);
                    }
                    else if (this.cells[i][j] == 1) {
                        this.ctx.save();
                        this.ctx.fillStyle = this.OVERWORLD_TILES.LAND_COLOR;
                        this.ctx.fillRect(i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                        this.ctx.restore();
                    }
                    else if (this.cells[i][j] == 2) {
                        this.ctx.save();
                        this.ctx.fillStyle = this.OVERWORLD_TILES.LAND_COLOR;
                        this.ctx.fillRect(i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                        this.ctx.restore();
                        this.ctx.drawImage(redX, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                        // console.log("Gold ran");
                    }
                    else if (this.cells[i][j] == 5) {
                        this.ctx.save();
                        this.ctx.fillStyle = "black";
                        this.ctx.fillRect(i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                        this.ctx.restore();
                    }
                    else if (this.cells[i][j] == 0) {
                        this.pLocX = i;
                        this.pLocY = j;
                        //console.log(player);
                        switch (this.playerDirection) {
                        case 0:
                            this.ctx.drawImage(playerUp, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                            break;
                        case 1:
                            this.ctx.drawImage(playerRight, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                            break;
                        case 2:
                            this.ctx.drawImage(playerDown, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                            break;
                        case 3:
                            this.ctx.drawImage(playerLeft, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                            break;
                        }
                    }
                }
                else if (this.GAMESTATE == 2) {
                    this.ctx.drawImage(stoneBG, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                    if (this.cells[i][j] == 99) {
                        this.ctx.drawImage(border, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                        //console.log(i + ',' + j);
                    }
                    else if (this.cells[i][j] == 1) {
                        this.ctx.drawImage(stone, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                        //console.log(i + ',' + j);
                    }
                    else if (this.cells[i][j] == 2) {
                        this.ctx.drawImage(treasure, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                        // console.log("Gold ran");
                    }
                    else if (this.cells[i][j] == 3) {
                        this.ctx.drawImage(enemy, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                        // console.log("Gold ran");
                    }
                    else if (this.cells[i][j] == 4) {
                        this.ctx.drawImage(ladder, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                        // console.log("Gold ran");
                    }
                    else if (this.cells[i][j] == 0) {
                        this.pLocX = i;
                        this.pLocY = j;
                        //console.log(player);
                        switch (this.playerDirection) {
                        case 0:
                            this.ctx.drawImage(playerUp, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                            break;
                        case 1:
                            this.ctx.drawImage(playerRight, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                            break;
                        case 2:
                            this.ctx.drawImage(playerDown, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                            break;
                        case 3:
                            this.ctx.drawImage(playerLeft, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                            break;
                        }
                    }
                }
                j++;
            }
            i++;
        }
    }
    , movePlayer: function (dir) {
        var moveParameters = [];
        for (var i = 1; i < this.spawnSpace;) {
            for (var j = 1; j < this.spawnSpace;) {
                if (this.cells[i][j] == 0) {
                    moveParameters = this.canMove(i, j, dir);
                    this.executeMove(i, j, dir, moveParameters);
                    return;
                }
                j++;
            }
            i++;
        }
    }
    , moveEnemy: function () {
            var moveParameters = [];
            for (var i = 1; i < this.spawnSpace;) {
                for (var j = 1; j < this.spawnSpace;) {
                    var moveDir = Math.floor(getRandom(0, 4));
                    if (this.cells[i][j] == 3) {
                        moveParameters = this.canMove(i, j, moveDir);
                        this.executeMove(i, j, moveDir, moveParameters);
                        break;
                    }
                    j++;
                }
                i++
            }
        }
        //returns a
        
    , canMove: function (i, j, dir) {
        var moveData = [];
        var movingBlock = this.cells[i][j];
        var hitBlock;
        switch (dir) {
        case 0:
            hitBlock = this.cells[i][j - 1];
            break;
        case 1:
            hitBlock = this.cells[i + 1][j];
            break;
        case 2:
            hitBlock = this.cells[i][j + 1];
            break;
        case 3:
            hitBlock = this.cells[i - 1][j];
            break;
        }
        if (this.GAMESTATE == 1) {
            switch (movingBlock) {
            case 0:
                moveData[1] = "player";
                break;
            case 3:
                moveData[1] = "enemy";
                break;
            }
            switch (hitBlock) {
            case 0:
                moveData[2] = "player";
                break;
            case 1:
                moveData[2] = "land";
                break;
            case 2:
                moveData[2] = "dungeon";
                break;
            case 3:
                moveData[2] = "enemy";
                break;
            case 5:
                moveData[2] = "donegeon";
                break;
            case 99:
                moveData[2] = "border";
                break;
            case null:
                moveData[2] = "empty";
            }
            return moveData;
        }
        else if (this.GAMESTATE == 2) {
            switch (movingBlock) {
            case 0:
                moveData[1] = "player";
                break;
            case 3:
                moveData[1] = "enemy";
                break;
            }
            switch (hitBlock) {
            case 0:
                moveData[2] = "player";
                break;
            case 1:
                moveData[2] = "block";
                break;
            case 2:
                moveData[2] = "gold";
                break;
            case 3:
                moveData[2] = "enemy";
                break;
            case 4:
                moveData[2] = "ladder";
                break;
            case 99:
                moveData[2] = "border";
                break;
            case null:
                moveData[2] = "empty";
            }
            return moveData;
        }
    }
    , executeMove: function (i, j, dir, moveData) {
        //console.log(moveData);
        //Player movement rules
        //DUNGEON MOVEMENT
        if (this.GAMESTATE == 2) {
            if (moveData[1] == "player" && moveData[2] == "empty") {
                switch (dir) {
                case 0:
                    this.cells[i][j] = null;
                    this.cells[i][j - 1] = 0;
                    break;
                case 1:
                    this.cells[i][j] = null;
                    this.cells[i + 1][j] = 0;
                    break;
                case 2:
                    this.cells[i][j] = null;
                    this.cells[i][j + 1] = 0;
                    break;
                case 3:
                    this.cells[i][j] = null;
                    this.cells[i - 1][j] = 0;
                    break;
                }
                this.sound.playEffect(0);
            }
            else if (moveData[1] == "player" && moveData[2] == "block") {
                this.sound.playEffect(1);
            }
            else if (moveData[1] == "player" && moveData[2] == "gold") {
                switch (dir) {
                case 0:
                    this.cells[i][j] = null;
                    this.cells[i][j - 1] = 0;
                    break;
                case 1:
                    this.cells[i][j] = null;
                    this.cells[i + 1][j] = 0;
                    break;
                case 2:
                    this.cells[i][j] = null;
                    this.cells[i][j + 1] = 0;
                    break;
                case 3:
                    this.cells[i][j] = null;
                    this.cells[i - 1][j] = 0;
                    break;
                }
                this.score++;
                this.sound.playEffect(2);
            }
            if (moveData[1] == "enemy" && moveData[2] == "empty") {
                switch (dir) {
                case 0:
                    this.cells[i][j] = null;
                    this.cells[i][j - 1] = 3;
                    break;
                case 1:
                    this.cells[i][j] = null;
                    this.cells[i + 1][j] = 3;
                    break;
                case 2:
                    this.cells[i][j] = null;
                    this.cells[i][j + 1] = 3;
                    break;
                case 3:
                    this.cells[i][j] = null;
                    this.cells[i - 1][j] = 3;
                    break;
                }
            }
            else if (moveData[1] == "enemy" && moveData[2] == "player") {
                this.health--;
            }
            else if (moveData[1] == "player" && moveData[2] == "ladder") {
                this.enterOverworld();
            }
        }
        else if (this.GAMESTATE == 1) {
            if (moveData[1] == "player" && moveData[2] == "empty") {
                switch (dir) {
                case 0:
                    this.cells[i][j] = null;
                    this.cells[i][j - 1] = 0;
                    break;
                case 1:
                    this.cells[i][j] = null;
                    this.cells[i + 1][j] = 0;
                    break;
                case 2:
                    this.cells[i][j] = null;
                    this.cells[i][j + 1] = 0;
                    break;
                case 3:
                    this.cells[i][j] = null;
                    this.cells[i - 1][j] = 0;
                    break;
                }
                this.sound.playEffect(0);
            }
            else if (moveData[1] == "player" && moveData[2] == "land", "border", "dungeon") {
                this.sound.playEffect(1);
            }
        }
    }
    , attackBlock: function () {
        console.log("attack ran");
        var attackParameters = [];
        for (var i = 1; i < this.spawnSpace;) {
            for (var j = 1; j < this.spawnSpace;) {
                if (this.cells[i][j] == 0) {
                    switch (this.playerDirection) {
                    case 0:
                        if (this.cells[i][j - 1] == 3) {
                            this.cells[i][j - 1] = null;
                            this.sound.playEffect(3);
                        }
                        else if (this.cells[i][j - 1] == 0) {
                            this.health--;
                        }
                        else if (this.cells[i][j - 1] == 2 && this.GAMESTATE == 1) {
                            this.overworld[i][j - 1] = 5
                            this.enterDungeon();
                        }
                        break;
                    case 1:
                        if (this.cells[i + 1][j] == 3) {
                            this.cells[i + 1][j] = null;
                            this.sound.playEffect(3);
                        }
                        else if (this.cells[i + 1][j] == 0) {
                            this.health--;
                        }
                        else if (this.cells[i + 1][j] == 2 && this.GAMESTATE == 1) {
                            this.overworld[i + 1][j] = 5
                            this.enterDungeon();
                        }
                        break;
                    case 2:
                        if (this.cells[i][j + 1] == 3) {
                            this.cells[i][j + 1] = null;
                            this.sound.playEffect(3);
                        }
                        else if (this.cells[i][j + 1] == 0) {
                            this.health--;
                        }
                        else if (this.cells[i][j + 1] == 2 && this.GAMESTATE == 1) {
                            this.overworld[i][j + 1] = 5
                            this.enterDungeon();
                        }
                        break;
                    case 3:
                        if (this.cells[i - 1][j] == 3) {
                            this.cells[i - 1][j] = null;
                            this.sound.playEffect(3);
                        }
                        else if (this.cells[i - 1][j] == 0) {
                            this.health--;
                        }
                        else if (this.cells[i - 1][j] == 2 && this.GAMESTATE == 1) {
                            this.overworld[i - 1][j] = 5
                            this.enterDungeon();
                        }
                        break;
                    }
                    return;
                }
                j++;
            }
            i++;
        }
    }
    , enterDungeon: function () {
        this.generateDungeon();
        this.GAMESTATE = 2;
        console.log("enter dungeon");
    }
    , enterOverworld: function () {
        for (var i = 0; i < this.gridSpace;) {
            for (var j = 0; j < this.gridSpace;) {
                this.cells[i][j] = this.overworld[i][j];
                //console.log(this.cells[i][j]);
                j++;
            }
            i++;
        }
        this.GAMESTATE = 1;
        console.log("leave Dungeon");
    }
    , executeAttack: function (block) {}
    , flipPlayerSprite: function (dir) {
        //console.log(player);
        this.playerDirection = dir;
    }
    , damage: function () {
        this.health--;
    }
    , calculateDeltaTime: function () {
        var now, fps;
        now = performance.now();
        fps = 1000 / (now - this.lastTime);
        fps = clamp(fps, 12, 60);
        this.lastTime = now;
        return 1 / fps;
    }
    , sprite: function (options) {
        var that = {}
            , frameIndex = 0
            , tickCount = 0
            , ticksPerFrame = options.ticksPerFrame || 0
            , numberOfFrames = options.numberOfFrames || 1;
        that.context = options.context;
        that.width = options.width;
        that.height = options.height;
        that.image = options.image;
        that.update = function () {
            tickCount += 1;
            if (tickCount > ticksPerFrame) {
                tickCount = 0;
                // If the current frame index is in range
                if (frameIndex < numberOfFrames - 1) {
                    // Go to the next frame
                    frameIndex += 1;
                }
                else {
                    frameIndex = 0;
                }
            }
        };
        that.render = function () {
            // Clear the canvas
            that.context.clearRect(0, 0, that.width, that.height);
            // Draw the animation
            that.context.drawImage(that.image, frameIndex * that.width / numberOfFrames, 0, that.width / numberOfFrames, that.height, 0, 0, that.width / numberOfFrames, that.height);
        };
        return that;
    }
};