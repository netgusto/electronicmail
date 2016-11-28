'use babel';

import React from 'react';
import { Button, Intent } from "@blueprintjs/core";


export default class Home extends React.Component {

    onClick() {
        const { talkToMainPromise } = this.props;

        const query = `
        {
            hello,
            mailboxes {
                ...MailboxRecursive
            }
        }

        # see https://github.com/facebook/graphql/issues/91#issuecomment-206743676
        fragment MailboxProps on Mailbox {
            name,
            path
        }

        fragment MailboxRecursive on Mailbox {
            ...MailboxProps,
            children {
                ...MailboxProps,
                children {
                    ...MailboxProps,
                    children {
                        ...MailboxProps,
                        children {
                            ...MailboxProps,
                            children {
                                ...MailboxProps
                            }
                        }
                    }
                }
            }
        }
        `;

        talkToMainPromise('query', query)
        .then(result => console.log(result))
        .catch(err => console.error(err));
    }

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
                <Button iconName="refresh" intent={Intent.PRIMARY} text="Hello, World !!" onClick={::this.onClick}/>
            </div>
        );
    }
}
