const axios = require('axios');
const Store = require('electron-store');
const settings = new Store();

const rankedManagement = class RankedManagement {
    submitScore(time, callback) {
        const user = this.getUserData();
        const token = settings.get('token');
        axios.post(`https://kylefransen.link/minesweeper/add`, {
            score: time,
            userId: user.id,
            user: user.name
        }, { 
            headers: { 
                authorization: `Bearer ${token}` 
            }
        })
        .then((response) => {
            callback(response.data);
        })
        .catch((err) => {
            console.log(err);
        });
    }
    getLeaderBoard(callback) {
        const token = settings.get('token');
        axios.get(`https://kylefransen.link/minesweeper/leaderboard`, { 
            headers: { 
                authorization: `Bearer ${token}` 
            }
        })
        .then((response) => {
            callback(response.data);
        })
        .catch((err) => {
            console.log(err);
        });
    }
    getScore(callback) {
        const token = settings.get('token');
        const user = this.getUserData();
        axios.post(`https://kylefransen.link/minesweeper/score`, {
            user: {
                name: user.name,
                id: user.id
            }
        }, {
            headers: { 
                authorization: `Bearer ${token}` 
            }
        })
        .then((response) => {
            callback(response.data);
        })
        .catch((err) => console.error);
    }
    getUserData() {
        return {
            name: settings.get('username'),
            id: settings.get('userId')
        }
    }
}

module.exports = new rankedManagement();