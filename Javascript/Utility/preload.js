const { contextBridge, ipcRenderer } = require('electron');
const validChannels = [
    "showWindow",
    "requestGameBoard",
    "gameData",
    "showLoginScreen",
    "Authenticate",
    "login",
    "failedLoginAttempt",
    "failedRegisterAttempt",
    "toMainMenu",
    "logout",
    "register",
    "submitScore",
    "rankedResult",
    "rankedData",
    "getOwnScore",
    "getLeaderboard",
    "showLeaderboard",
    "rankedWon"
];

window.onload = () => {
    contextBridge.exposeInMainWorld("API", {
        receive: (channel, func) => {
            if(validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        receiveOnce: (channel, func) => {
            if(validChannels.includes(channel)) {
                ipcRenderer.once(channel, (event, ...args) => func(...args));
            }
        },
        send: (channel, data) => {
            if(validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        }
    });
}