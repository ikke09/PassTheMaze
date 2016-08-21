//Globale Variablen deklarieren
var stage;
var grid;
var cellSize = 48;
var cellStack = new Array();
var canvasWidth;
var canvasHeight;
var mazeFinished = false;
var score;
var choosenCell;

//----Hilfsfunktionen
function drawLine(x1, y1, x2, y2, color){
    var line = new createjs.Shape();
    
    line.graphics.setStrokeStyle(1);
    if(color === "" || color == undefined)
        color = "#ffffff";
    
    line.graphics.setStrokeStyle(3);
    line.graphics.beginStroke(color);
    line.graphics.moveTo(x1,y1);
    line.graphics.lineTo(x2,y2);
    
    stage.addChild(line);
}

function drawRect(x,y,size,color){
    var rect = new createjs.Shape();
    if(color == undefined || color ==="")
        color = "#000000";
    
    rect.graphics.setStrokeStyle(0);
    rect.graphics.beginFill(color);
    rect.graphics.drawRect(x,y,size,size);
    rect.graphics.endFill();
    
    stage.addChild(rect);
}

function init(){
    
    //Set size of the canvas to half of the webpage
    canvasWidth = Math.floor($(window).width());
    canvasHeight = Math.floor($(window).height() * 0.8);

    $("#myCanvas").attr({width: ""+canvasWidth, height: ""+canvasHeight});
    
    //create grid and fills it with cells
    grid = new Grid(canvasWidth,canvasHeight, cellSize);
    
    //random start and end cell
    CreateStartAndEnd();

    //easeljs Stage initalisieren
    stage = new createjs.Stage("myCanvas");
    createjs.Touch.enable(stage);
}

function Start(){
    //Events registrieren
    //stage.addEventListener('stagemousedown', startDrag);
    document.onkeydown = handleKeyDown;
    //stage.addEventListener('keydown', handleKeyDown);
    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.setFPS(60);
    
    grid.CurrentCell.addEventListener("pressmove", handlePressedMove);
}

function FinalizeMaze(){
    //removes wall for start and end
    grid.StartCell.RemoveWall(eWallSide.LEFT);
    grid.EndCell.RemoveWall(eWallSide.RIGHT);
}

function CreateStartAndEnd(){
    grid.StartCell = grid.CurrentCell = grid.Cells[0][Math.floor(Math.random() * grid.CellAmountY)];
    grid.EndCell = grid.Cells[grid.CellAmountX-1][Math.floor(Math.random() * grid.CellAmountY)];
}

function MakeMaze(){
    
    //at first start, set currentCell to startCell
    if(grid.CurrentCell == undefined){
        grid.CurrentCell = grid.StartCell;
    }

    var neighboursOfCurrentCell = grid.GetUnvisitedNeighboursOfCell(grid.CurrentCell);
    var allNeighboursVisited = neighboursOfCurrentCell.length == 0;
    
    if(!allNeighboursVisited)
    {
        var nextCell = neighboursOfCurrentCell[Math.floor(Math.random() * neighboursOfCurrentCell.length)];
        cellStack.push(grid.CurrentCell);
        var deltaX = grid.CurrentCell.X - nextCell.X;
        var deltaY = grid.CurrentCell.Y - nextCell.Y;
        
        //Remove Walls
        if(deltaX == grid.CurrentCell.Size){
            grid.CurrentCell.RemoveWall(eWallSide.LEFT);
            nextCell.RemoveWall(eWallSide.RIGHT);
        }else if(deltaX == -grid.CurrentCell.Size){
            grid.CurrentCell.RemoveWall(eWallSide.RIGHT);
            nextCell.RemoveWall(eWallSide.LEFT);
        }
        
        if(deltaY == grid.CurrentCell.Size){
            grid.CurrentCell.RemoveWall(eWallSide.TOP);
            nextCell.RemoveWall(eWallSide.BOTTOM);
        }else if(deltaY == -grid.CurrentCell.Size){
            grid.CurrentCell.RemoveWall(eWallSide.BOTTOM);
            nextCell.RemoveWall(eWallSide.TOP);
        }
        
        grid.CurrentCell = nextCell;
        grid.CurrentCell.Visited = true;
    }else if(cellStack.length > 0)
    {
        var nextCell = cellStack.pop();
        grid.CurrentCell = nextCell;
    }
}

