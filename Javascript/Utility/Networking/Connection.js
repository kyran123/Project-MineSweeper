const wrtc = require('wrtc');
const axios = require('axios');
const Store = require('electron-store');
const settings = new Store();

const conn = class playerConnection {
    connection;
    createRoom() {
        this.connection = wrtc.RTCPeerConnection();
        const user = this.getUserData();
        connection.createOffer()
        .then(offer => { 
            this.connection.setLocalDescription(new RTCSessionDescription(offer))
            .then().catch(err => console.error);

            const room = {
                host: user.name,
                gameType: 0,
                gameState: 0,
                maxPlayers: 2,
                board: [],
                description: this.connection.localDescription
            }

            const token = settings.get('token');
            axios.get(`https://kylefransen.link/minesweeper/createRoom`, { 
                headers: { 
                    authorization: `Bearer ${token}` 
                }
            })
            .then((response) => {
                
            })
            .catch((err) => {
                console.log(err);
            });
        })
        .catch(err => console.error);
    }
    joinRoom(id) {
        const user = this.getUserData();
        const token = settings.get('token');
        axios.get(`https://kylefransen.link/minesweeper/joinRoom`, {
            id: id
        }, { 
            headers: { 
                authorization: `Bearer ${token}` 
            }
        })
        .then((response) => {
            const roomDescription = response.data.room.description;
            if(this.connection == null || this.connection == undefined) this.connection = wrtc.RTCPeerConnection();
            this.connection.setRemoteDescription(roomDescription);
            this.connection.createAnswer()
            .then((answer) => {
                this.connection.setLocalDescription(new RTCSessionDescription(answer))
            })
            .catch(err => console.error);
        })
        .catch(err => console.error);
    }
    getUserData() {
        return {
            name: settings.get('username'),
            id: settings.get('userId')
        }
    }
}

module.exports = new conn();