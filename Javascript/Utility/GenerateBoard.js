const board = class GenerateBoard {
    board = [];
    width = 16;
    height = 30;
    bombs = 99;
    generate(w = null, h = null, b = null) {
        if(w !== null && h !== null && b !== null) {
            this.width = w;
            this.height = h;
            this.bombs = b;
        }
        this.board = [];
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                this.board.push({
                    x, 
                    y,
                    bomb: false
                });
            }
        }

        let totalBombs = 0;
        let failSafeIndex = 0;
        while(totalBombs <= (this.bombs - 1) && failSafeIndex < 10000) {
            const tileX = Math.floor(Math.random() * this.width);
            const tileY = Math.floor(Math.random() * this.height);
            if(this.getFromArray(tileX, tileY).bomb == false) {
                this.getFromArray(tileX, tileY).bomb = true;
                totalBombs++;
            }
            failSafeIndex++;
        }
        
        for(let tile of this.board) {
            if(tile.bomb == true) { tile.number = -1; continue; }
            let bombCount = 0;
            //top left
            if(tile.x > 0 && tile.y > 0) {
                if(this.getFromArray(tile.x-1, tile.y-1).bomb) bombCount++;
            }
            //top
            if(tile.y > 0) {
                if(this.getFromArray(tile.x, tile.y-1).bomb) bombCount++;
            }
            //top right
            if(tile.x < (this.width-1) && tile.y > 0) {
                if(this.getFromArray(tile.x+1, tile.y-1).bomb) bombCount++;
            }
            //left
            if(tile.x > 0) {
                if(this.getFromArray(tile.x-1, tile.y).bomb) bombCount++;
            }
            //right
            if(tile.x < (this.width-1)) {
                if(this.getFromArray(tile.x+1, tile.y).bomb) bombCount++;
            }
            //bottom left
            if(tile.x > 0 && tile.y < (this.height-1)) {
                if(this.getFromArray(tile.x-1, tile.y+1).bomb) bombCount++;
            }
            //bottom
            if(tile.y < (this.height-1)) {
                if(this.getFromArray(tile.x, tile.y+1).bomb) bombCount++;
            }
            //bottom right
            if(tile.x < (this.width-1) && tile.y < (this.height-1)) {
                if(this.getFromArray(tile.x+1, tile.y+1).bomb) bombCount++;
            }
            tile.number = bombCount;
        }
        return { 
            width: this.width,
            height: this.height,
            board: this.board
        }
    }



    getFromArrayWithoutNeighbours(x, y) {
        for(let tile of this.board) {
            if(tile.x == x && tile.y == y) {
                const t = tile;
                t.neighbours = false;
                return t;
            }
        }
    }
    getFromArray(x,y) {
        for(let tile of this.board) {
            if(tile.x == x && tile.y == y) return tile;
        }
    }
}

module.exports = new board();