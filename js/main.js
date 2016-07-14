//Globale Variablen deklarieren
var stage;
var grid;
var cellStack = new Array();
var currentCell;
  

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
    
    this.Render = function(){
        var cellColor;
        
        if(this === currentCell)
            cellColor = "#1055fa";
        else if(this === grid.StartCell || this === grid.EndCell)
            cellColor = "#075F11";
        else 
            cellColor = "#000000";
        //Draw inner Cell body
        drawRect(this.X,this.Y,this.Size,cellColor);
        
        //draw all walls
        for(var i=0;i<this.Walls.length;i++)
        {
            if(this.Walls[i] == undefined)
                continue;
            
            switch(this.Walls[i].Side){
                case eWallSide.TOP:
                    drawLine(this.X,this.Y,this.X + this.Size, this.Y,"white");
                    break;
                case eWallSide.RIGHT:
                    drawLine(this.X + this.Size ,this.Y,this.X + this.Size, this.Y + this.Size,"white");
                    break;
                case eWallSide.BOTTOM:
                    drawLine(this.X + this.Size ,this.Y + this.Size,this.X, this.Y + this.Size, "white");
                    break;
                case eWallSide.LEFT:
                    drawLine(this.X,this.Y+ this.Size,this.X, this.Y, "white");
                    break;
            }
        }
    }
    
    this.RemoveWall = function(wallSide){
        if(wallSide == undefined)
             return false;
         
         for(var i=0;i<this.Walls.length;i++)
         {
             if(this.Walls[i].Side == wallSide)
             {
                 this.Walls.splice(i,1);
                 return true;
             }
         }
         return false;
    }
}

function Grid(width, heigth, cellSize){
    this.CellAmountX = Math.floor(width / cellSize);
    this.CellAmountY = Math.floor(heigth / cellSize);
    this.Cells = new Array(this.CellAmountX);
    for(var x=0;x<this.Cells.length;x++){
        this.Cells[x] = new Array(this.CellAmountY);
    }
    
    this.FillGridWithCells = function(cellsize){
        for(var x=0;x<this.CellAmountX;x++){
            for(var y=0;y< this.CellAmountY;y++){
                this.Cells[x][y] = new Cell(x * cellsize, y * cellsize, cellsize);
            }
        }
    }
    
    this.FillGridWithCells(cellSize);
    
    this.Render = function(){
         for(var x=0;x<this.CellAmountX;x++){
             for(var y=0;y< this.CellAmountY;y++){
                 this.Cells[x][y].Render();
             }
        }
    }
    
    this.StartCell = undefined;
    this.EndCell = undefined;
    
    this.HasUnvisitedCells = function(){
        for(var x=0;x<this.CellAmountX;x++){
            for(var y=0;y<this.CellAmountY;y++){
                if(!this.Cells[x][y].Visited){
                    return true;  
                }
            }
        }
        return false;
    }
    
    this.GetUnvisitedNeighboursOfCell = function(cell){
        if(!cell)
            return;
        
        var locationX = cell.X / cell.Size;
        var locationY = cell.Y / cell.Size;
        var neighbours = new Array();
        
        /*
        var topCell = grid.Cells[locationX][locationY-1];
        var rightCell = grid.Cells[locationX+1][locationY];
        var bottomCell = grid.Cells[locationX][locationY+1];
        var leftCell = grid.Cells[locationX-1][locationY];
        */
        
        if(locationY-1 >= 0 && !grid.Cells[locationX][locationY-1].Visited)
            neighbours.push(grid.Cells[locationX][locationY-1]);
        
        if(locationX+1 < this.CellAmountX && !grid.Cells[locationX+1][locationY].Visited)
            neighbours.push(grid.Cells[locationX+1][locationY]);
        
        if(locationY + 1 < this.CellAmountY && !grid.Cells[locationX][locationY+1].Visited)
            neighbours.push(grid.Cells[locationX][locationY+1]);
        
        if(locationX - 1 >= 0 && !grid.Cells[locationX-1][locationY].Visited)
            neighbours.push(grid.Cells[locationX-1][locationY]);
        
        
        return neighbours;
    }
    
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
    
    //create grid and fills it with cells
    grid = new Grid(canvasWidth,canvasHeight, 48);
    
    //random start and end cell
    CreateStartAndEnd();

    //easeljs Stage initalisieren
    stage = new createjs.Stage("myCanvas");
    
    //Events registrieren
    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.setFPS(60);
    //stage.addEventListener("click", handleClick);
    //stage.addEventListener("mouseMove", handleMouseMove);
    
    
}

function FinalizeMaze(){
    //removes wall for start and end
    grid.StartCell.RemoveWall(eWallSide.LEFT);
    grid.EndCell.RemoveWall(eWallSide.RIGHT);
}

function CreateStartAndEnd(){
    grid.StartCell = grid.Cells[0][Math.floor(Math.random() * grid.CellAmountY)];
    grid.EndCell = grid.Cells[grid.CellAmountX-1][Math.floor(Math.random() * grid.CellAmountY)];
}

function MakeMaze(){
    
    //at first start, set currentCell to startCell
    if(currentCell == undefined){
        currentCell = grid.StartCell;
    }

    var neighboursOfCurrentCell = grid.GetUnvisitedNeighboursOfCell(currentCell);
    var allNeighboursVisited = neighboursOfCurrentCell.length == 0;
    
    if(!allNeighboursVisited)
    {
        var nextCell = neighboursOfCurrentCell[Math.floor(Math.random() * neighboursOfCurrentCell.length)];
        cellStack.push(currentCell);
        var deltaX = currentCell.X - nextCell.X;
        var deltaY = currentCell.Y - nextCell.Y;
        
        //Remove Walls
        if(deltaX == currentCell.Size){
            currentCell.RemoveWall(eWallSide.LEFT);
            nextCell.RemoveWall(eWallSide.RIGHT);
        }else if(deltaX == -currentCell.Size){
            currentCell.RemoveWall(eWallSide.RIGHT);
            nextCell.RemoveWall(eWallSide.LEFT);
        }
        
        if(deltaY == currentCell.Size){
            currentCell.RemoveWall(eWallSide.TOP);
            nextCell.RemoveWall(eWallSide.BOTTOM);
        }else if(deltaY == -currentCell.Size){
            currentCell.RemoveWall(eWallSide.BOTTOM);
            nextCell.RemoveWall(eWallSide.TOP);
        }
        
        currentCell = nextCell;
        currentCell.Visited = true;
    }else if(cellStack.length > 0)
    {
        var nextCell = cellStack.pop();
        currentCell = nextCell;
    }
}

function handleTick(event){
    
    if(event.paused)
        return;
    
    var fps = createjs.Ticker.getMeasuredFPS();
    $("#fps").html("FPS: "+fps);
    
    if(grid.HasUnvisitedCells()){
        MakeMaze();
        $("#status").html("Labyrinth generieren...");
    }else{
       $("#status").html("Labyrinth geniert");
        FinalizeMaze();
    }
    
    grid.Render();
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

