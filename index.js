const { app, BrowserWindow, electron, Menu, ipcRenderer } = require('electron');
const ipcMain = require('electron').ipcMain;
require('dotenv').config();
const ipcWrapper = require('./Javascript/Utility/IpcWrapper.js');
let mainWindow;
let developmentMode = true;

function showWindow() {
    let path = require('path');
    //screen size
    let screen = require('electron').screen.getPrimaryDisplay();
    let screenWidth = 0;
    let screenHeight = 0;
    //Setup menu
    if(developmentMode) {
        let menu = Menu.buildFromTemplate([
            {
                label: 'File',
                submenu: [
                    { 
                        label: 'Set development mode',
                        submenu: [
                            { label: 'True', click() { developmentMode = true } },
                            { label: 'False', click() { developmentMode = false } }
                        ]
                    },
                    { 
                        label: 'Reload', 
                        click() { app.relaunch(); app.exit(); },
                        accelerator: 'CMDorCTRL+Space'
                    },
                    { type: 'separator' },
                    { label:'Exit', click() { app.quit() } }
                ]
            },
            {
                label: 'User',
                submenu: [
                    { label: 'Get user data', click() { console.log(ipcWrapper.user.getUserData()) } },
                    { label: 'Authenticate', click() { ipcWrapper.user.Authenticate().then(console.log).catch(console.log); } },
                    { type: 'separator' },
                    { label: 'Log out', click() { ipcWrapper.user.logout(); mainWindow.webContents.send("showLoginScreen") } }
                ]
            },
            {
                label: 'Ranked',
                submenu: [
                    {
                        label: 'Score',
                        submenu: [
                            { label: 'Send fake score', click() { ipcWrapper.ranked.submitScore(10482, (data) => { console.log(data); }); } },
                            { label: 'Get leaderboard', click() { ipcWrapper.showLeaderboard(); } }
                        ]
                    }        
                ]
            }
        ]);
        Menu.setApplicationMenu(menu);
        screenWidth = screen.bounds.width;
        screenHeight = screen.bounds.height;
    } else {
        screenWidth = (screen.bounds.width / 3);
        screenHeight = (screen.bounds.height / 3);
    }
    //show window
    mainWindow = new BrowserWindow({
        width: screenWidth,
        height: screenHeight,
        backgroundColor: '#36393f',
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, '/Javascript/Utility/preload.js'),
            devTools: developmentMode
        }
    });

    ipcWrapper.mainWindow = mainWindow;

    mainWindow.loadFile('Views/main.html');
    mainWindow.on('closed', () => { mainWindow = null });
    mainWindow.webContents.once('dom-ready', () => {
        ipcWrapper.mainWindow = mainWindow;
        ipcWrapper.network = require('./Javascript/Utility/Networking/Connection.js');
        if(developmentMode) {
            mainWindow.webContents.openDevTools();
        } else {
            mainWindow.removeMenu();
        }
    });
}

app.on('ready', showWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if(win === null) {
        showWindow();
    }
});