//Globale Variablen deklarieren
var stage;
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
    
    if(cellColor == undefined || cellColor === "")
        cellColor = "#000";
    
    if(wallColor == undefined || wallColor === "")
        wallColor = "#fff";
    
    //Draw inner Cell body
    drawRect(this.X,this.Y,this.Size,cellColor);
    
    //draw all walls
    for(var i=0;i<this.Walls.length;i++)
    {
        if(this.Walls[i] == undefined)
            continue;
        
        switch(this.Walls[i].Side){
            case eWallSide.TOP:
                drawLine(this.X,this.Y,this.X + this.Size, this.Y,wallColor);
                break;
            case eWallSide.RIGHT:
                drawLine(this.X + this.Size ,this.Y,this.X + this.Size, this.Y + this.Size,wallColor);
                break;
            case eWallSide.BOTTOM:
                drawLine(this.X + this.Size ,this.Y + this.Size,this.X, this.Y + this.Size, wallColor);
                break;
            case eWallSide.LEFT:
                drawLine(this.X,this.Y+ this.Size,this.X, this.Y, wallColor);
                break;
        }
    }
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

//----Hilfsfunktionen
function drawLine(x1, y1, x2, y2, color){
    var line = new createjs.Shape();
    
    line.graphics.setStrokeStyle(1);
    if(color === "" || color == undefined)
        color = "#ffffff";
    
    line.graphics.beginStroke(color);
    line.graphics.moveTo(x1,y1);
    line.graphics.lineTo(x2,y2);
    
    stage.addChild(line);
}

function drawRect(x,y,size,color){
    var rect = new createjs.Shape();
    if(color == undefined || color ==="")
        color = "#000000";
    
    rect.graphics.beginFill(color);
    rect.graphics.drawRect(x,y,size,size);
    rect.graphics.endFill();
    
    stage.addChild(rect);
}

function init(){
    
    //Set size of the canvas to half of the webpage
    var canvasWidth = Math.floor($(window).width() * 0.8);
    var canvasHeight = Math.floor($(window).height() * 0.8);

    $("#myCanvas").attr({width: ""+canvasWidth, height: ""+canvasHeight});
    
    //size of cells
    cellsize = 19;
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
    createjs.Ticker.setFPS(10);
    stage.addEventListener("click", handleClick);
    stage.addEventListener("mouseMove", handleMouseMove);
}

function handleTick(event){
    //render the grid
    if(event.paused)
        return;
    
    console.log("FPS: "+createjs.Ticker.framerate);
    for(var x=0;x<grid.length;x++){
        for(var y=0;y< grid[0].length;y++){
           grid[x][y].Render("blue","green");
        }
    }
    
    console.log("All Cells renderd");
    stage.update();
    stage.removeAllChildren();
}

function handleClick(event){
    console.log("Click");
}

function handleMouseMove(event){
    console.log("mouse move");
}

$(document).ready(function(){
    init();
});

