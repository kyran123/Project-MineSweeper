import EventBus from '../../Utility/EventBus.js';

const settings = Vue.component('settings', {
    name: 'settings',
    component: {
        
    },
    template: `
        <div id="settings-container">
            <div class="settings-options">
                <div class="log-out" @click="logout">Log out</div>
            </div>
        </div>
    `,
    data() {
        return {
            menuState: 0,
            shortEmail: false,
            shortPassword: false,
            invalidLoginAttempt: false
        }
    },
    computed: {
        css: function() {
            return `
                <style>
                    #settings-container {
                        position: fixed;
                        top: 1vh;
                        left: 250px;
                        width: calc(100vw - 250px);
                        height: 99vh;
                        z-index: 10;
                        display: flex;
                    }
                    .settings-options {
                        width: 50vw;
                        height: 90vh;
                        margin: auto;
                    }
                    .log-out {
                        padding-left: 25px !important;
                        padding-right: 25px !important;
                        padding-top: 5px !important;
                        padding-bottom: 5px !important;
                        border-radius: 5px;
                        width: 80%;
                        background: #E81123;
                        border: 2px solid #111;
                        text-align: center;
                        font-size: 1.1em;
                    }
                    .log-out:hover {
                        cursor: pointer;
                        background: #D11020;
                    }
                </style>
            `
        }
    },
    mounted() {
        $('head').append(this.css);
    },
    methods: {
        logout() {
            window.API.send("logout");
            EventBus.$emit("return");
            EventBus.$emit("showLoginScreen");
        }
    }
});

export default settings;