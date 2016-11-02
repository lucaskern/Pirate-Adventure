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
    , flipPlayer: false
    , score: 0
    , health: undefined
    , pLocX: undefined
    , pLocY: undefined
    , locX: undefined
    , loxY: undefined
    , gridSpace: undefined
    , cells: []
    , TILES: Object.freeze({
        NUM_BOXES: 10
        , BOX_SIZE: 40
        , BOX_COLOR: "lightgreen"
        , BLOCK_NUM: 150
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
        var stone = document.querySelector("#stone");
        var stoneBG = document.querySelector("#stoneBG");
        var player = document.querySelector("#player");
        var playerFlipped = document.querySelector("#playerFlipped");
        var treasure = document.querySelector("#treasure");
        var enemy = document.querySelector('#enemy');
        
        this.health = this.PLAYER.HEALTH;
        
        this.pLocX = this.TILES.BOX_SIZE / 2;
        this.pLocY = this.TILES.BOX_SIZE / 2;
        this.gridSpace = this.canvas.width / this.TILES.BOX_SIZE;
        for (var i = 0; i < this.gridSpace; i++) {
            this.cells[i] = [];
        }
        //this.numBoxes = this.TILES.BLOCK_NUM;
        this.generateTiles();
        this.drawTiles();
        //setInterval(this.moveEnemy, 3000);
        
        //this.drawPlayer();
        this.update();
    }
    , update: function () {
        // schedule a call to update()
        this.animationID = requestAnimationFrame(this.update.bind(this));
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTiles();
        
        fillText(this.ctx, "Score: " + this.score, 20, 20, "14pt courier", "#ddd");
        fillText(this.ctx, "Health: " + this.health, 20, 50, "14pt courier", "#ddd");
        
        if (this.frameCounter % 50 == 0) 
        {
            this.moveEnemy();
        }
        
        this.frameCounter++;
    }
    , generateTiles: function () {
        this.player = false;
        //this.gridSpace = this.canvas.width / this.TILES.BOX_SIZE;
        //var cellNum = this.gridSpace * this.gridSpace;
        //clear cells array
        for (var i = 0; i < this.gridSpace;) {
            for (var j = 0; j < this.gridSpace;) {
                this.cells[i][j] = null;
                //console.log(this.cells[i][j]);
                j++;
            }
            i++;
        }
        //assign block tiles
        for (var i = 0; i < this.TILES.BLOCK_NUM; i++) {
            this.locX = Math.floor(getRandom(0, this.gridSpace));
            this.locY = Math.floor(getRandom(0, this.gridSpace));
            this.cells[this.locX][this.locY] = 1;
        }
        for (var i = 0; i < this.TILES.GOLD_NUM; i++) {
            this.locX = Math.floor(getRandom(0, this.gridSpace));
            this.locY = Math.floor(getRandom(0, this.gridSpace));
            //console.log(this.locX + "," + this.locY)
            this.cells[this.locX][this.locY] = 2;
            //console.log("gold generated");
        }
        for (var i = 0; i < this.TILES.ENEMY_NUM; i++) {
            this.locX = Math.floor(getRandom(0, this.gridSpace));
            this.locY = Math.floor(getRandom(0, this.gridSpace));
            //console.log(this.locX + "," + this.locY)
            this.cells[this.locX][this.locY] = 3;
            //console.log("gold generated");
        }
        while (this.player == false) {
            this.locX = Math.floor(getRandom(0, this.gridSpace));
            this.locY = Math.floor(getRandom(0, this.gridSpace));
            if (this.cells[this.locX][this.locY] == null) {
                this.player = true;
                this.cells[this.locX][this.locY] = 0;
                //console.log(this.locX + "," + this.locY + " IS 0 awjh dka hwih dioaih hido iwdh");
            }
            console.log("player check ran");
        }
        for (var i = 0; i < this.gridSpace;) {
            for (var j = 0; j < this.gridSpace;) {
                console.log("Cell " + i + "," + j + " = " + this.cells[i][j]);
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
                    this.ctx.drawImage(stoneBG, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                    if (this.cells[i][j] == 1) {
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
                    else if (this.cells[i][j] == 0) {
                        this.pLocX = i;
                        this.pLocY = j;
                        if (this.flipPlayer) {
                            this.ctx.drawImage(playerFlipped, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                        }
                        else {
                            this.ctx.drawImage(player, i * this.TILES.BOX_SIZE, j * this.TILES.BOX_SIZE, this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
                        }
                    }
                    j++;
                }
                i++;
            }
        }
        /*, drawPlayer: function () {
            this.ctx.save();
            this.ctx.fillStyle = "red";
            this.ctx.beginPath();
            this.ctx.arc(this.pLocX, this.pLocY, this.PLAYER.SIZE, 0, Math.PI * 2, false);
            this.ctx.closePath();
            //this.ctx.fill();
            this.ctx.restore();
            
            this.ctx.drawImage(player, this.pLocX - (this.TILES.BOX_SIZE / 2), this.pLocY - (this.TILES.BOX_SIZE / 2), this.TILES.BOX_SIZE, this.TILES.BOX_SIZE);
        }*/
        
    , movePlayer: function (dir) {
        for (var i = 0; i < this.gridSpace;) {
            for (var j = 0; j < this.gridSpace;) {
                if (this.cells[i][j] == 0) {
                    if (dir == 0) {
                        if (this.canMove(i, j, dir)) {
                            this.cells[i][j - 1] = 0;
                            this.cells[i][j] = null;
                            this.sound.playEffect(0);
                            console.log("cell " + i + "," + j + " is now null. And " + i + "," + (j - 1) + " is 0.");
                            break;
                        }
                        else {
                            this.sound.playEffect(1);
                        }
                    }
                    else if (dir == 1) {
                        if (this.canMove(i, j, dir)) {
                            this.flipPlayer = false;
                            this.cells[i + 1][j] = 0;
                            this.cells[i][j] = null;
                            this.sound.playEffect(0);
                            console.log("cell " + i + "," + j + " is now null. And " + (i + 1) + "," + j + " is 0.");
                            //this.sound.playEffect(0);
                            return;
                        }
                        else {
                            this.sound.playEffect(1);
                        }
                    }
                    else if (dir == 2) {
                        if (this.canMove(i, j, dir)) {
                            this.cells[i][j + 1] = 0;
                            this.cells[i][j] = null;
                            this.sound.playEffect(0);
                            console.log("cell " + i + "," + j + " is now null. And " + i + "," + (j + 1) + " is 0.");
                            break;
                        }
                        else {
                            this.sound.playEffect(1);
                        }
                    }
                    else if (dir == 3) {
                        if (this.canMove(i, j, dir)) {
                            this.flipPlayer = true;
                            this.cells[i - 1][j] = 0;
                            this.cells[i][j] = null;
                            this.sound.playEffect(0);
                            console.log("cell " + i + "," + j + " is now null. And " + (i - 1) + "," + j + " is 0.");
                            break;
                        }
                        else {
                            this.sound.playEffect(1);
                        }
                    }
                }
                j++;
            }
            i++;
        }
    }
    , moveEnemy: function () {
        for (var i = 0; i < this.gridSpace;) {
            for (var j = 0; j < this.gridSpace;) {
                var moveDir = Math.floor(getRandom(0, 4));
                //console.log(moveDir);
                if (this.cells[i][j] == 3) {
                    if (moveDir == 0) {
                        if (this.canMove(i, j, moveDir)) {
                            this.cells[i][j - 1] = 3;
                            this.cells[i][j] = null;
                            
                            break;
                        }
                        else {}
                    }
                    else if (moveDir == 1) {
                        if (this.canMove(i, j, moveDir)) {
                            this.cells[i + 1][j] = 3;
                            this.cells[i][j] = null;
                            
                            return;
                        }
                        else {}
                    }
                    else if (moveDir == 2) {
                        if (this.canMove(i, j, moveDir)) {
                            this.cells[i][j + 1] = 3;
                            this.cells[i][j] = null;
                            
                            break;
                        }
                        else {}
                    }
                    else if (moveDir == 3) {
                        if (this.canMove(i, j, moveDir)) {
                            this.cells[i - 1][j] = 3;
                            this.cells[i][j] = null;
                            
                            break;
                        }
                        else {}
                    }
                }
                //console.log("move enemy ran");
                j++;
            }
            i++
        }
    }
    , calculateDeltaTime: function () {
        var now, fps;
        now = performance.now();
        fps = 1000 / (now - this.lastTime);
        fps = clamp(fps, 12, 60);
        this.lastTime = now;
        return 1 / fps;
    }
    , canMove: function (i, j, dir) {
        if (dir == 0) {
            if (this.cells[i][j - 1] == 1) {
                return false;
            }
            else if (this.cells[i][j - 1] == 2) {
                this.score++;
                this.sound.playEffect(2);
                return true;
            }
            else {
                return true;
            }
        }
        else if (dir == 1) {
            if (this.cells[i + 1][j] == 1) {
                return false;
            }
            else if (this.cells[i + 1][j] == 2) {
                this.score++;
                this.sound.playEffect(2);
                return true;
            }
            else {
                return true;
            }
        }
        else if (dir == 2) {
            if (this.cells[i][j + 1] == 1) {
                return false;
            }
            else if (this.cells[i][j + 1] == 2) {
                this.score++;
                this.sound.playEffect(2);
                return true;
            }
            else {
                return true;
            }
        }
        else if (dir == 3) {
            if (this.cells[i - 1][j] == 1) {
                return false;
            }
            else if (this.cells[i - 1][j] == 2) {
                this.score++;
                this.sound.playEffect(2);
                return true;
            }
            else {
                return true;
            }
        }
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