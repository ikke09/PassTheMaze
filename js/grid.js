function Grid(width, heigth, cellSize)
{
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
                 this.Cells[x][y].draw();
             }
        }
    }
    
    this.StartCell = undefined;
    this.EndCell = undefined;
    this.CurrentCell = undefined;
    
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