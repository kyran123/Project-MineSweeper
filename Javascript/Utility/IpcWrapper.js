const ipcMain = require('electron').ipcMain;
const path = require('path');
const board = require('./GenerateBoard.js');
const user = require('./userManagement.js');
const ranked = require('./RankedManagement.js');

class wrapper {
    constructor() {
        this.ranked = ranked;
        this.user = user;
        this.board = board;
        this.mainWindow;
        this.network;
        //Basic listeners
        ipcMain.on("showWindow", (event) => {
            this.mainWindow.show();
            user.Authenticate()
            .then((response) => {
                if(response.result) {
                    //No need for login
                    event.sender.send("toMainMenu", response.user);
                } else {
                    //login
                    this.showLoginScreen(event);
                }
            })
            .catch((err) => {
                console.error(err);
            });
        });

        //User management listeners
        ipcMain.on("Authenticate", (event) => {
            user.Authenticate()
            .then((response) => {
                if(response.result) {
                    //No need for login
                    event.sender.send("toMainMenu", response.user);
                } else {
                    //login
                    this.showLoginScreen(event);
                }
            })
            .catch((err) => {
                console.error(err);
            });                
        });

        ipcMain.on("login", (event, login) => {
            user.login(login.email, login.password, (response) => {
                if(response.result) {
                    event.sender.send("toMainMenu", response.user);
                } else {
                    event.sender.send("failedLoginAttempt"); //Show error on login page
                }
            });
        });

        ipcMain.on("logout", (event) => {
            user.logout();
        });

        ipcMain.on("register", (event, register) => {
            user.register(register.email, register.userName, register.password, (response) => {
                 if(response.result) {
                    //Succesful
                    event.sender.send("toMainMenu", response.user);
                 } else {
                    //Failed
                    event.sender.send("failedRegisterAttempt", response.message);
                 }
            });
        });


        //Game related listeners
        ipcMain.on("requestGameBoard", (event, data) => {
            let gameBoard;
            if(data != undefined && data != null) {
                //Params: height, width, bomb count
                gameBoard = board.generate(data.height, data.width, data.bombs);
            } else {
                gameBoard = board.generate();
            }
            const u = user.getUserData();
            gameBoard.userName = u.name;
            gameBoard.userId = u.id;
            event.sender.send("gameData", gameBoard);
        });

        ipcMain.on("submitScore", (event, time) => {
            ranked.submitScore(time, (data) => {
                if(data.result) {
                    ranked.getLeaderBoard((data) => {
                        event.sender.send("rankedWon", { result: true, data: data });
                    });
                } else {
                    event.sender.send("rankedWon", { result: false, message: "Failed to submit score" })
                }
            });
        });
        ipcMain.on("getOwnScore", (event) => {
            ranked.getScore((data) => {
                event.sender.send('rankedData', data);
            });
        });
        ipcMain.on("getLeaderboard", (event) => {
            ranked.getLeaderBoard((data) => {
                event.sender.send("showLeaderboard", data);
            });
        });
    }

    //User management functions
    showLoginScreen(event) {
        event.sender.send("showLoginScreen");
    }
    //Show leaderboard
    showLeaderboard() {
        ranked.getLeaderBoard((data) => {
            this.mainWindow.webContents.send("rankedResult", data);
        });
    }
}


module.exports = new wrapper();