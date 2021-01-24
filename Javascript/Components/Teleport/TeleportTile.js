/*import EventBus from '../../Utility/EventBus.js';

const teleportTile = Vue.component('teleport-tile', {
    name: 'teleport-tile',
    template: `
        <div id="game-tile-container" @click="openTile" @mousedown.right="devStats">
            <div class="uncheckedTile" :class="coordClass" v-show="!isChecked">
                {{number}}
            </div>
            <div class="lightGray" v-show="isChecked">
                <span v-show="tileData.number > 0">{{number}}</span>
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
            isFlagged: false,
            isDetonated: false,
            isChecked: false,
            number: 0,
            bomb: false,
            x: 0,
            y: 0
        }
    },
    computed: {
        coordClass: function() {
            return `${this.x}v${this.y}`;
        },
        GameIsFinished: function() { return this.$store.getters.getGameState },
        width: function() { return this.$store.getters.getBoardWidth },
        height: function() { return this.$store.getters.getBoardHeight },

    },
    mounted() {
        this.number = this.tileData.number;
        this.bomb = this.tileData.bomb;
        this.x = this.tileData.x;
        this.y = this.tileData.y;
        if(this.$store.getters.isDevMode && this.bomb) this.isDetonated = true;         
    },
    watch: {
        number: function() {
            this.$forceUpdate();
        }
    },
    methods: {
        devStats() {
            console.group(`Tile: ${this.x} - ${this.y}`);
            console.log(`Tile: ${this.x} - ${this.y}`);
            console.log(`Number: ${this.number}`);
            console.log(`Bomb: ${this.bomb}`);
            console.groupEnd();
        },
        openTile() {
            if(this.GameIsFinished || this.isFlagged) return;
            EventBus.$emit("teleport-addMove");
            if(this.tileData.bomb) {
                EventBus.$emit("teleport-bomb");
                this.isDetonated = true;
            } else {
                if(this.tileData.number == 0) {
                    this.updateIfTileIs0();
                } else {
                    this.isChecked = true;
                }
            }
            EventBus.$emit("teleport-moveBomb");
            EventBus.$emit("teleport-checkWinCondition");
        },
        isOpened() {
            if(this.bomb) return true;
            if(this.isChecked) return true;
            return false;
        },
        isFree() {
            if(this.bomb || this.isChecked || this.isFlagged) return false;
            return true;
        },
        flag() {
            if(this.GameIsFinished) return;
            if(this.isFlagged) return this.isFlagged = false;
            this.isFlagged = true;
        },
        isBomb() { return this.bomb; },
        getX() { return this.x },
        getY() { return this.y },
        setBomb(value) { this.bomb = value; this.tileData.bomb = value; },
        setNumber(value) { this.number = value; this.tileData.number = value; },
        updateIfTileIs0() {
            if(this.number == 0 && !this.isChecked && !this.isBomb()) {
                this.isChecked = true;
                //top left
                if(this.x > 0 && this.y > 0) {
                    EventBus.$emit("teleportUpdateTileIf0", { x: this.x-1, y: this.y-1 });
                }
                //top
                if(this.x > 0) {
                    EventBus.$emit("teleportUpdateTileIf0", { x: this.x-1, y: this.y });
                }
                //top right
                if(this.x > 0 && this.y < (this.width - 1)) {
                    EventBus.$emit("teleportUpdateTileIf0", { x: this.x-1, y: this.y+1 });
                }
                //left 
                if(this.y > 0) {
                    EventBus.$emit("teleportUpdateTileIf0", { x: this.x, y: this.y-1 });
                }
                //right
                if(this.y < (this.width - 1)) {
                    EventBus.$emit("teleportUpdateTileIf0", { x: this.x, y: this.y+1 });
                }
                //bottom left
                if(this.y > 0 && this.x < (this.height - 1)) {
                    EventBus.$emit("teleportUpdateTileIf0", { x: this.x+1, y: this.y-1 });
                }
                //bottom
                if(this.x < (this.height - 1)) {
                    EventBus.$emit("teleportUpdateTileIf0", { x: this.x+1, y: this.y });
                }
                //bottom right
                if(this.y < (this.width - 1) && this.x < (this.height - 1)) {
                    EventBus.$emit("teleportUpdateTileIf0", { x: this.x+1, y: this.y+1 });
                }
            } else {
                this.isChecked = true;
            }
        }
    }
});

export default teleportTile;*/