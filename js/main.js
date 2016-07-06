//Globale Variablen deklarieren
var stage;
var gfx;
var grid;

var eWallSide = {
    TOP : {value: 0, name: "Top", direction: "north"},
    RIGHT : {value: 1, name: "Right", direction: "east"},
    BOTTOM : {value: 2, name: "Bottom", direction: "south"},
    LEFT : {value: 3, name: "Left", direction: "west"},
};

function Wall(wallSide){
    this.Side = wallSide;
}

function Cell(posX, posY, size){
    this.X = posX;
    this.Y = posY;
    this.Size = size;
    this.Walls = [new Wall(eWallSide.TOP), new Wall(eWallSide.RIGHT),new Wall(eWallSide.BOTTOM), new Wall(eWallSide.LEFT)];
    this.Visited = false;
}

//draws the Cell to the Screen
Cell.prototype.Render = function(cellColor, wallColor){
    
    console.log("Render Cell");
    
    if(gfx == undefined)
        gfx = new createjs.Graphics();
    
    if(cellColor == undefined || cellColor === "")
        cellColor = "#000";
    
    if(wallColor == undefined || wallColor === "")
        wallColor = "#fff";
    
    gfx.clear();
    gfx.beginFill(cellColor).drawRect(this.X,this.Y,this.Size,this.Size);
    gfx.endFill();
    gfx.setStrokeStyle(1);
    gfx.beginStroke(wallColor);
    for(var i=0;i<this.Walls.length;i++)
    {
        if(this.Walls[i] == undefined)
            continue;
        
        switch(this.Walls[i].Side){
            case eWallSide.TOP:
                gfx.moveTo(this.X,this.Y);
                gfx.lineTo(this.X + this.Size, this.Y);
                break;
            case eWallSide.RIGHT:
                gfx.moveTo(this.X + this.Size,this.Y);
                gfx.lineTo(this.X + this.Size, this.Y + this.Size);
                break;
            case eWallSide.BOTTOM:
                gfx.moveTo(this.X + this.Size, this.Y + this.Size);
                gfx.lineTo(this.X, this.Y + this.Size);
                break;
            case eWallSide.LEFT:
                gfx.moveTo(this.X, this.Y + this.Size);
                gfx.lineTo(this.X,this.Y);
                break;
        }
    }
    gfx.endStroke();
    var shape = new createjs.Shape(gfx);
    stage.addChild(shape);
}

//Removes the selected Wall from the Cell
//returns true if a wall was removed
Cell.prototype.RemoveWall = function(wallSide){
    
    if(wallSide == undefined)
        return false;
    
    this.Walls.forEach(function(wall)
    {
        if(wall.Side == wallSide)
        {
            this.Walls.splice(this.Walls.indexOf(wall),1);
            return true;
        }
    });
    return false;
}

function init(){
    
    //Set size of the canvas to half of the webpage
    var canvasWidth = Math.floor($(window).width() * 0.8);
    var canvasHeight = Math.floor($(window).height() * 0.8);

    $("#myCanvas").attr({width: ""+canvasWidth, height: ""+canvasHeight});
    
    //size of cells
    cellsize = 10;
    var cellAmountWidth = Math.floor(canvasWidth / cellsize);
    var cellAmountHeigth = Math.floor(canvasHeight / cellsize);
    
    //create 2D grid Array
    grid = new Array(cellAmountWidth);
    for(var x=0;x<grid.length;x++){
        grid[x] = new Array(cellAmountHeigth);
    }
    
    //fill the grid with cells
    for(var x=0;x<grid.length;x++){
        for(var y=0;y< grid[0].length;y++){
            grid[x][y] = new Cell(x * cellsize, y * cellsize, cellsize);
        }
    }
    
    //easeljs Stage initalisieren
    stage = new createjs.Stage("myCanvas");
    
    //Events registrieren
    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.setFPS
    stage.addEventListener("click", handleClick);
    stage.addEventListener("mouseMove", handleMouseMove);
}

function handleTick(event){
    //fill the grid with cells
    for(var x=0;x<grid.length;x++){
        for(var y=0;y< grid[0].length;y++){
            grid[x][y].Render("#0000ff","00ff00");
        }
    }
    stage.update();
}

function handleClick(event){
    
}

function handleMouseMove(event){
    
}

$(document).ready(function(){
    init();
});

