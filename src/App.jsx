
import { hot } from 'react-hot-loader';

import React, { Component } from "react" //React itself
import ReactDom from "react-dom" //React dom to render to the DOM
import duix from 'duix'; //Duix is a subscrbier based state management. Think of it like event listeners.
import { notification, Icon, Input, Checkbox, Button, Alert, Badge, Menu, Dropdown, Avatar, Tooltip, Modal, Drawer } from "antd" //Ant Design, simple yet amazing
//Convert to @importcore libraries on NPM
import Grid from 'o-grid'; //Flex based grid layout, which allows perfect alignment.
import MediaQuery from "o-mediaquery"
import { Colors } from "o-constants"
import io from 'socket.io-client'; //Socket client

//Home
import Home from "./views/home/Home"
import Project from "./views/project/Project"
import Notification from "./views/all/Notifications"

//CSS
import '../node_modules/antd/dist/antd.css';
import '../node_modules/@importcore/crust/dist/crust.css';

duix.set('session', null);

let ip = "localhost:35575"
duix.set("app/address", ip)

notification.config({
    placement: "bottomRight",
});

const openNotificationWithType = (type, title, message) => {
    notification[type]({
        message: title,
        description: message,
    });
};


/**
 * App
 * @author ImportProgram <importprogram.me>
 * @copyright ObservoPlatform 2019
 * 
 * The Apps is the Control Center from Observo. It connected to the server via 
 * /core/, setups the views for use and keeps everything in check.
 * 
 * SOCKET:
 *  
 * DUIX:
 *  
 */
class App extends Component {
    constructor() {
        super()
        this.unsub = [];
        this.state = {
            homeState: "LOADING", //Visual State
            projectState: "MAIN",
            state: "HOME"
        }
    }
    componentDidMount() {
        //Disabled RightClick (on body)
        //window.addEventListener("contextmenu", function (e) { e.preventDefault(); })

        //Setup Duix Subscribers
        this.unsub[0] = duix.subscribe("home/state", this._updateVisualState.bind(this))
        this.unsub[1] = duix.subscribe("app/logout", this._confirmLogOut.bind(this))

        //Default Socket for Observo (/core/)
        this.coreSocket = io.connect(`http://${ip}/core/`)
        //Connected to the server
        this.coreSocket.on("connect", () => {
            //Open Notification w/ Type
            openNotificationWithType("success", "Connected", "You have connected to the server.")
            duix.set('app/connect', this.coreSocket); //We connected, lets set the core socket for all component to use globally
            duix.set("home/state", "ACCOUNT") //Also change the VISUAL STATE
            this.coreSocket.emit("auth/validateKey", ({ uuid: "872571a1-0872-4e74-8b90-57df2bb75093", authKey: "7334ad56-7893-4539-ba36-a5eb74d67deb" }))
            this.coreSocket.on("auth/valid", (data) => {
                ///Check if we have the session
                if (data.session != null) {
                    duix.set('app/disconnect', false) //Reset Disconnect Status
                    duix.set('app/account/valid', true) //Set ACCOUNT VALID
                    duix.set('app/account/uuid', data.uuid); //Set UUID  
                    duix.set('app/account/session', data.session); //Set SESSION
                    duix.set('app/account/username', data.username); //Set USERNAME
                    duix.set('home/properties/style/top', 80) //SET STYLE ANIMATION

                    //Update Home State
                    this.setState({ homeState: "PORTAL" })

                }
            })
        });
        this.coreSocket.on("disconnect", () => {
            duix.set('app/disconnect', true)
            duix.set("home/state", "LOADING")
            openNotificationWithType("error", "Disconnected", "You have disconnected from the server.")
        })
    }
    /**
    * componentWillUnmount - React Lifecycle method. Unmount everything when needed.
    */
    componentWillUnmount() {
        for (let e in this.unsub) { this.unsub[e](); }
        this.coreSocket.close()
    }
    /////////////////////
    /**
     * updateVisualState - Updates the VISUAL state of the application.
     *
     * STATES:
     * - LOADING - Loading Screen at page load
     * - ACCOUNT - Account Screen for logging in
     * - PORTAL - Portal Screen for Project, Messenger and more
     * - DOWNLOAD - Download Screen for fetching plugins
     * - VIEWER - Viewer Screen for plugin viewer and real-time communication.
     *
* @param {String} state
        */
    _updateVisualState(state) {
        this.setState({ homeState: state })
    }
    /**
     * _confirmLogOut - Event for when the USER ATTEMPTS to logout. 
     * 
     * - Open Confirm Dialog to ask if they REALLY want to log out 
     */
    _confirmLogOut(value) {
        const confirm = Modal.confirm;
        if (value == true) {
            confirm({
                title: 'Are you sure you want to logout?',
                onOk() {
                    duix.set("app/logout", false)
                    duix.set("home/state", "ACCOUNT")
                    console.log("[app/logout] Logout Successful")
                },
                onCancel() {
                    console.log("[app/logout] Logout Canceled")
                },
            });
        }
    }
    /**
     * renderPages - Renders a view of a page
     * @param {} media 
     */
    renderPages(media) {
        if (this.state.state == "HOME") {
            return <Home media={media} state={this.state.homeState} />
        } else if (this.state.state = "PROJECT") {
            return <Project media={media} state={this.state.projectState} />
        }
    }
    /**
     * renderNotification - Renders the Notification Drawer
     */
    renderNotification() {
        return <Notification />
    }
    /////////////////////
    render() {
        return <MediaQuery>
            {media => (
                <div className="app">
                    {this.renderNotification()}
                    {this.renderPages(media)}
                </div>
            )}
        </MediaQuery>
    }
}

export default hot(module)(App);