import React, { Component } from "react"
import duix from "duix"
import Grid from "o-grid"
import { Colors } from "o-constants"

import { Icon, Input, Button, Badge, Menu, Dropdown, Tooltip, Modal } from "antd"

/**
 * GroupPanel 
 * @author ImportProgram <importprogram.me>
 * @copyright ObservoPlatform 2019
 * 
 * The GroupPanel is the main panel on th home screen portion of Observo when a group is selected.
 * This panel shows loaded projects based on the group selected.
 * 
 * SOCKET:
 *  - NONE
 * DUIX:
 *  - home/groups/select
 */
export default class GroupPanel extends Component {
    constructor() {
        super()
        this.unsub = []
        this.state = {
            projects: true, //Has PROJECTS?
            groupName: "Example" //Name of selected GROUP
        }
    }
    /**
     * componentDidMount - Component Mounted
     */
    componentDidMount() {
        this.unsub[0] = duix.subscribe('home/groups/select', this.onGroupSelect.bind(this));
    }
    /**
     * onGroupSelect - When a group is select
     * @param {String} uuid - User UUID
     * @param {String} name - Group Name
     */
    onGroupSelect({ uuid, name }) {
        this.setState({ groupName: name })
    }
    /**
     * componentWillUnmount - Component Unmounts
     */
    componentWillUnmount() { for (let e in this.unsub) { this.unsub[e](); } }
    renderProjects() {
        if (this.state.projects) {
            return <Grid center v h row>
                <Grid center h><Icon type="loading" style={{ fontSize: '100px', color: Colors.primary }} />

                </Grid>
                <Grid style={{ marginTop: 15 }}>   <h1>Loading Projects...</h1></Grid>
            </Grid>
        }
        return null
    }
    /**
     * render - Main Render Process for React
     */
    render() {
        let name = this.state.groupName
        return <Grid col>
            <Grid col style={{ overflow: "hidden", borderRadius: 10 }} width={700} height={500} background="#a8a8a8">
                <Grid row>
                    <Grid col height={62} className="avatar" background="#191919">
                        <Grid width={48} className="icon">
                            <Tooltip title={name} placement="left">
                                <div className="base center">
                                    <p style={{ color: "#fff", fontSize: 22, paddingTop: 2 }}>{name.charAt(0).toUpperCase()}</p>
                                </div>
                            </Tooltip>
                        </Grid>
                        <Grid row width={200} style={{ paddingLeft: 10 }} >
                            <Grid><p style={{ fontSize: 18, color: "white", paddingTop: 7 }}>{name}</p></Grid>
                        </Grid>
                        <Grid />
                        <Grid width={50} style={{ paddingTop: 7 }}>
                            <Button icon="plus" />
                        </Grid>
                    </Grid>
                    <Grid row>
                        {this.renderProjects()}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    }
}