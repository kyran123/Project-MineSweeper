import gameTile from './GameTile.js';
import EventBus from '../../Utility/EventBus.js';

/*
    - Show current high score
    - Send score to API
    - Show leaderboard when game is over
    - Maybe? Average score of player
*/
const gameBoard = Vue.component('game-board', {
    name: 'game-board',
    component: {
        gameTile
    },
    template: `
        <div class="noselect">
            <div>
                <button @click="quit">Back</button>
                {{timer}}
                <button @click="requestGenerateBoard">Restart</button>
                <span v-show="errorMessage.length > 3">{{errorMessage}}</span>
            </div>
            <div id="game-board-container">
                <game-tile v-for="(tile, index) in tiles" :tileData="tiles[index]" :ref="tile.x+'v'+tile.y"></game-tile>
            </div>
            <div v-show="GameIsFinished" id="game-win-container">
                <span v-show="win">You win! you finished the game in {{timer}} seconds!</span>
                <span v-show="death">You lose</span>
                <button @click="requestGenerateBoard">Restart</button><br/><br/><br/>
                <span class="leaderboard-title">Leaderboard</span>
                <div id="leaderboard">
                    <div v-for="(score, index) in leaderboard" :key="score+index">
                        {{index+1}}. {{score.score_player_name}} - {{score.score_time}}
                    </div>
                </div>
            </div>
            <button v-show="isDevMode" @click="devStats">Show dev stats</button>
        </div>
    `,
    data() {
        return {
            tiles: [
                {
                    x: 1,
                    y: 1,
                    hasBomb: false,
                    number: 1,
                    neighbours: []
                }
            ],
            height: 16,
            width: 30,
            moves: 0,
            timer: 0,
            stopWatch: null,
            win: false,
            death: false,
            errorMessage: "",
            leaderboard: []
        }
    },
    computed: {
        css: function() {
            return `
                <style>
                    .noselect {
                        -webkit-touch-callout: none; /* iOS Safari */
                        -webkit-user-select: none; /* Safari */
                        -khtml-user-select: none; /* Konqueror HTML */
                            -moz-user-select: none; /* Old versions of Firefox */
                            -ms-user-select: none; /* Internet Explorer/Edge */
                                user-select: none; /* Non-prefixed version, currently
                                                        supported by Chrome, Edge, Opera and Firefox */
                    }
                    body {
                        color: #fff;
                    }
                    #game-board-container {
                        display: grid;
                        grid-template-columns: repeat(${this.width}, 2.5em);
                        grid-template-rows: repeat(${this.height}, 2.5em);
                    }
                    #game-board-container #game-tile-container {
                        background: #888;
                        border: 1px solid #fff;
                    }
                    #game-tile-container {
                        width: 2.5em;
                        height: 2.5em;
                    }
                    .lightGray {
                        background: #bbb;
                        width: 2.5em;
                        height: 2.5em;
                        color: #000;
                        text-align: center;
                        line-height: 2.5em;
                    }
                    .detonatedBomb {
                        background: red;
                        width: 2.5em;
                        height: 2.5em;
                    }
                    .detonatedBomb svg {
                        display: inline-block;
                        vertical-align: middle;
                        margin: auto;
                        color: #000;
                    }
                    .leaderboard-title {
                        padding-top: 20px;
                        font-size: 18px;
                        font-weight: bold;
                    }
                    #leaderboard {
                        display: grid;
                        border: 1px solid #555;
                        border-radius: 3px;
                        padding: 5px;
                    }
                    #leaderboard div {
                        padding-left: 5px;
                        padding-right: 5px;
                        padding-top: 2px;
                        padding-bottom: 2px;
                        font-size: 15px;
                        line-height: 50%;
                    }
                </style>
            `
        },
        GameIsFinished: function() { return this.$store.getters.getGameState },
        isDevMode: function() { return this.$store.getters.isDevMode }
    },
    mounted() {
        window.addEventListener("load", () => {
            window.API.receive("rankedResult", (data) => {
                if(data.result) {
                    this.$store.commit("setGameToFinished");
                    this.win = true;
                    this.leaderboard = data.data;
                    document.getElementById("leaderboard").style.gridTemplateRows = `repeat(${this.leaderboard.length}, 1em)`;
                } else {
                    this.errorMessage = data.message;
                }
            });
        });
        $('head').append(this.css);
        this.$store.commit("setBoardWidth", this.width);
        this.$store.commit("setBoardHeight", this.height);
        EventBus.$on("gameBoardData", (data) => {
            document.getElementById("game-board-container").style.gridTemplateColumns = `repeat(${data.height}, 2.5em)`;
            document.getElementById("game-board-container").style.gridTemplateRows = `repeat(${data.width}, 2.5em)`;
            this.$store.commit("setBoardWidth", data.height);
            this.$store.commit("setBoardHeight", data.width);
            this.height = data.width;
            this.width = data.height;
            this.tiles = data.board;
        });
        EventBus.$on("addMove", () => {
            if(this.moves < 1) {
                this.startTimer();
            }
            this.moves++;
        });
        EventBus.$on("checkWinCondition", () => {
            //Check for win condition
            let allTilesChecked = true;
            for(let tile in this.$refs) {
                if(this.$refs[tile][0].isOpened() == false) {
                    allTilesChecked = false;
                }
            }
            if(allTilesChecked) {
                this.$store.commit("setGameToFinished");
                this.win = true;
                window.API.send("submitScore", this.timer);
            }
        });
        EventBus.$on("bomb", () => {
            if(this.moves < 2) {
                this.requestGenerateBoard();
            } else {
                //death
                this.death = true;
                this.$store.commit("setGameToFinished");
                for(let tile in this.$refs) {
                    this.$refs[tile][0].showBombIfTileHasIt();
                }
            }
        });
        EventBus.$on("updateTileIf0", (tileCoordinates) => {
            if(this.$refs[tileCoordinates.x+'v'+tileCoordinates.y] !== null || this.$refs[tileCoordinates.x+'v'+tileCoordinates.y] !== undefined) {
                this.$refs[tileCoordinates.x+'v'+tileCoordinates.y][0].updateIf0(tileCoordinates);
            }
        });
        this.$forceUpdate();
    },
    methods: {
        startTimer() {
            this.timer = 0;
            this.stopWatch = setInterval(() => {
                this.timer++;
                if(this.$store.getters.getGameState) {
                    clearInterval(this.stopWatch);
                }
            }, 1000);
        },
        requestGenerateBoard() {
            //regenerate board
            this.tiles = [];
            this.moves = 0;
            this.timer = 0;
            clearInterval(this.stopWatch);
            this.$store.commit("resetGameState");
            window.API.send('requestGameBoard');
        },
        devStats() {
            let allTilesChecked = true;
            for(let tile in this.$refs) {
                console.log(`Tile: ${this.$refs[tile][0].tileData.x} - ${this.$refs[tile][0].tileData.y} is ${this.$refs[tile][0].isOpened()}`)
                if(this.$refs[tile][0].isOpened() == false) {
                    allTilesChecked = false;
                }
            }
        },
        quit() {
            this.tiles = [];
            this.moves = 0;
            this.timer = 0;
            clearInterval(this.stopWatch);
            this.$store.commit("resetGameState");
            this.$store.commit("setMenuState", true);
        }
    }
});

export default gameBoard;