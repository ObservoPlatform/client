import React, { Component } from "react"
import duix from "duix"
import Grid from "o-grid"
import { Tooltip, Icon } from "antd"


import homeIcon from "../../../assets/home.png"
import CreateGroup from "./CreateGroup"

/**
 * GroupSidebar
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
    componentDidMount() {
        this.unsub[0] = duix.subscribe('home_connect', this._onConnect.bind(this));
        this.unsub[1] = duix.subscribe('account_valid', this._onAuth.bind(this));
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
        this.coreSocket.on("groups_list", (data) => {
            let groups = true ? data.groups : null
            console.log(groups)
            this.setState({ groups })
        })
        this.coreSocket.emit("groups_list")
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
        this.setState({selected: "home"})
    }
    /**
     * onGroupSelect - Selection of a group in the left sidebar
     * @param {String} uuid 
     */
    _onGroupSelect(uuid) {
       
        if (this.props.onGroupSelect) {
            this.props.onGroupSelect(uuid)
        }
        this.setState({selected: uuid})
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    renderCreateGroup() {
        return <CreateGroup visible={this.state.modal_createGroup} onClose={this._closeCreateGroup.bind(this)} />
    }
    renderGroupItem(name, uuid) {
        let background = "black"
        if (uuid == this.state.selected) {
            background = "#17c2ed"
        }
        return <Grid key={name} className="avatar" background="a8a8a8" height={62} style={{ padding: 5 }}>
            <Grid width={48} className="icon" onClick={this._onGroupSelect.bind(this, uuid)}>
                <Tooltip title={name} placement="left">
                    <div className="base center" style={{background}}>
                        <p style={{ color: "#fff", fontSize: 22, paddingTop: 2 }}>{name.charAt(0).toUpperCase()}</p>
                    </div>
                </Tooltip>
            </Grid>
        </Grid>
    }
    renderGroups() {
        let items = []
        for (let group in this.state.groups) {
            let uuid = this.state.groups[group]
            items.push(this.renderGroupItem(group, uuid))
        }
        return items
    }
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
                <Grid width={48}className="icon" onClick={this._onHomeSelect.bind(this)}>
                    <Tooltip title="Home" placement="left">
                    <div className="base" style={{ background }}>
                            <p style={{ color: "#fff" }}><Icon type="home" style={{ fontSize: 20, padding: 11, color: "white" }}></Icon></p>
                        </div>
                    </Tooltip>
                </Grid>
            </Grid>

            {this.renderGroups()}

            <Grid className="avatar" background="a8a8a8" style={{ padding: 5, paddingTop: 2 }}>
                <Grid width={48} className="icon" onClick={this._showCreateGroup.bind(this)}>
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