//Globale Variablen deklarieren
var stage;
var grid;
var cellStack = new Array();
var currentCell;

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
    var canvasWidth = Math.floor($(window).width());
    var canvasHeight = Math.floor($(window).height() * 0.8);

    $("#myCanvas").attr({width: ""+canvasWidth, height: ""+canvasHeight});
    
    //create grid and fills it with cells
    grid = new Grid(canvasWidth,canvasHeight, 48);
    
    //random start and end cell
    CreateStartAndEnd();

    //easeljs Stage initalisieren
    stage = new createjs.Stage("myCanvas");
    createjs.Touch.enable(stage);
    
}

function Start(){
    //Events registrieren
    stage.addEventListener('pressmove', function(event){
        console.log("Mouse was moved while pressed down");
    }); 
    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.setFPS(60);
    //stage.on('stagemousedown', handleMouseDown);
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

function handleMouseDown(event){
    console.log("Mouse Down");
}

function stageClicked(event)
{
    console.log("mouse pressed moved: ");
    console.log(event.stageX+" ; "+event.stageY);
}

$(document).ready(function(){
    init();
    Start();
});

