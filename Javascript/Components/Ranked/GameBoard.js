import gameTile from './GameTile.js';
import leaderboard from './Leaderboard.js';
import EventBus from '../../Utility/EventBus.js';

const gameBoard = Vue.component('game-board', {
    name: 'game-board',
    component: {
        gameTile,
        leaderboard
    },
    template: `
        <div class="game-container noselect">
            <div class="boardMenu">
                <div class="btn-main" @click="quit"><div>Back</div></div>
                <div class="btn-main" @click="requestGenerateBoard">Restart</div>
                <span v-show="errorMessage.length > 3">{{errorMessage}}</span>
                <div></div>
                <leaderboard v-show="gameModeBool"></leaderboard>
                <div v-show="!gameModeBool"></div>
                <div class="welcomeCard">
                    <div class="username"><span>{{userData.name}}</span><span class="userId">#{{userData.id}}</span></div>
                </div>
            </div>
            <div class="game-mode-timer">
                <span>{{gameMode}} - <div class="timer">{{timer}} Second<span v-show="timer !== 1">s</span></div></span>
            </div>
            <div id="game-board-container">
                <game-tile v-for="(tile, index) in tiles" :key="'vanilla'+index" :tileData="tile" :ref="tile.x+'v'+tile.y"></game-tile>
            </div>
            <div v-show="GameIsFinished" id="game-win-container">
                <span v-show="win">You win! you finished the game in {{timer}} seconds!</span>
                <span v-show="death">You lose</span>
                <button @click="requestGenerateBoard">Restart</button><br/><br/><br/>
                <span class="leaderboard-title">Leaderboard</span>
                <div id="leaderboard">
                    <div v-for="(score, index) in leaderBoard" :key="score+index">
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
            errorMessage: ""
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
                    .game-container {
                        display: grid;
                        grid-template-columns: max-content 1fr;
                        height: calc(100vh - 1vh);
                    }
                    #game-board-container {
                        display: grid;
                        grid-template-columns: repeat(${this.width}, 2.5em);
                        grid-template-rows: repeat(${this.height}, 2.5em);
                        width: max-content;
                        height: max-content;
                        border-right: 5px solid #aaa;
                        border-bottom: 5px solid #aaa;
                        border-left: 4px solid #aaa;
                        border-top: 4px solid #aaa;
                        margin: auto;
                    }
                    .boardMenu {
                        width: 250px;
                        display: grid;
                        background-color: rgb(47, 49, 54);
                        grid-template-rows: max-content max-content 5fr minmax(100px, max-content) max-content;
                    }
                    #game-tile-container {
                        display: flex;
                        width: 2.5em;
                        height: 2.5em;
                        background: url('../Assets/Images/tile.png') !important;
                        background-size: contain !important;
                    }
                    .lightGray {
                        background: #aaa;
                        width: 2.5em;
                        height: 2.5em;
                        color: #000;
                        text-align: center;
                        line-height: 2.5em;
                        font-weight: 400;
                        border: 0.5px solid #999
                    }
                    .lightGray span {
                        font-size: 18px;
                    }
                    .uncheckedTile {
                        width: 2.3em;
                        height: 2.3em;
                        margin: auto;
                        background: #888;                        
                    }
                    .detonatedBomb {
                        background: #aaa;
                        width: 2.5em;
                        height: 2.5em;
                        position: absolute;
                        display: flex;
                        border: 0.5px solid #999;
                    }
                    .detonatedBomb svg {
                        display: inline-block;
                        vertical-align: middle;
                        margin: auto;
                        color: #000;
                    }
                    .bombSvg {
                        width: 1.7em;
                        height: 1.7em;
                        margin: auto;
                    }
                    .flagSvg {
                        width: 1.5em;
                        height: 1.5em;
                        margin: auto;
                    }
                    .flaggedTile {
                        width: 2.5em;
                        height: 2.5em;
                        display: flex;
                        position: absolute;
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
                    .game-mode-timer {
                        position: fixed;
                        top: 10vh;
                        left: 250px;
                        width: calc(100vw - 250px);
                        text-align: center;
                        margin-left: auto;
                        margin-right: auto;
                        font-size: 1.8em;
                    }
                    .timer {
                        display: contents;
                        color: #fff;
                    }
                </style>
            `
        },
        GameIsFinished: function() { return this.$store.getters.getGameState },
        isDevMode: function() { return this.$store.getters.isDevMode },
        userData: function() { return this.$store.getters.getUser },
        gameMode: function() {
            const gameMode = this.$store.getters.getGameMode;
            if(gameMode) {
                return 'Ranked';
            } else {
                return 'Casual';
            }
        },
        gameModeBool: function() { return this.$store.getters.getGameMode },
        leaderBoard: function() { return this.$store.getters.getLeaderBoard; }
    },
    mounted() {
        window.addEventListener("load", () => {
            window.API.receive("rankedWon", (data) => {
                if(data.result) {
                    this.$store.commit("setGameToFinished");
                    this.win = true;
                    this.leaderboard = data.data;
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
    watch: {
        leaderBoard: function() {
            document.getElementById("leaderboard").style.gridTemplateRows = `repeat(${this.leaderBoard.length}, 1em)`;
        }
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
            this.$store.commit("setRanked", false);
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