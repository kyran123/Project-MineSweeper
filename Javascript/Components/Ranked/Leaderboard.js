import EventBus from '../../Utility/EventBus.js';

const leaderboard = Vue.component('leaderboard', {
    name: 'leaderboard',
    template: `
        <div class="leaderboard-container">
            <div v-for="(score, index) in leaderboard" :key="score+index">
                <span>{{index+1}} | {{score.score_player_name}}:</span><span>{{score.score_time}}</span>
            </div>
        </div>
    `,
    data() {
        return {
            leaderboard: []
        }
    },
    computed: {
        css: function() {
            return `
                <style>
                    .leaderboard-container {
                        background: rgb(34 35 37);
                        border-bottom: 1px solid rgb(47, 49, 54);
                        padding: 10px;
                    }
                    .leaderboard-container div {
                        margin-bottom: 5px;
                        background: rgb(47, 49, 54);
                        padding: 5px;
                        padding-left: 10px;
                        padding-right: 10px;
                        display: grid;
                        grid-template-columns: 1fr max-content;
                    }
                </style>
            `
        },
        userData: function() { return this.$store.getters.getUser },
        rankedHighscore: function() { return this.$store.getters.getHighscore }    
    },
    mounted() {
        window.addEventListener("load", () => {
            window.API.receive('rankedResult', (response) => {
                this.leaderboard = response.data;
            });
        });
        $('head').append(this.css);        
    }
});

export default leaderboard;