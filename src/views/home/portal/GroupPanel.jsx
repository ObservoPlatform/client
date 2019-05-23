import React, { Component } from "react"
import duix from "duix"
import Grid from "o-grid"
import { Colors } from "o-constants"

import { Icon, Input, Button, Badge, Menu, Dropdown, Tooltip, Modal } from "antd"

export default class GroupPanel extends Component {
    constructor() {
        super()
        this.unsub = []
        this.state = {
            projects: true,
            groupName: "Example"
        }
    }
    componentDidMount() {
        this.unsub[0] = duix.subscribe('home_groupSelect', this._onGroupSelect.bind(this));
    }
    _onGroupSelect({uuid, name}) {
        this.setState({ groupName: name })
    }
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