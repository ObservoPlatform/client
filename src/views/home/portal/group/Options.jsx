import React, { Component } from "react"
import duix from "duix"
import Grid from "o-grid"
import { Tooltip, Icon, Button, Modal } from "antd"


import GroupSettings from "./Settings"
import CreateGroup from "../CreateGroup"

import UserSearch from "../../../../components/inputs/UserSearch"
/**
 * Group: Options
 * @author ImportProgram
 * @copyright ObservoPlatform 2019
 * 
 * The GroupSidebar is the small sidebar on the left of Observo on the home screen. 
 * It will show all invited accepted groups. Selecting a group will populate the GroupPanel
 * 
 * SOCKET:
 *  - groups/list
 *  - groups/select
 * 
 * DUIX:
 *  - app/connect
 *  - home/state
 * 
 */
export default class Options extends Component {
    constructor() {
        super()
        this.unsub = []
        this.state = {
            openUsers: false,
            openSettings: false,
            selected: "home",
        }
    }
    /**
     * componentDidMount - Component Mounted
     */
    componentDidMount() {
        this.unsub[0] = duix.subscribe('app/connect', this._onConnect.bind(this));
        this.unsub[1] = duix.subscribe("home/state", this._onHomeStateChange.bind(this))
        this.unsub[2] = duix.subscribe('home/groups/select', this._onGroupSelect.bind(this));

    }
    componentWillUnmount() { for (let e in this.unsub) { this.unsub[e](); } }
    /////////////////////
    /**
     * onConnect - When the CLIENT connects to the socket server. 
     * @param {Object} client 
     */
    _onConnect(client) {
        this.coreSocket = client
    }
    _onHomeStateChange(state) {
        if (state == "ACCOUNT") {
            this.setState({ openUsers: false })
        }
    }
    _onGroupSelect(group) {
        this.setState({ group })
    }
    /**
     * showPopoutSidebar - Shows sidebar from rights side 
     */
    _toggleUsers() {
        if (this.state.openUsers) {
            this.setState({ openUsers: false })
        } else {
            this.setState({ openUsers: true })
        }
    }
    _toggleSettings() {
        console.log(duix.get("home/portal/state"))
        if (!this.state.openSettings && (duix.get("home/portal/state") != "HOME")) {
            this.setState({ openSettings: true })
        }
        else if (this.state.openSettings == true) {
            this.setState({ openSettings: false })
        }
    }
    _showInviteSidebar() {
        this._toggleUsers(true)
    }
    renderButtonSidebar() {
        return <Grid row style={{ borderRadius: 10, padding: 8 }} width={50} height={90} background="a8a8a8">
            <Grid height={40}>
                <Tooltip title="Settings" placement="right" overlayClassName="xxxxxx">
                    <Button shape="round" icon="setting" onClick={this._toggleSettings.bind(this)} ></Button>
                </Tooltip>
            </Grid>
            <Grid height={40}>
                <Tooltip title="Users" placement="right" overlayClassName="xxxxxx">
                    <Button shape="round" icon="user" onClick={this._showInviteSidebar.bind(this)}></Button>
                </Tooltip>
            </Grid>
        </Grid>
    }
    /**
     * inviteUsers - Sidebar panel where you can invite users to a GROUP
     */
    renderUsers() {
        let style = { width: 0 }
        if (this.state.openUsers) {
            style = { width: 300 } /*?*/
        }
        return <Grid col style={style} height={500} className="sidebar-right-popout" background="#a8a8a8">
            <Grid row>
                <Grid col height={62} background="#191919">
                    <Grid><p style={{ fontSize: 24, color: "white", paddingTop: 10, marginLeft: 10 }}>Users</p></Grid>
                </Grid>
                <Grid row style={{ padding: 5 }}>
                    ?
                </Grid>
            </Grid>
        </Grid>

    }
    renderGroupSettings() {
        return <Modal

            bodyStyle={{ padding: 0 }}
            visible={this.state.openSettings}
            closable={false}
            footer={null}
            width={700}
         
        >
            <GroupSettings group={this.state.group} onClose={this._toggleSettings.bind(this)} />
        </Modal >
    }
    /**
     * render - Main Render Process for React
     */
    render() {
        return <>
            {this.renderButtonSidebar()}
            {this.renderUsers()}
            {this.renderGroupSettings()}
        </>
    }
}