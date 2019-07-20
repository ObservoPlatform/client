import React, { Component } from "react"
import duix from 'duix';
import { Icon, Button, Badge, Menu, Dropdown, Tooltip } from "antd"

import Grid from 'o-grid';

import GroupListings from "./portal/group/Listings"
import GroupOptions from "./portal/group/Options"
import UserHomePanel from "./portal/user/Panel"
import GroupPanel from "./portal/group/GroupPanel"


/**
 * Notifications
 * @author ImportProgram <importprogram.me>
 * @copyright ObservoPlatform 2019
 * 
 * 
 * The stored notifications will appear in the Notification Drawer (rendered here)
 * 
 * 
 * SOCKET:
 *  - notifications/amount #EVENT
 *  - notifications/new #EVENT
 *  - notifications/list #EVENT
 * DUIX:
 *  - app/connect #EVENT
 *  - app/logout #EVENT 
 *  - app/account/username #EVENT
 *  - app/account/uuid #SET
 */
export default class Portal extends Component {
    constructor() {
        super()
        this.unsub = [];
        this.state = {
            username: "master", //Username of the LOGGED IN user
            uuid: null, //UUID of LOGGED IN user

            panelState: "HOME", //The Panel State. Either to show the home, or user layout, or show the group layout of projects

            //Handles the right sidebar of users
            GroupOptionsUsers: false,

            //List of Projects (TODO: make this work)
            projects: []

        }
    }
    componentDidMount() {
        this.unsub[0] = duix.subscribe('app/connect', this._onConnect.bind(this));
        this.unsub[1] = duix.subscribe('app/account/username', this._onSetUsername.bind(this));
        this.unsub[2] = duix.subscribe('app/account/uuid', this._onSetUUID.bind(this));

    }
    componentWillUnmount() { for (let e in this.unsub) { this.unsub[e](); } }
    /////////////////////
    /**
     * onConnect - When the CLIENT connects to the socket server. 
     * @param {Object} client 
     */
    _onConnect(client) {
        //Reference the Socket
        this.coreSocket = client
        this.coreSocket.on("group/projects", () => {
            if (data.hasPropertyKey("projects")) {
                self.setState({ projects: data.projects })
            }
        })
    }
    /**
    * onSetUsername - Sets the username of the current authenticated user.
    * @param {Strirng} username 
    */
    _onSetUsername(username) {
        this.setState({ username })
    }
    /**
     * onSetUUID - Sets the uuid of the current user.
     * @param {String} uuid 
     */
    _onSetUUID(uuid) {
        this.setState({ uuid })
    }
    /**
     * onUserHomeSelect - Set the view state of the panel to HOME (and duix emit too)
     */
    _onUserHomeSelect() {
        duix.set("home/portal/state", "HOME")
        this.setState({ panelState: "HOME" })
    }
    _onGroupSelect(uuid) {
        duix.set("home/portal/state", uuid)
        this.setState({ panelState: uuid, projects: [] })
    }
    /////////////////////
    renderGroupSidebar() {
        return <GroupListings
            onHomeSelect={this._onUserHomeSelect.bind(this)}
            onGroupSelect={this._onGroupSelect.bind(this)}
        />
    }
    renderItem() {
        const menu = (
            <Menu>
                <Menu.Item key="1"><Icon type="delete" /> Archive </Menu.Item>
                <Menu.Item key="2"><Icon type="edit" />Rename</Menu.Item>
            </Menu>
        );
        return <Dropdown overlay={menu} trigger={['contextMenu']}>
            <Grid col background="lightgray" height={70} style={{ borderRadius: 4, paddingTop: 5, cursor: "pointer", marginBottom: 10 }} className="center item">
                <Grid width={40} style={{ padding: 10 }}>
                    <Badge count={5} style={{ backgroundColor: '#52c41a' }}>
                        <div className="head-example"></div>
                    </Badge>
                </Grid>
                <Grid col>
                    <p className="text" style={{ width: "100%", fontWeight: "bold", fontSize: 18, color: "#000", paddingTop: 16 }}>Example...</p>
                </Grid>
            </Grid>
        </Dropdown>
    }
    renderPanel() {
        if (this.state.panelState == "HOME") {
            return <UserHomePanel username={this.state.username} uuid={this.state.uuid} />
        } else {
            return <GroupPanel name={this.state.name} projects={this.state.projects} />;
        }
    }
    /////////////////////////////////////
    render() {
        let style = { opacity: 0, height: 0 }
        if (this.props.state == "PORTAL") {
            style = { marginBottom: 250, opacity: 1, borderRadius: 10 }
        }
        return <Grid col style={style} className="portal">
            {this.renderGroupSidebar()}
            <Grid width={10} />
            {this.renderPanel()}
            <Grid width={10} />
            <GroupOptions />
        </Grid>
    }
}
