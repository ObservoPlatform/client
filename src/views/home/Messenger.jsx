import React, { Component } from "react" 
import duix from 'duix'; 
import {Drawer } from "antd" 


/**
 * Messenger - Component for Rendering the Messenger Drawer for Conversation
 * @copyright 2019 ImportCore
 * @author Brendan Fuller @ImportProgram
 */
export default class Messenger extends Component {
    constructor() {
        super()
        this.unsub = []
        this.state = {
            openMessenger: false //Is the drawer open?
        }
    }
    componentDidMount() {
        this.unsub[0] = duix.subscribe('fixed_openMessenger', this._openMessenger.bind(this));
        this.unsub[0] = duix.subscribe('portal_logout', this._onLogout.bind(this));
    }
    //Remove all subscriptions when unmounted.
    componentWillUnmount() { for (let e in this.unsub) { this.unsub[e](); } }
    /**
     * OpenMessenger - Opens the Messenger Drawer
     */
    _openMessenger() {
        //Update State
        this.setState({ openMessenger: true })
    }
    /**
     * onLogout - Event for when the USER logs out of account.
     * 
     *  - Close Drawer AS messages only come in if user is still signed in.
     */
    _onLogout() {
        //Update State
        this.setState({ openMessenger: false })
    }
    /////////////////////
    /**
     * onMessengerClose - Event triggered when the drawer closes
     */
    onMessengerClose() {
        this.setState({ openMessenger: false })
    }
    /////////////////////
    render() {
        return <Drawer
            title="Messeger"
            placement="right"
            closable={true}
            onClose={this.onMessengerClose.bind(this)}
            visible={this.state.openMessenger}
            width={700}
        >
        </Drawer>
    }
}