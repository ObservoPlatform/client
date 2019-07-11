import React, { Component } from "react"
import duix from "duix"
import Grid from "o-grid"
import { Tooltip, Icon } from "antd"


import homeIcon from "../../../assets/home.png"
import CreateGroup from "./CreateGroup"

/**
 * GroupSidebar
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
 *  - app/account/valid
 *  - home/group/select
 * 
 */
export default class GroupSidebar extends Component {
    constructor() {
        super()
        this.unsub = []
        this.state = {
            modal_createGroup: false,
            selected: "home"
        }
    }
    /**
     * componentDidMount - Component Mounted
     */
    componentDidMount() {
        this.unsub[0] = duix.subscribe('app/connect', this._onConnect.bind(this));
        this.unsub[1] = duix.subscribe('app/account/valid', this._onAuth.bind(this));
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
    _onAuth() {
        this.coreSocket.on("groups/list", (data) => {
            let groups = true ? data.groups : null
            console.log(groups)
            this.setState({ groups })
        })
        this.coreSocket.emit("groups/list")
    }
    _showCreateGroup() {
        this.setState({ modal_createGroup: true })
    }
    _closeCreateGroup() {
        this.setState({ modal_createGroup: false })
    }
    /**
     * onHomeSelect - Selection of the "home button" in the left sidebar
     */
    _onHomeSelect() {
        if (this.props.onHomeSelect && typeof this.props.onHomeSelect == 'function') {
            this.props.onHomeSelect()
        }
        this.setState({ selected: "home" })
    }
    /**
     * onGroupSelect - Selection of a group in the left sidebar
     * @param {String} uuid 
     */
    _onGroupSelect(name, uuid) {

        if (this.props.onGroupSelect) {
            this.props.onGroupSelect(uuid)
        }
        this.setState({ selected: uuid })
        this.coreSocket.emit("groups/select", { uuid })
        duix.set("home/groups/select", { uuid, name })
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * renderCreateGroup - Render the MODAL to create a group
     */
    renderCreateGroup() {
        return <CreateGroup visible={this.state.modal_createGroup} onClose={this._closeCreateGroup.bind(this)} />
    }
    /**
     * renderGroupItem - Renders a single item of a group
     * @param {String} name - Name of Group 
     * @param {String} uuid  - UUID of Group
     */
    renderGroupItem(name, uuid) {
        let background = "black"
        if (uuid == this.state.selected) {
            background = "#17c2ed"
        }
        return <Grid key={name} className="avatar" background="a8a8a8" height={62} style={{ padding: 5 }}>
            <Grid width={48} className="icon" onClick={this._onGroupSelect.bind(this, name, uuid)}>
                <Tooltip title={name} placement="left">
                    <div className="base center" style={{ background }}>
                        <p style={{ color: "#fff", fontSize: 22, paddingTop: 2 }}>{name.charAt(0).toUpperCase()}</p>
                    </div>
                </Tooltip>
            </Grid>
        </Grid>
    }
    /**
     * renderGroups - Renders the groups given from the server
     * TODO: Example of group object
     */
    renderGroups() {
        let items = []
        for (let group in this.state.groups) {
            let uuid = this.state.groups[group]
            items.push(this.renderGroupItem(group, uuid))
        }
        return items
    }
    /**
     * render - Main Render Process for React
     */
    render() {
        let iconSVG = null
        let ip = duix.get("ip")
        if (ip != null) {
            iconSVG = `http://${ip}/users/icons/${this.state.uuid}`
        }
        let background = "lightgray"
        if ("home" == this.state.selected) {
            background = "#17c2ed"
        }
        return <Grid row width={60} height={500} style={{ overflow: "hidden", borderRadius: 10 }} className="portal">
            {this.renderCreateGroup()}
            <Grid row height={62} className="avatar" background="#191919">
                <Grid width={48} className="icon" onClick={this._onHomeSelect.bind(this)}>
                    <Tooltip title="Home" placement="left">
                        <div className="base" style={{ background }}>
                            <p style={{ color: "#fff" }}><Icon type="home" style={{ fontSize: 20, padding: 11, color: "white" }}></Icon></p>
                        </div>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid row scrollY width={62} background="a8a8a8" className="group-sidebar" height={380}>
                {this.renderGroups()}
            </Grid>
            <Grid className="avatar" background="a8a8a8" style={{ padding: 5 }}>
                <Grid width={48} className="icon" onClick={this._showCreateGroup.bind(this)} >
                    <Tooltip title="Create Group" placement="left">
                        <div className="base" style={{ background: "black" }}>
                            <p style={{ color: "#fff" }}><Icon type="plus" style={{ fontSize: 20, padding: 11, color: "white" }}></Icon></p>
                        </div>
                    </Tooltip>
                </Grid>
            </Grid>
        </Grid>
    }
}