import React from 'react';
import ReactDOM from 'react-dom';
import Home from './component/Home.js';
import { ipcRenderer } from 'electron';

function talkToMain(action, payload) {
    ipcRenderer.send('renderer-event', {
        action,
        payload
    });
}

ipcRenderer.on('main-event', (event, data = {})  => {
    switch(data.action) {
        case 'debug': {
            console.log('DEBUG from main-event : ', data.payload);
            talkToMain('debug', '"' + data.payload + '" yourself.');
            break;
        }
        default: {
            console.error('Unkown event emitted from main', event, data);
            break;
        }
    }
});

window.onload = function(){
    ReactDOM.render(<Home />, document.getElementById('app'));
}
