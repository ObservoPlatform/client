import React, { Component } from "react"
import duix from 'duix';
import { Icon, Input, Button, Badge, Menu, Dropdown, Tooltip, Modal } from "antd"

import Grid from 'o-grid';

import GroupSidebar from "./portal/GroupSidebar"
import UserHomePanel from "./portal/UserHomePanel"
import GroupPanel from "./portal/GroupPanel"


import UserSearch from "../../components/inputs/UserSearch"


/**
 * Portal - The main area for creating groups, creating/opening projects and some settings.
 * @copyright 2019 ImportCore
 * @author Brendan Fuller @ImportProgram
 */
export default class Portal extends Component {
    constructor() {
        super()
        this.unsub = [];
        this.state = {
            username: "master",
            uuid: null,

            panelState: "home",
            groupUUID: "",
            groupName: "Jello",

            sidebarRightPopout: false,

            projects: []

        }
    }
    componentDidMount() {
        this.unsub[0] = duix.subscribe('home_connect', this._onConnect.bind(this));
        this.unsub[1] = duix.subscribe('account_username', this._onSetUsername.bind(this));
        this.unsub[2] = duix.subscribe('account_uuid', this._onSetUUID.bind(this));

    }
    componentWillUnmount() { for (let e in this.unsub) { this.unsub[e](); } }
    /////////////////////
    /**
     * onConnect - When the CLIENT connects to the socket server. 
     * @param {Object} client 
     */
    _onConnect(client) {
        this.coreSocket = client
        this.coreSocket.on("group_projects", () => {
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
        //TODO: Uncomment
        //this.setState({ username })
    }
    /**
     * onSetUUID - Sets the uuid of the current user.
     * @param {String} uuid 
     */
    _onSetUUID(uuid) {
        this.setState({ uuid })
    }
    /**
     * showPopoutSidebar - Shows sidebar from rights side (?)
     */
    _showPopoutSidebar() {
        if (this.state.sidebarRightPopout) {
            this.setState({ sidebarRightPopout: false })
        } else {
            this.setState({ sidebarRightPopout: true })
        }
    }
    _showInviteSidebar() {
        this._showPopoutSidebar(true)
    }

    _onUserHomeSelect() {
        this.setState({ panelState: "home" })
    }
    /////////////////////
    renderGroupSidebar() {
        return <GroupSidebar
            onHomeSelect={this._onUserHomeSelect.bind(this)}
            onGroupSelect={(uuid) => { this.setState({ panelState: uuid, projects: [] }) }}
        />
    }
    renderButtonSidebar() {
        return <Grid row style={{ borderRadius: 10, padding: 8 }} width={50} height={130} background="a8a8a8">
            <Grid height={40}>
                <Tooltip title="Settings" placement="right" overlayClassName="xxxxxx">
                    <Button shape="round" icon="setting"></Button>
                </Tooltip>
            </Grid>
            <Grid height={40}>
                <Tooltip title="Users" placement="right" overlayClassName="xxxxxx">
                    <Button shape="round" icon="user" onClick={this._showInviteSidebar.bind(this)}></Button>
                </Tooltip>
            </Grid>
            <Grid height={40}>
                <Tooltip title="Roles" placement="right" overlayClassName="xxxxxx">
                    <Button disabled shape="round" icon="solution"></Button>
                </Tooltip>
            </Grid>
        </Grid>
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
    /**
     * inviteUsers - Sidebar panel where you can invite users to a GROUP
     */
    renderInviteUsers() {
        let style = { width: 0 }
        if (this.state.sidebarRightPopout) {
            style = { width: 300 }
        }
        return <Grid col style={style} height={500} className="sidebar-right-popout" background="#a8a8a8">
            <Grid row>
                <Grid col height={62} background="#191919">
                    <Grid><p style={{ fontSize: 24, color: "white", paddingTop: 5 }}>Users</p></Grid>
                </Grid>
                <Grid row style={{ padding: 5 }}>
                    <UserSearch style={{ width: "100%" }} />
                </Grid>
            </Grid>
        </Grid>

    }
    renderPanel() {
        if (this.state.panelState == "home") {
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
            {this.renderButtonSidebar()}
            {this.renderInviteUsers()}
        </Grid>
    }
}
