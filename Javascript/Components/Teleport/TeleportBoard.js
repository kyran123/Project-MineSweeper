/*import gameTile from './TeleportTile.js';
import EventBus from '../../Utility/EventBus.js';

const teleportGameBoard = Vue.component('teleport-game-board', {
    name: 'teleport-game-board',
    component: {
        gameTile
    },
    template: `
        <div class="teleport-game-container noselect">
            <div id="game-board-container">
                <game-tile 
                    v-for="(tile, index) in tiles" 
                    :key="'teleport'+index"
                    :tileData="tile" 
                    :ref="tile.x+'v'+tile.y"
                >
                
                </game-tile>
            </div>
        </div>
    `,
    data() {
        return {
            tiles: [],
            height: 16,
            width: 30,
            moves: 0,
            timer: 0,
            stopWatch: null,
            win: false,
            death: false,
            errorMessage: "",
        }
    },
    computed: {
        css: function() {
            return `
                <style>
                    .teleport-game-container {
                        display: grid;
                        grid-template-columns: max-content 1fr;
                        height: calc(100vh - 1vh);
                    }
                    .boardMenu {
                        grid-template-rows: max-content max-content 1fr max-content max-content !important;
                    }
                </style>
            `
        },
        GameIsFinished: function() { return this.$store.getters.getGameState },
        isDevMode: function() { return this.$store.getters.isDevMode },
        userData: function() { return this.$store.getters.getUser },
    },
    mounted() {
        $('head').append(this.css);
        EventBus.$on("gameBoardData", (data) => {
            document.getElementById("game-board-container").style.gridTemplateColumns = `repeat(${data.height}, 2.5em)`;
            document.getElementById("game-board-container").style.gridTemplateRows = `repeat(${data.width}, 2.5em)`;
            this.$store.commit("setBoardWidth", data.height);
            this.$store.commit("setBoardHeight", data.width);
            this.height = data.width;
            this.width = data.height;
            this.tiles = data.board;
        });
        EventBus.$on("teleport-addMove", () => {
            if(this.moves < 1) this.startTimer();
            this.moves++;
        });
        EventBus.$on("teleport-checkWinCondition", () => {
            //Check for win condition
            let allTilesChecked = true;
            for(let tile in this.$refs) {
                if(!this.$refs[tile][0].isOpened()) {
                    allTilesChecked = false;
                }
            }
            if(allTilesChecked) {
                this.$store.commit("setGameToFinished");
                this.win = true;
            }
        });
        EventBus.$on("teleport-moveBomb", () => {
            this.moveRandomBomb();
        })
        EventBus.$on("teleportUpdateTileIf0", (tile) => {
            this.$refs[tile.x+'v'+tile.y][0].updateIfTileIs0();
        });
        EventBus.$on("bomb", () => {
            console.log('boom!');
        });
    },
    methods: {
        startTimer() {
            this.timer = 0;
            this.stopWatch = setInterval(() => {
                this.timer++;
                if(this.$store.getters.getGameState) clearInterval(this.stopWatch);
            }, 1000);
        },
        moveRandomBomb() {
            console.log('moving bombs');
            const listOfBombs = this.getAllBombs();
            const amount = 10;
            for(let i = 0; i < amount; i++) {
                const selectedBomb = this.getRandomBomb(listOfBombs);
                let tileFound = false;
                let maxAttempts = 10000;
                let attempt = 0;
                while(!tileFound) {
                    if(attempt >= maxAttempts) break;
                    attempt++;
                    const y = Math.floor(Math.random() * this.width);
                    const x = Math.floor(Math.random() * this.height);
                    const newLocation = this.$refs[`${x}v${y}`][0];
                    if(newLocation.isFree()) {
                        tileFound = true;
                        selectedBomb.setBomb(false);
                        this.updateTilesAroundBomb(selectedBomb);
                        newLocation.setBomb(true);
                        this.updateTilesAroundBomb(newLocation);
                        selectedBomb.$forceUpdate();
                        newLocation.$forceUpdate();
                    }
                }
            }
            this.$forceUpdate();
        },
        getAllBombs() {
            let bombs = [];
            for(let tileName in this.$refs) {
                let tile = this.$refs[tileName][0];
                if(tile.isBomb()) bombs.push(tile);
            }
            return bombs;
        },
        getRandomBomb(allBombs) {
            const index = Math.floor(Math.random() * allBombs.length);
            return allBombs[index];
        },
        updateTilesAroundBomb(tile) {
            let bombCount = 0;
            //top left
            if(tile.x > 0 && tile.y > 0) {
                if(this.$refs[`${tile.x-1}v${tile.y-1}`][0].isBomb()) bombCount++;
            }
            //top
            if(tile.x > 0) {
                if(this.$refs[`${tile.x-1}v${tile.y}`][0].isBomb()) bombCount++;
            }
            //top right
            if(tile.x > 0 && tile.y < (tile.width - 1)) {
                if(this.$refs[`${tile.x-1}v${tile.y+1}`][0].isBomb()) bombCount++;
            }
            //left 
            if(tile.y > 0) {
                if(this.$refs[`${tile.x}v${tile.y-1}`][0].isBomb()) bombCount++;
            }
            //right
            if(tile.y < (tile.width - 1)) {
                if(this.$refs[`${tile.x}v${tile.y+1}`][0].isBomb()) bombCount++;
            }
            //bottom left
            if(tile.y > 0 && tile.x < (tile.height - 1)) {
                if(this.$refs[`${tile.x+1}v${tile.y-1}`][0].isBomb()) bombCount++;
            }
            //bottom
            if(tile.x < (tile.height - 1)) {
                if(this.$refs[`${tile.x+1}v${tile.y}`][0].isBomb()) bombCount++;
            }
            //bottom right
            if(tile.y < (tile.width - 1) && tile.x < (tile.height - 1)) {
                if(this.$refs[`${tile.x+1}v${tile.y+1}`][0].isBomb()) bombCount++;
            }
            tile.setBomb(bombCount);
            tile.$forceUpdate();
        }
    }
});

export default teleportGameBoard;*/