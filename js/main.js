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
    
    this.draw = function(bitmapdata, color){
        if(bitmapdata == undefined)
            return;
        
        if(color == undefined || color == "")
            color = "#ffffff";
        
        context = bitmapdata.context;
        context.beginPath();
        context.strokeStyle = color;
        context.fillStyle = color;
        
        for(var w = 0; w<this.Walls.length;w++){
            
            if(this.Walls[w] == undefined)
                continue;
        
            if(this.Walls[w].Side == eWallSide.TOP)
            {
                context.moveTo(this.Walls[w].X,this.Walls[w].Y);
                context.lineTo(this.Walls[w].X + this.Walls[w].Size, this.Walls[w].Y);
                context.stroke();
            }else if(this.Walls[w].Side == eWallSide.RIGHT)
            {
                context.moveTo(this.Walls[w].X + this.Walls[w].Size,this.Walls[w].Y);
                context.lineTo(this.Walls[w].X, this.Walls[w].Y + this.Walls[w].Size);
                context.stroke();
            }else if(this.Walls[w].Side == eWallSide.BOTTOM)
            {
                context.moveTo(this.Walls[w].X + this.Walls[w].Size,this.Walls[w].Y + this.Walls[w].Size);
                context.lineTo(this.Walls[w].X, this.Walls[w].Y + this.Walls[w].Size);
                context.stroke();
            }else if(this.Walls[w].Side == eWallSide.LEFT)
            {
                context.moveTo(this.Walls[w].X,this.Walls[w].Y + this.Walls[w].Size);
                context.lineTo( this.Walls[w].X, this.Walls[w].Y);
                context.stroke();
            }
        }
        bitmapdata.render();
    }
}

$(document).ready(function(){
    
    //Size of the html page at the start
    var screenHeight = $(window).height();
    var screenWidth = $(window).width();

    //init Phaser GameObject
    var game = new Phaser.Game(800,600, Phaser.AUTO, '', {preload: preload, create: create, render: render, update: update});
    
    //size of cells
    var cellSize = 10;
    var cellAmountWidth = Math.floor(screenWidth / cellSize);
    var cellAmountHeigth = Math.floor(screenHeight / cellSize);
    
    //grid with cells in it
    var grid;
    
    //graphics objects to render 
    var graphics = new Phaser.Graphics(game);
    
    var bitmapData = new Phaser.BitmapData(game,"cell");
    
    function preload(){
        console.log("IsFullscreeen: "+game.scale.isFullScreen);
    }
    
    function create(){
        
        grid = new Array(cellAmountWidth);
        for(var g = 0; g < grid.length; g++)
        {
            grid[g] = new Array(cellAmountHeigth);        
        }
        
        console.log("create");
        for(var i=0; i<grid.length;i++){
            for (var k=0;k<grid[0].length;k++){
                grid[i][k] = new Cell(i * cellSize, k*cellSize, cellSize);
            }
        }
    }
    
     function update(){
        console.log("update");
    }
    
    function render(){
        bitmapData.clear();
        console.log("render");
        for(var i=0; i<grid.length;i++){
            for (var k=0;k<grid[0].length;k++){
                grid[i][k].draw(bitmapData);
            }
        }
    }
});
