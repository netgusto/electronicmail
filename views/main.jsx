'use babel';

import React from 'react';

export default class Main extends React.Component {
    render() {
        const nodever = process.versions.node;
        const chromever = process.versions.chrome;
        const electronver = process.versions.electron;

        return (
            <div>
                <div>Hello from React with ES6 !</div>
                We are using node {nodever},<br />
                Chrome {chromever},<br />
                and Electron {electronver}.
            </div>
        );
    }
}
