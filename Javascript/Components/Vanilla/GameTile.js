import EventBus from '../../Utility/EventBus.js';

const gameTile = Vue.component('game-tile', {
    name: 'game-tile',
    template: `
        <div id="game-tile-container" :class="coordClass" @click="show" @mousedown.right="flag">
            <div class="lightGray" v-show="showTileData">
                <span v-show="tileData.number > 0">{{tileData.number}}</span>
            </div>
            <svg v-show="isFlagged"
                width="24" height="24" viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.4388 7L14.8387 4H7V10H14.8387L12.4388 7ZM19 12H7V22H5V2H19L15 7L19 12Z"
                    fill="currentColor"
                />
            </svg>
            <div class="detonatedBomb" v-show="isDetonated">
                <svg
                    width="2.5em"
                    height="2.5em"
                    viewBox="0 0 24 24"
                    fill="black"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9ZM11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z"
                        fill="currentColor"
                    />
                    <path
                        d="M5 12C5 8.13401 8.13401 5 12 5V7C9.23858 7 7 9.23858 7 12H5Z"
                        fill="currentColor"
                    />
                    <path
                        d="M12 17C14.7614 17 17 14.7614 17 12H19C19 15.866 15.866 19 12 19V17Z"
                        fill="currentColor"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z"
                        fill="currentColor"
                    />
                </svg>
            </div>
        </div>
    `,
    props: ['tileData'],
    data() {
        return {
            showTileData: false,
            isFlagged: false,
            isDetonated: false,
            isChecked: false
        }
    },
    computed: {
        coordClass: function() {
            return `${this.tileData.x}v${this.tileData.y}`;
        },
        GameIsFinished: function() { return this.$store.getters.getGameState },
        width: function() { return this.$store.getters.getBoardWidth },
        height: function() { return this.$store.getters.getBoardHeight }
    },
    mounted() {
        if(this.$store.getters.isDevMode) {
            if(this.tileData.bomb) {
                this.isDetonated = true;
            }
        }
    },
    methods: {
        show() {
            if(this.GameIsFinished) return;
            EventBus.$emit("addMove");
            if(this.isFlagged == false) {
                if(this.tileData.bomb) {
                    //Eventbus emit death
                    EventBus.$emit("bomb");
                    this.isDetonated = true;
                } else {
                    this.showTileData = true;
                    if(this.tileData.number == 0) {
                        this.updateIf0({});
                    } else {
                        this.isChecked = true;
                    }
                }
                EventBus.$emit("checkWinCondition");
            }
        },
        test() {
            console.log("Left + Right click");
        },
        showBombIfTileHasIt() {
            if(this.tileData.bomb) {
                this.isDetonated = true;
            }
        },
        isOpened() {
            if(!this.tileData.bomb) {
                if(this.isChecked) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        },
        flag() {
            if(this.GameIsFinished) return;
            if(this.isFlagged == true) {
                this.isFlagged = false;
            } else {
                this.isFlagged = true;
            }
        },
        updateIf0(previousNeighbour) {
            let tile = this.tileData;
            if(tile.number == 0 && !this.isChecked) {
                this.isChecked = true;
                this.showTileData = true;

                //top left
                if(tile.x > 0 && tile.y > 0) {
                    EventBus.$emit("updateTileIf0", { x: tile.x-1, y: tile.y-1, number: tile.number });
                }
                //top
                if(tile.x > 0) {
                    EventBus.$emit("updateTileIf0", { x: tile.x-1, y: tile.y, number: tile.number });
                }
                //top right
                if(tile.x > 0 && tile.y < (this.width - 1)) {
                    EventBus.$emit("updateTileIf0", { x: tile.x-1, y: tile.y+1, number: tile.number });
                }
                //left 
                if(tile.y > 0) {
                    EventBus.$emit("updateTileIf0", { x: tile.x, y: tile.y-1, number: tile.number });
                }
                //right
                if(tile.y < (this.width - 1)) {
                    EventBus.$emit("updateTileIf0", { x: tile.x, y: tile.y+1, number: tile.number });
                }
                //bottom left
                if(tile.y > 0 && tile.x < (this.height - 1)) {
                    EventBus.$emit("updateTileIf0", { x: tile.x+1, y: tile.y-1, number: tile.number });
                }
                //bottom
                if(tile.x < (this.height - 1)) {
                    EventBus.$emit("updateTileIf0", { x: tile.x+1, y: tile.y, number: tile.number });
                }
                //bottom right
                if(tile.y < (this.width - 1) && tile.x < (this.height - 1)) {
                    EventBus.$emit("updateTileIf0", { x: tile.x+1, y: tile.y+1, number: tile.number });
                }                
            } else {
                this.isChecked = true;
                if(previousNeighbour.number == 0) {
                    this.showTileData = true;
                }
            }
        }
    }
});

export default gameTile;