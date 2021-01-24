import EventBus from '../../Utility/EventBus.js';

const gameTile = Vue.component('game-tile', {
    name: 'game-tile',
    template: `
        <div id="game-tile-container" :class="coordClass" @click="show" @mousedown.right="flag">
            <div class="uncheckedTile" v-show="!showTileData">
                
            </div>
            <div class="lightGray" v-show="showTileData">
                <span v-show="tileData.number > 0">{{tileData.number}}</span>
            </div>
            <div class="flaggedTile" v-show="isFlagged">
                <img class="flagSvg" src="../Assets/Icons/flag.svg">
            </div>
            <div class="detonatedBomb" v-show="isDetonated">
                <img class="bombSvg" src="../Assets/Icons/mine.svg">
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
        height: function() { return this.$store.getters.getBoardHeight },
        uncheckedTile: function() { 
            if(this.isChecked) return '';
            return 'uncheckedTile';
        }
    },
    mounted() {
        if(this.$store.getters.isDevMode) {
            if(this.tileData.bomb) {
                this.isDetonated = true;
            }
        } else {
            if(this.tileData.bomb) {
                if(this.isDetonated) {
                    this.isDetonated = false;
                }
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