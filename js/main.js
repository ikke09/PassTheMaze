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

function init(){
    
    //Size of the html page at the start
    var screenHeight = $(window).height();
    var screenWidth = $(window).width();

    $("#myCanvas").attr({width: ""+screenWidth, height: ""+screenHeight});
    
    //size of cells
    var cellSize = 10;
    var cellAmountWidth = Math.floor(screenWidth / cellSize);
    var cellAmountHeigth = Math.floor(screenHeight / cellSize);
    
    stage = new createjs.Stage("myCanvas");
    gfx = new createjs.Graphics();
}

$(document).ready(function(){
    
    init();
    gfx.setStrokeStyle(3);
    gfx.beginStroke("#fff");
    gfx.moveTo(100,100);
    gfx.lineTo(200,200);
    gfx.endStroke();
    var shape = new createjs.Shape(gfx);
    stage.addChild(shape);
    stage.update();
});
