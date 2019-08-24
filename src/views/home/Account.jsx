import React, { Component } from "react"
import duix from 'duix';
import { Icon, Input, Checkbox, Button, Alert } from "antd"

import Grid from 'o-grid';
import { Colors } from "o-constants"

/**
 * Account
 * @author ImportProgram <importprogram.me>
 * @copyright ObservoPlatform 2019
 * 
 *  The account component is where the user will sign in to observo. 
 * 
 * SOCKET:
 *  - auth/invalid
 *  - auth/valid
 * DUIX:
 *  - app/connect #EVENT
 *  - app/logout #EVENT
 *  - app/account/session #EVENT
 */
export default class Account extends Component {
    constructor() {
        super()
        this.unsub = [];
        this.state = {
            authKey: null, //Authentication key
            session: null, //Session validator. Used for checking socket namespaces
            password: null, //Password of the user. Cleared on connect.
            username: null, //Username of the user. Cleared on logout.
            remember: false, //Remember me?
            invalid: false, //If the sign in attempt was invalid, if so this will be true
            isSignedIn: false, //If the user is signed in, if so this will be true
        }
    }
    /**
     * componentDidMount - Component Mount, subscribe to events
     */
    componentDidMount() {
        this.unsub[0] = duix.subscribe('app/connect', this._onConnect.bind(this));
        this.unsub[1] = duix.subscribe('app/logout', this._onLogout.bind(this));
        this.unsub[2] = duix.subscribe('app/account/session', this._onSession.bind(this));
    }
    componentWillUnmount() { for (let e in this.unsub) { this.unsub[e](); } }
    //////////////////////////////////////////////////
    _onConnect(client) {
        this.coreSocket = client
        client.on("auth/invalid", () => {
            this.setState({ invalid: true })
        })
    }
    /**
     * onSession - When a new session is sent out. 
     */
    _onSession() {
        //When a session subscription is sent, we known the user is signed in successfully.
        this.setState({ isSignedIn: true })
    }
    _onLogout() {
        //alert("LOGGED OUT")
        this.setState({
            isSignedIn: false,
            authKey: null,
            session: null,
            password: null,
            username: null,
            remember: false,
            invalid: false,
        })
    }

    ///////////////////////////////////
    /**
     * OnRememberMe - Event for the Remember Me checkbox
     * @param {Event} e 
     */
    onRememberMe(e) {
        console.log(e)
        this.setState({ remember: e.target.checked })
    }
    /**
     * OnUsername = When the usenrame is typed
     * @param {Event} e 
     */
    onUsername(e) {
        this.setState({ username: e.currentTarget.value })
    }
    /**
     * OnPassword - When the password is typed
     * @param {Event} e 
     */
    onPassword(e) {
        this.setState({ password: e.currentTarget.value })
    }
    /**
     * onAccountSignIn - Handles the "Sign In" button click.
     */
    onAccountSignIn() {
        if (this.state.password.length >= 5 && this.state.username.length >= 2) {
            this.coreSocket.emit("auth/validateAccount", { username: this.state.username, password: this.state.password, remember: this.state.remember })
        }
    }
    //////////////////////////////////////////
    /**
     * renderAlert - Renders the alert for the user if 
     * the user has attempted a signin and was invalid.
     */
    renderAlert() {
        let style = { opacity: 0 }
        if (this.state.invalid == true) {
            style = { opacity: 1 }
        }
        return <div style={style} className="error ">
            <Alert
                message={<strong>Invalid Username or Password</strong>}
                type="error"
            />
        </div>
    }
    //Normal Render
    render() {
        //Default Style
        let style = { opacity: 0, height: 0 }
        let height = 0

        //If we are in VSIUAL STATE Account, lets change the margin
        if (this.props.state == "ACCOUNT") {
            style = { marginBottom: 250, opacity: 1 }
        }
        //If we are signed in, just hide the sign in screen, as it messes with the PORTAL animation
        if (this.state.isSignedIn) {
            style = { display: "none" }
        }

        return <Grid row style={style}  center h v className="account">
            <Grid row width={400}>
                <Grid height={50} style={{ marginBottom: 4 }}>  <Input value={this.state.username} onChange={this.onUsername.bind(this)} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} style={{ marginBottom: 15 }} placeholder="Username" /></Grid>
                <Grid height={50}>  <Input value={this.state.password} onChange={this.onPassword.bind(this)} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} style={{ marginBottom: 15 }} placeholder="Password" /></Grid>
                <Grid col height={80}>
                    <Grid width={150} style={{ margin: 7 }}><Checkbox checked={this.state.remember} onChange={this.onRememberMe.bind(this)}>Remember Me</Checkbox></Grid>
                    <Grid />
                    <Grid style={{ marginTop: 10 }}>
                        <Button onClick={this.onAccountSignIn.bind(this)} style={{ background: Colors.primary, border: `1px solid ${Colors.primary}` }} type="primary" shape="round" icon="login" size="large">Sign In</Button>
                    </Grid>
                </Grid>
                {this.renderAlert()}
            </Grid>
        </Grid>


    }
}