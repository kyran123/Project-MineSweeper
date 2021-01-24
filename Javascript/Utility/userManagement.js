const axios = require('axios');
const Store = require('electron-store');
const settings = new Store();

const userManagement = class userManagement {
    Authenticate() {
        return new Promise((resolve, reject) => {
            const token = settings.get('token');
            axios.get(`https://kylefransen.link/users/auth`, { 
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            })
            .then((response) => {
                if(response.data.result) {
                    const user = this.getUserData();
                    //Succesful Authentication
                    resolve({ 
                        result: true,
                        user: user
                    });
                } else {
                    //Failed Authentication
                    resolve({ result: false });
                }
            })
            .catch((err) => {
                console.error(err);
                resolve({ result: false, error: err });
            });
        });
    }
    login(email, password, callback) {
        //Axios request to api for login
        axios.post(`https://kylefransen.link/users/login`, {
            email,
            password
        })
        .then((response) => {
            settings.set('username', response.data.userName);
            settings.set('userId', response.data.id);
            settings.set('token', `${response.data.token}`);
            callback({ 
                result: true, 
                user: {
                    name: response.data.userName,
                    id: response.data.id 
                }
            });
        })
        .catch((err) => {
            console.error(err);
            callback({ result: false, error: err });
        });
    }
    getToken(callback) {
        const user = this.getUserData();
        const token = settings.get('token');
        callback({ result: true, token: token });
    }
    register(email, username, password, callback) {
        axios.post(`https://kylefransen.link/users/signup`, {
            email,
            username,
            password
        })
        .then((response) => {
            if(response.data.result) {
                settings.set('username', response.data.Username);
                settings.set('userId', response.data.id);
                settings.set('token', `${response.data.token}`);
                callback({ 
                    result: true, 
                    user: {
                        name: response.data.userName,
                        id: response.data.id 
                    }
                });
            } else {
                callback({ result: false, message: response.data.message });
            }            
        })
        .catch((err) => {
            console.error(err);
            callback({ result: false, error: err });
        });
    }
    logout() {
        const user = this.getUserData();
        settings.set('token', ``);
    }
    getUserData() {
        return {
            name: settings.get('username'),
            id: settings.get('userId')
        }
    }
}

module.exports = new userManagement();