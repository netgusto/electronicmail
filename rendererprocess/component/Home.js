'use babel';

import React from 'react';
import { Button, Intent } from "@blueprintjs/core";


export default class Home extends React.Component {

    render() {
        const nodever = process.versions.node;
        const chromever = process.versions.chrome;
        const electronver = process.versions.electron;

        // In renderer process (web page).
        // console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

        return (
            <div>
                {/*<pre>{JSON.stringify(this.state.mailboxes, null, 4)}</pre>*/}
                <div>Hello from React with ES6 !</div>
                We are using node {nodever},<br />
                Chrome {chromever},<br />
                and Electron {electronver}.
                <br />
                <Button iconName="refresh" intent={Intent.PRIMARY} text="Hello, World !" />
            </div>
        );
    }
}