function handleTick(event){
    
    if(event.paused)
        return;
    
    var fps = Math.round(createjs.Ticker.getMeasuredFPS());
    $("#fps").html("FPS: "+fps);
    
    //Labyrinth erzeugen
    while(!mazeFinished){
        MakeMaze();
        $("#status").html("Labyrinth generieren...");
        
        if(!grid.HasUnvisitedCells()){
            mazeFinished = true;
            $("#status").html("Labyrinth geniert");
            FinalizeMaze();
            grid.CurrentCell = grid.StartCell;
            score = new Score();
        }
    }
    
    //Render und updaten
    grid.Render();
    stage.update();
    stage.removeAllChildren();
    
    //Spieler hat Ziel erreicht
    if(grid.CurrentCell === grid.EndCell){
        score.EndTime = new Date();
        score.ShowResult();
        createjs.Ticker.paused = true;
    }
    
   
}

function startDrag(event)
{
    console.log("Click on Choosen Cell");
}

function handlePressedMove(event){
    
    console.log("pressmove");
    
    if(!mazeFinished)
        return;
    
    var mouseLocationOnGridX = Math.floor(stage.mouseX / cellSize);
    var mouseLocationOnGridY = Math.floor(stage.mouseY / cellSize);
    
    choosenCell = grid.Cells[mouseLocationOnGridX][mouseLocationOnGridY];
    console.log("ChoosenCell" + choosenCell);
    if(choosenCell != grid.CurrentCell || !choosenCell)
        return;
    
    choosenCell.X = Math.floor(stage.mouseX / cellSize);
    choosenCell.Y = Math.floor(stage.mouseY / cellSize);
}

//KEYCODES
/*
UP = 38 || W = 87
DOWN = 40 || S = 83
LEFT = 37 || A = 65
RIGHT = 39 || D = 68
*/

function handleKeyDown(event){
    if(!mazeFinished)
        return;
    
    var currentGridPosX = Math.floor(grid.CurrentCell.X / cellSize);
    var currentGridPosY = Math.floor(grid.CurrentCell.Y / cellSize);
    switch(event.keyCode){
        case 83: //DOWN
        case 40:
            var nextGridPosY = currentGridPosY + 1;
            if(nextGridPosY < grid.CellAmountY && !grid.CurrentCell.HasWall(eWallSide.BOTTOM)){
                grid.CurrentCell.Choosen = true;
                grid.CurrentCell = grid.Cells[currentGridPosX][nextGridPosY];
                score.IncreaseMoveCounter();
            }
            break;
        case 87: //UP
        case 38:
            var nextGridPosY = currentGridPosY - 1;
            if(nextGridPosY >= 0 && !grid.CurrentCell.HasWall(eWallSide.TOP)){
                grid.CurrentCell.Choosen = true;
                grid.CurrentCell = grid.Cells[currentGridPosX][nextGridPosY];
                score.IncreaseMoveCounter();
            }
            break;
        case 68: //LEFT
        case 39:
            var nextGridPosX = currentGridPosX + 1;
            if(nextGridPosX < grid.CellAmountX && !grid.CurrentCell.HasWall(eWallSide.RIGHT)){
                grid.CurrentCell.Choosen = true;
                grid.CurrentCell = grid.Cells[nextGridPosX][currentGridPosY];
                score.IncreaseMoveCounter();
            }
            break;
        case 65: //RIGHT
        case 37:
            var nextGridPosX = currentGridPosX - 1;
            if(nextGridPosX >= 0 && !grid.CurrentCell.HasWall(eWallSide.LEFT)){
                grid.CurrentCell.Choosen = true;
                grid.CurrentCell = grid.Cells[nextGridPosX][currentGridPosY];
                score.IncreaseMoveCounter();
            }
            break;
    }
    
}

$(document).ready(function(){
    init();
    Start();
});

