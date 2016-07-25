function Score(){
    this.MoveCounter = 0;
    this.StartTime = new Date();
    this.EndTime = undefined;
    
    this.IncreaseMoveCounter = function(){
        this.MoveCounter += 1;
    }
    
    this.ShowResult = function(){
        var score = this.MoveCounter;
        var resultString = "Dein Ergebnis: \r\n"
        resultString += "Moves: "+this.MoveCounter;
        
        if(this.StartTime && this.EndTime){
            var hours = Math.abs(this.EndTime.getHours() - this.StartTime.getHours());
            var minutes = Math.abs(this.EndTime.getMinutes() - this.StartTime.getMinutes());
            var seconds = Math.abs(this.EndTime.getSeconds() - this.StartTime.getSeconds());
            score = score + hours + minutes + seconds;
            resultString += "\r\n Zeit: "+hours+" Stunden "+minutes +" Minuten "+seconds+" Sekunden ";
        }
        
        resultString += "\r\n Punktzahl: "+score;
        alert(resultString);
    }
}