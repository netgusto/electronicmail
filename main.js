import { app, BrowserWindow } from 'electron';

const path = require('path');
const url = require('url');

let win = null;

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600})

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

app.on('ready', createWindow);

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});


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

// In main process.
const { ipcMain } = require('electron');

ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg);  // prints "ping"
    event.sender.send('asynchronous-reply', mailboxes);
});

ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg)  // prints "ping"
    event.returnValue = 'pong'
});
