import React, { Component } from "react" //React itself
import ReactDom from "react-dom" //React dom to render to the DOM
import duix from 'duix'; //Duix is a subscrbier based state management. Think of it like event listeners.
import { Icon, Input, Checkbox, Button, Alert, Badge, Menu, Dropdown, Avatar, Tooltip, Modal, Drawer } from "antd" //Ant Design, simple yet amazing
//Convert to @importcore libraries on NPM
import Grid from 'o-grid'; //Flex based grid layout, which allows perfect alignment.
import MediaQuery from "o-mediaquery"
import { Colors } from "o-constants"
import io from 'socket.io-client'; //Socket client

//Home
import Home from "./views/home/Home"
import Project from "./views/project/Project"

//CSS
import '../node_modules/antd/dist/antd.css';
import '../node_modules/@importcore/crust/dist/crust.css';

duix.set('session', null);

let ip = "localhost:35575"
duix.set("ip", ip)

/**
 * Viewer - Observo's hub for plugin runtime.
 */
class Viewer extends Component {
    constructor() {
        super()
        this.unsubscribe = [];
    }
    componentDidMount() {
        this.unsubscribe[0] = duix.subscribe('home_connect', this.onConnect.bind(this));
    }
    componentWillUnmount() {
        for (let e in this.unsubscribe) {
            this.unsubscribe[e]();
        }
    }
    onConnect(client) {
        this.coreSocket = client
        this.coreSocket.on("core_validProject", (data) => {
            this.setState({ state: "VERIFY" })
        })
    }
    render() {
        return <h1>Hi</h1>
    }
}

/**
 * App - Main App of Observo and it runs on code
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
        window.addEventListener("contextmenu", function(e) { e.preventDefault(); })
        this.unsub[0] = duix.subscribe("home_state", this._updateVisualState.bind(this))
        this.unsub[1] = duix.subscribe("fixed_logout", this._onLogOutStart.bind(this))

        this.coreSocket = io.connect(`http://${ip}/core/`)
       
        this.coreSocket.on("connect", () => { 
            
            duix.set('home_connect', this.coreSocket); //We connected, lets set the core socket for all component to use globally
            duix.set("home_state", "ACCOUNT") //Also change the VISUAL STATE
            this.coreSocket.emit("auth_validateKey", ({ uuid: "872571a1-0872-4e74-8b90-57df2bb75093", authKey: "7334ad56-7893-4539-ba36-a5eb74d67deb" }))
            this.coreSocket.on("auth_valid", (data) => {
                ///Check if we have the session
                if (data.session != null) {
                    duix.set('account_valid', true)
                    duix.set('account_uuid', data.uuid); //Set UUID Global 
                    duix.set('account_session', data.session); //Set USERs SESSION Global
                    duix.set('account_username', data.username); //Set USERs NAME Global
                    duix.set('home_setTop', 80) //Animation of the gome
                    this.coreSocket.emit("projects_getAll") //Now lets get projects
                   
                    this.setState({ homeState: "PORTAL" })
                 
                }
            })
        });
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
     * _onLogOutStart - Event for when the USER ATTEMPTS to logout. 
     * 
     * - Open Confirm Dialog to ask if they REALLY want to log out 
     */
    _onLogOutStart(value) {
        const confirm = Modal.confirm;
        if (value == true) {
            confirm({
                title: 'Are you sure you want to logout?',
                onOk() {
                    duix.set("portal_logout", true)
                    duix.set("home_state", "ACCOUNT")
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
    }
    renderPages(media) {
        if (this.state.state == "HOME") {
            return <Home media={media} state={this.state.homeState} />
        } else if (this.state.state = "PROJECT") {
            return <Project media={media} state={this.state.projectState} />
        }
    }
    /////////////////////
    render() {
        return <MediaQuery>
            {media => (
                <div>
                    {this.renderPages(media)}
                </div>
            )}
        </MediaQuery>
    }
}

//Render the DOM
ReactDom.render(<App />, document.querySelector("#app"))

