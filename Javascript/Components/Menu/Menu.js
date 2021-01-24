import EventBus from '../../Utility/EventBus.js';
import settings from './Settings.js';

const menu = Vue.component('game-menu', {
    name: 'game-menu',
    component: {
        settings
    },
    template: `
        <div id="menu-container">
            <div class="menu-header-container" v-show="menuState === 0">
                <div class="menu-header">Single player</div>
                <div class="menu-items">
                    <div class="single-player-item" @click="startRankedGame(30,16,99)">Ranked</div>
                    <div class="single-player-item" @click="menuState = 1">Custom</div>
                </div>
                <div class="menu-header">Multi player</div>
                <div class="menu-items">
                    <div class="single-player-item">Toe to Toe</div>
                    <div class="single-player-item">Color mode</div>
                </div>
            </div>

            <div v-show="menuState === 1" id="custom-menu-container">
                <div class="btn-main" @click="menuState = 0">Back</div>
                <div id="custom-menu">
                    <div class="custom-settings">
                        <div class="custom-setting">Easy:<span>Board size: 9 x 9; bombs: 10</span><div class="btn-custom" @click="startNewGame(9,9,10)">Easy</div></div>
                        <div class="custom-setting">Medium:<span>Board size: 16 x 16; bombs: 40</span><div class="btn-custom" @click="startNewGame(16,16,40)">Medium</div></div>
                        <div class="custom-setting">Hard:<span>Board size: 30 x 16; bombs: 99</span><div class="btn-custom" @click="startNewGame(30,16,99)">Hard</div></div>
                        <div class="custom-setting">Custom:<span>Board size: custom; bombs: custom</span><div class="btn-custom" @click="menuState = 2">Custom</div></div>
                    </div>
                </div>
            </div>

            <div v-show="menuState === 2">
                <div class="btn-main" @click="menuState = 1">Back</div>
                <div class="custom-options-container">
                    <div class="custom-options">
                        <div class="c-option"><span>Width</span><input ref="customWidth" type="text" onkeyup="this.value=this.value.replace(/[^0-9]/g,'');"></div>
                        <div class="c-option"><span>Height</span><input ref="customHeight" type="text" onkeyup="this.value=this.value.replace(/[^0-9]/g,'');"></div>
                        <div class="c-option"><span>Bombs</span><input ref="customBombs" type="text" onkeyup="this.value=this.value.replace(/[^0-9]/g,'');"></div><br/>
                        <div class="c-option"><span class="scoresNotTracked">*Scores are not tracked</span><div class="btn-custom" @click="showCustomGame">Start</div></div>
                        <div></div>
                    </div>
                </div>
            </div>


            <div v-show="menuState === 4" id="multiplayer-menu-level-2">
                <button @click="menuState = 3">Back</button>
                <button @click="menuState = 6">Join game</button>
                <button @click="menuState = 5">Host game</button>
            </div>
            <div v-show="menuState === 7">
                <div class="btn-main" @click="menuState = 0">Back</div>
                <settings></settings>
            </div>


            <div class="welcomeCard">
                <div class="username"><span>{{userData.name}}</span><span class="userId">#{{userData.id}}</span></div>
                <div></div>
                <svg  
                    @click="menuState = 7"
                    fill="#bbb"
                    height="14pt" 
                    viewBox="0 0 512 512" 
                    width="14pt" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        d="m499.953125 197.703125-39.351563-8.554687c-3.421874-10.476563-7.660156-20.695313-12.664062-30.539063l21.785156-33.886719c3.890625-6.054687 3.035156-14.003906-2.050781-19.089844l-61.304687-61.304687c-5.085938-5.085937-13.035157-5.941406-19.089844-2.050781l-33.886719 21.785156c-9.84375-5.003906-20.0625-9.242188-30.539063-12.664062l-8.554687-39.351563c-1.527344-7.03125-7.753906-12.046875-14.949219-12.046875h-86.695312c-7.195313 0-13.421875 5.015625-14.949219 12.046875l-8.554687 39.351563c-10.476563 3.421874-20.695313 7.660156-30.539063 12.664062l-33.886719-21.785156c-6.054687-3.890625-14.003906-3.035156-19.089844 2.050781l-61.304687 61.304687c-5.085937 5.085938-5.941406 13.035157-2.050781 19.089844l21.785156 33.886719c-5.003906 9.84375-9.242188 20.0625-12.664062 30.539063l-39.351563 8.554687c-7.03125 1.53125-12.046875 7.753906-12.046875 14.949219v86.695312c0 7.195313 5.015625 13.417969 12.046875 14.949219l39.351563 8.554687c3.421874 10.476563 7.660156 20.695313 12.664062 30.539063l-21.785156 33.886719c-3.890625 6.054687-3.035156 14.003906 2.050781 19.089844l61.304687 61.304687c5.085938 5.085937 13.035157 5.941406 19.089844 2.050781l33.886719-21.785156c9.84375 5.003906 20.0625 9.242188 30.539063 12.664062l8.554687 39.351563c1.527344 7.03125 7.753906 12.046875 14.949219 12.046875h86.695312c7.195313 0 13.421875-5.015625 14.949219-12.046875l8.554687-39.351563c10.476563-3.421874 20.695313-7.660156 30.539063-12.664062l33.886719 21.785156c6.054687 3.890625 14.003906 3.039063 19.089844-2.050781l61.304687-61.304687c5.085937-5.085938 5.941406-13.035157 2.050781-19.089844l-21.785156-33.886719c5.003906-9.84375 9.242188-20.0625 12.664062-30.539063l39.351563-8.554687c7.03125-1.53125 12.046875-7.753906 12.046875-14.949219v-86.695312c0-7.195313-5.015625-13.417969-12.046875-14.949219zm-152.160156 58.296875c0 50.613281-41.179688 91.792969-91.792969 91.792969s-91.792969-41.179688-91.792969-91.792969 41.179688-91.792969 91.792969-91.792969 91.792969 41.179688 91.792969 91.792969zm0 0"
                    />
                </svg>
            </div>
        </div>
    `,
    data() {
        return {
            menuStates: [
                'top-level',
                'single-player',
                'Custom-game',
                'multi-player',
                'multi-player-level-2',
                'multiplayer-host',
                'multiplayer-list',
                'settings'
            ],
            menuState: 0,
            showCustomCasualGame: false,
            gameMode: 0
        }
    },
    computed: {
        css: function() {
            return `
                <style>
                    #menu-container {
                        position: fixed;
                        top: 1vh;
                        left: 0;
                        width: 250px;
                        height: calc(100vh - 1vh);
                        background-color: rgb(47, 49, 54);
                        display: grid;
                        grid-template-rows: 1fr max-content;
                    }
                    .menu-header-container {
                        display: grid;
                        width: calc(100% - 30px);
                        height: max-content;
                        margin-top: 15px;
                        padding-left: 15px;
                        padding-right: 15px;
                    }
                    .menu-header {
                        font-size: 1.1em;
                        font-weight: bold;
                        color: #fff;
                        padding-bottom: 10px;
                    }
                    .menu-items {
                        padding-left: 10px;
                        padding-bottom: 15px;
                    }
                    .single-player-item {
                        color: #ccc;
                        padding-bottom: 5px;
                    }
                    .single-player-item:hover {
                        color: #eee;
                        cursor: pointer;
                    }
                    #top-level-menu {
                        display: grid;
                        grid-template-rows: repeat(3, max-content);
                        grid-row-gap: 15px;
                        width: 100%;
                        margin: auto;
                    }
                    #top-level-menu .btn {
                        font-size: 1.7em !important;
                    }
                    #top-level-menu .btn div {
                        padding-top: 5px;
                        padding-bottom: 5px;
                    }
                    .welcomeCard {
                        width: calc(100% - 20px);
                        padding: 10px;
                        font-size: 1.3em;
                        font-weight: 600;
                        background: rgb(34 35 37);
                        display: grid;
                        grid-template-columns: max-content 1fr max-content;
                    }
                    .userId {
                        font-weight: 300;
                        color: #bbb;
                    }
                    .welcomeCard svg {
                        width: 14pt;
                        height: 14pt;
                        margin: auto;
                        padding-right: 10px;
                    }
                    .welcomeCard svg:hover {
                        fill: #eee;
                        cursor: pointer;
                    }
                    #custom-menu {
                        position: fixed;
                        top: 1vh;
                        left: 250px;
                        width: calc(100vw - 250px);
                        height: 99vh;
                        z-index: 10;
                        display: flex;
                    }
                    #custom-menu .custom-settings {
                        width: 50vw;
                        height: 90vh;
                        margin: auto;
                        color: #fff;
                    }
                    .custom-settings span {
                        font-weight: 100;
                        color: #ccc;
                    }
                    .custom-setting {
                        width: 100%;
                        height: 4vh;
                        display: grid;
                        grid-template-columns: max-content 1fr max-content;
                        grid-column-gap: 5px;
                        line-height: 4vh;
                    }
                    .custom-options-container {
                        position: fixed;
                        top: 1vh;
                        left: 250px;
                        width: calc(100vw - 250px);
                        height: 99vh;
                        z-index: 10;
                        display: flex;
                    }
                    .custom-options {
                        width: 50vw;
                        height: 90vh;
                        margin: auto;
                        color: #fff;
                        display: grid;
                        grid-template-rows: repeat(8, max-content) 1fr;
                    }
                    .custom-options .scoresNotTracked {
                        color: #ccc;
                        font-weight: 100;
                    }
                    .scoresNotTracked {
                        line-height: 4vh;
                    }
                    .c-option {
                        width: 100%;
                        display: grid;
                        grid-template-columns: 1fr max-content;
                        padding-top: 5px;
                        padding-bottom: 5px;
                    }
                </style>
            `
        },
        userData: function() { return this.$store.getters.getUser },
        rankedHighscore: function() { return this.$store.getters.getHighscore },
        rankedTotalTime: function() { return this.$store.getters.getTotalTime },
        rankedTotalPlays: function() { return this.$store.getters.getTotalPlays },
        rankedAvg: function() { return (this.rankedTotalTime / this.rankedTotalPlays) }
    },
    mounted() {
        $('head').append(this.css);
        EventBus.$on("return", () => {
            this.menuState = 0;
        });
    },
    methods: {
        showCustomGame() {
            let w = this.$refs['customWidth'].value;
            let h = this.$refs['customHeight'].value;
            let b = this.$refs['customBombs'].value;
            console.log(`width:${w} height:${h} bombs:${b}`);
            if(this.gameMode == 0) this.startCustomGame(w, h, b);
            if(this.gameMode == 1) {

            }
        },
        startRankedGame(width, height, bombs) {
            this.$store.commit("setRanked", true);
            this.startCustomGame(width, height, bombs);
        },
        startNewGame(width, height, bombs) {
            this.$store.commit("setRanked", false);
            if(this.gameMode == 0) {
                this.startCustomGame(width, height, bombs);
            }
            if(this.gameMode == 1) {
                //Teleport game mode
                if(width < 1 || height < 1 || bombs < 1) return;
                window.API.send("requestGameBoard", { 
                    width,
                    height, 
                    bombs
                });
                this.menuState = 0;
                EventBus.$emit("updateGameMode", this.gameMode);
                this.gameMode = 0;
                this.$store.commit("setMenuState", false);
            }
        },
        startCustomGame(width, height, bombs) {
            if(width < 1 || height < 1 || bombs < 1) return;
            window.API.send("requestGameBoard", {
                width,
                height,
                bombs
            });
            this.menuState = 0;
            this.$store.commit("setMenuState", false);
        }

    }
});

export default menu;