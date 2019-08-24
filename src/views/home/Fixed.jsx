import React, { Component } from "react" //React itself
import duix from 'duix'; //Duix is a subscrbier based state management. Think of it like event listeners.
import { Button, notification, Badge } from "antd" //Ant Design, simple yet amazing
notification.config({
    placement: "bottomRight",
});
import Grid from "o-grid"
/**
 * Fixed
 * @author ImportProgram <importprogram.me>
 * @copyright ObservoPlatform 2019
 * 
 * The global component for fixed items for HOME.
 * 
 * SOCKET:
 *  - NONE
 * DUIX:
 *  - app/connect #EVENT
 *  - app/logout #SET
 *  - app/messenger/open #SET
 *  - app/notifications/amount #EVENT
 *  - app/notifications/open #SET
 */
export default class Fixed extends Component {
    constructor() {
        super()
        this.unsub = []
        this.state = {
            openMessenger: false,
            notificationAmount: 0
        }
    }
    /**
     * componentDidMount - Mount Component, add the subscribers.
     */
    componentDidMount() {
        this.unsub[0] = duix.subscribe('app/connect', this._onConnect.bind(this));
        this.unsub[1] = duix.subscribe('app/notifications/amount', this.notificationsAmount.bind(this));
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

    }
    notificationsAmount(amount) {
        this.setState({ notificationAmount: amount })
    }
    /////////////////////
    /**
     * onLogout - When the logout floating button is pressed
     */
    onLogout() {
        duix.set("app/logout", true)
    }
    /**
     * onOpenMessenger - Opens the Messenger drawer for conversations
     */
    onOpenMessenger() {
        duix.set("app/messenger/open", true)
        console.log("Say")
        this.coreSocket.emit("notifications/dummy")
    }
    openNotifications() {
        duix.set("app/notifications/open", true)
    }
    /////////////////////
    render() {
        let translate = { height: 100 }
        //Check the VISUAL STATE
        if (this.props.state == "PORTAL") {
            //If the visual state is portal, lets move the items into frame, but animating them from the sides.
            translate = { transform: "translate(0px)", height: 100 }
        }
        let items = []
        items.push(<div style={translate} className="fixed-left">
            <Button shape="round" icon="logout" onClick={this.onLogout.bind(this)}></Button>
        </div>)
        items.push(<div style={translate} className="fixed-right">
            <Grid col style={{ padding: 10 }}>
                <Grid><Button shape="round" icon="message" onClick={this.onOpenMessenger.bind(this)}></Button></Grid>
                <Grid style={{ marginLeft: 5 }}><Badge count={this.state.notificationAmount}><Button shape="round" icon="bell" onClick={this.openNotifications.bind(this)}></Button>   </Badge></Grid>
            </Grid>
        </div>)
        //Return the array of items back.
        return items
    }

}