(function(){
    function Cell(posX, posY, size)
    {
        this.X = posX;
        this.Y = posY;
        this.Size = size;
        this.Walls = [new Wall(eWallSide.TOP), new Wall(eWallSide.RIGHT),new Wall(eWallSide.BOTTOM), new Wall(eWallSide.LEFT)];
        this.Visited = false;
        this.Choosen = false;
        //this.Shape_constructor();
    }
    
    Cell.prototype = Object.create(createjs.DisplayObject);
    Cell.prototype.constructor = Cell;
    
    var c = createjs.extend(Cell,createjs.DisplayObject);
    
    c.draw = function()
    {
        this.DisplayObject_draw();
        
        var cellColor;
        
        if(this === grid.CurrentCell)
            cellColor = "#1055fa";
        //else if(this === grid.StartCell || this === grid.EndCell)
        //  cellColor = "#075F11";
        else if(this.Choosen)
            cellColor = "#F52530";
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
    
    window.Cell = createjs.promote(Cell,"DisplayObject");
      
    Cell.prototype.RemoveWall = function(wallSide)
    {
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
    
    Cell.prototype.HasWall = function(wallSide)
    {
        for(var i=0;i<this.Walls.length;i++){
            if(this.Walls[i].Side === wallSide)
                return true;
        }
        return false;
    }
}());