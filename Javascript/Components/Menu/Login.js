import EventBus from '../../Utility/EventBus.js';

const login = Vue.component('login', {
    name: 'login',
    component: {
        
    },
    template: `
        <div id="user-container">
            <div v-show="menuState === 0">
                <button @click="menuState = 2">Login</button>
                <button @click="menuState = 1">Register</button>
            </div>
            <div v-show="menuState === 1">
                <button @click="menuState = 0">back</button>

                <span>Email</span>
                <input ref="registerEmail" id="email" type="text">

                <span>Username</span>
                <input ref="registerUsername" id="username" type="text">

                <span>Password</span>
                <input ref="registerPassword" id="password" type="password">

                <span>Confirm password</span>
                <input ref="registerConfirm" id="confirmpassword" type="password">

                <span v-show="invalidRegisterAttempt">{{invalidRegisterMessage}}</span>

                <button @click="register">Register</button>
            </div>
            <div v-show="menuState === 2">
                <button @click="menuState = 0">back</button>

                <span>Email</span>
                <input ref="emailInput" id="email" type="text" @input="shortEmail = false;invalidLoginAttempt = false;">
                <span v-show="shortEmail">Invalid email</span>

                <span>Password</span>
                <input ref="passwordInput" id="password" type="password" @input="shortPassword = false;invalidLoginAttempt = false;">
                <span v-show="shortPassword">Invalid password</span>

                <span v-show="invalidLoginAttempt">Incorrect Email or Password</span>

                <button @click="login">Login</button>
            </div>
        </div>
    `,
    data() {
        return {
            menuState: 0,
            shortEmail: false,
            shortPassword: false,
            invalidLoginAttempt: false,
            invalidRegisterAttempt: false,
            invalidRegisterMessage: ""
        }
    },
    computed: {
        css: function() {
            return `
                <style>
                    #user-container {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        background-color: #1a1a1d;
                        z-index: 10;
                    }
                </style>
            `
        }
    },
    mounted() {
        $('head').append(this.css);
    },
    methods: {
        login() {
            const email = this.$refs["emailInput"].value;
            if(email.length < 5) { this.shortEmail = true; return; }
            const password = this.$refs["passwordInput"].value;
            if(password.length < 5) { this.shortPassword = true; return; }
            window.API.receive("failedLoginAttempt", () => {
                this.invalidLoginAttempt = true;
            });
            window.API.send("login", {
                email,
                password
            });
        },
        register() {
            const email = this.$refs["registerEmail"].value;
            if(email.length < 5) {  }

            const userName = this.$refs["registerUsername"].value;
            if(userName < 3) {  }

            const password = this.$refs["registerPassword"].value;
            if(password.length < 5) {  }

            const confirm = this.$refs["registerConfirm"].value;
            if(confirm.length < 5) {  }

            if(password !== confirm) {  }

            window.API.receive("failedRegisterAttempt", (msg) => {
                this.invalidRegisterAttempt = true;
                this.invalidRegisterMessage = msg;
            });
            window.API.send("register", {
                email,
                userName,
                password,
                confirm
            });
        }
    }
});

export default login;