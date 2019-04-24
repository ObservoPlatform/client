import React, { Component } from "react" //React itself
import duix from 'duix'; //Duix is a subscrbier based state management. Think of it like event listeners.
import { Button, } from "antd" //Ant Design, simple yet amazing

import Grid from "o-grid"
/**
 * Fixed - The global component for fixed items.
 * @copyright 2019 ImportCore
 * @author Brendan Fuller @ImportProgram 
 */
export default class Fixed extends Component {
    constructor() {
        super()
        this.unsub = []
        this.state = {
            openMessenger: false
        }
    }
    /**
     * componentDidMount - Mount Component, add the subscribers.
     */
    componentDidMount() {
        this.unsub[0] = duix.subscribe('home_connect', this._onConnect.bind(this));
    }
    /**
     * componentWillUnmount - Unmount Componnet, remove all subscribers
     */
    componentWillUnmount() { for (let e in this.unsub) { this.unsub[e](); } }
    /////////////////////
    /**
     * onConnect - When the CLIENT connects to the socket server.
     * @param {Object} client
     */
    _onConnect(client) {
        this.coreSocket = client
        this.coreSocket.on("messenger_getNotifications", (data) => {
            let total = message.unreadAmount
            //TODO: Update total unread message count to button (when needed)
        })
    }
    /////////////////////
    /**
     * onLogout - When the logout floating button is pressed
     */
    onLogout() {
        duix.set("fixed_logout", true)
    }
    /**
     * onOpenMessenger - Opens the Messenger drawer for conversations
     */
    onOpenMessenger() {
        duix.set("fixed_openMessenger", true)
    }
    /////////////////////
    render() {
        let translate = {}
        //Check the VISUAL STATE
        if (this.props.state == "PORTAL") {
            //If the visual state is portal, lets move the items into frame, but animating them from the sides.
            translate = { transform: "translate(0px)" }
        }
        let items = []
        items.push(<div style={translate} className="fixed-left">
            <Button shape="round" icon="logout" onClick={this.onLogout.bind(this)}></Button>
        </div>)
        items.push(<div style={translate} className="fixed-right">
            <Button shape="round" icon="message" onClick={this.onOpenMessenger.bind(this)}></Button>
        </div>)
        items.push(this.props.media.lessThan("mobileMd") && <div style={{ height: "100%", width: "100%", zIndex: 1000, background: "gray" }} className="fixed-full">
            <Grid canvas>
                <Grid row center h v className="account">
                    <Grid row>
                        <p style={{ fontSize: 40, fontWeight: "bold", textAlign: "center", width: "100%" }} className="text">This is too small</p>
                    </Grid>
                </Grid>
            </Grid>
        </div>)
        //Return the array of items back.
        return items
    }

}