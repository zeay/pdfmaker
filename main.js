const {app, BrowserWindow, globalShortcut} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const { session, IncomingMessage } = require('electron');
require('events').EventEmitter.defaultMaxListeners = Infinity;
const ipcFun = require('./ipcFun');
 global.win;
//-------------Function Started--------------------------------------------------
function createWindow () {
      // Create the browser window.
    global.win = new BrowserWindow({width: 1200, height: 600, webPreferences:{
            nodeIntegration: false,
            allowRunningInsecureContent:true,
            preload: __dirname+'/external.js',
            webSecurity: false,
   }});
    global.win.setMenu(null);
    global.win.loadURL("https://google.co.in");
    const ses = global.win.webContents.session;
    ses.clearCache(()=>{
      console.log("cached clear");
    });
    ses.clearStorageData();
    ses.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36");
    console.log(ses.getUserAgent());
    //load url;
     // Open the DevTools.
    global.win.webContents.openDevTools();
    global.win.webContents.on('media-started-playing', function(e){
        console.log("Media started playing");
    });
    session.defaultSession.webRequest.onBeforeSendHeaders(function(details, cb){
        cb(details);
    });
    global.win.on('closed', () => {
        win = null
      });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  };
})

