import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import url from 'url';
import Emitter from 'tiny-emitter';

let win = null;

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({ width: 800, height: 600 });

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, '..', 'rendererprocess', 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    win.webContents.openDevTools()
    setTimeout(() => win.webContents.send('main-event', {
        action: 'debug',
        payload: 'da fuq ?'
    }), 1000);

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    });
}

app.on('ready', createWindow);

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) createWindow();
});

/*
let mailboxes = {};
var ImapClient = require('emailjs-imap-client')
var client = new ImapClient('mail.netgusto.com', 993, {
auth: {
user: 'contact@netgusto.com',
pass: 'bGEqNy3TDpMPJxkvJscyooQPWosgnNjY9QPexVDa'
},
requireTLS: true
});

client.connect().then(() => {
client.listMailboxes()
.then(_mailboxes => mailboxes = _mailboxes)
.then(() => client.close())
.then(() => console.log("logged out"))
});
*/

function talkToRenderer(action, payload) {
    win.webContents.send('main-event', { action, payload });
};

const emitter = new Emitter();
emitter.on('renderer-event-debug', payload => {
    console.log('DEBUG from renderer-event : ', payload);
});

emitter.on('renderer-event-debug', payload => {
    setTimeout(() => talkToRenderer('debug', payload + ' ??'), 1000);
});

ipcMain.on('renderer-event', (event, data) => {
    emitter.emit('renderer-event-' + data.action, data.payload);
});
