import React from 'react';
import ReactDOM from 'react-dom';
import Home from './component/Home.js';
import { remote, ipcRenderer } from 'electron';

function talkToMain(action, payload) {
    ipcRenderer.send('renderer-event', {
        action,
        payload
    });
}

let store = null;

ipcRenderer.on('main-event', (event, data = {})  => {
    switch(data.action) {
        case 'debug': {
            console.log('DEBUG from main-event : ', data.payload);
            //talkToMain('debug', '"' + data.payload + '" yourself.');
            break;
        }
        case 'store-changed': {
            console.log(store === data.payload ? 'STORE HAS NOT CHANGED' : 'STORE HAS CHANGED');
            store = data.payload;
            console.log(store);
            break;
        }
        case 'query-then': {
            console.log('QUERY THEN', data.payload);
            break;
        }
        default: {
            console.error('Unkown event emitted from main', event, data);
            break;
        }
    }
});

let promiseindex = 0;
const talkToMainPromise = function(action, payload) {
    const p = new Promise((resolve, reject) => {
        ipcRenderer.once('promise-response-' + promiseindex + '-resolve', (event, data) => {
            resolve(data);
        });
        ipcRenderer.once('promise-response-' + promiseindex + '-reject', (event, data) => {
            reject(data);
        });
    });

    talkToMain('promise-request', {
        action,
        payload,
        responseevent: 'promise-response-' + promiseindex
    });

    promiseindex++;
    return p;
};

window.onload = function(){
    ReactDOM.render(
        <Home talkToMainPromise={talkToMainPromise} />,
        document.getElementById('app')
    );
}
