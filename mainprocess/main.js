import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import url from 'url';
import Emitter from 'tiny-emitter';
import Immutable from 'immutable';

import {
    graphql,
    buildSchema
} from 'graphql';

let win = null;
function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({ width: 800, height: 600 });

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, '..', 'rendererprocess', 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    });

    win.webContents.openDevTools(); // Open the DevTools.
//    setTimeout(() => talkToRenderer('debug', 'dafuq ?'), 1000);
}

app.on('ready', createWindow);
app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) createWindow();
});
app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

function talkToRenderer(action, payload) {
    win.webContents.send('main-event', { action, payload });
};

const emitter = new Emitter();
ipcMain.on('renderer-event', (event, data) => {
    // Received an event from renderer
    // Relaying it to main process subscribers
    emitter.emit('renderer-event-' + data.action, data.payload);
});

const schema = buildSchema(`
type Query {
    hello: String,
    mailboxes: [Mailbox]
}

type Mailbox {
    root: Boolean,
    name: String,
    path: String,
    delimiter: String,
    listed: Boolean,
    subscribed: Boolean,
    specialUse: String,
    specialUseFlag: String,
    flags: [String],
    children: [Mailbox]!
}
`);

const root = {
    hello: () => Promise.resolve('Hello, World !'),
    mailboxes: () => new Promise((resolve, reject) => {
        var ImapClient = require('emailjs-imap-client')
        var client = new ImapClient('mail.netgusto.com', 993, {
            auth: {
                user: 'contact@netgusto.com',
                pass: 'bGEqNy3TDpMPJxkvJscyooQPWosgnNjY9QPexVDa'
            },
            requireTLS: true
        });

        client.connect()
        .then(() => {
            client.listMailboxes()
            .then(mailboxes => mailboxes.children)
            .then(mailboxes => resolve(mailboxes))
            .then(() => client.close())
        })
        .catch(err => reject(err));
    }),
};

emitter.on('renderer-event-query', (query, responseevent) => {
    graphql(schema, query, root)
        .then(result => {
            if('errors' in result && result.errors.length) {
                throw result.errors.map(error => error.message);
            } else {
                win.webContents.send(responseevent + '-resolve', result.data);
            }
        })
        .catch(err => {
            win.webContents.send(responseevent + '-reject', err);
        });
});

emitter.on('renderer-event-promise-request', payload => {
    emitter.emit('renderer-event-' + payload.action, payload.payload, payload.responseevent);
});

// Custom subscribers
emitter.on('renderer-event-debug', payload => {
    console.log('DEBUG from renderer-event : ', payload);
});

emitter.on('renderer-event-debug', payload => {
    setTimeout(() => talkToRenderer('debug', payload + ' ??'), 1000);
});
