import React, { Component } from "react"
import duix from "duix"
import Grid from "o-grid"
import { Icon, Input, Button, Badge, Menu, Dropdown, Tooltip, Modal } from "antd"

export default class GroupPanel extends Component {
    constructor() {
        super()
    }
    render() {
        let name = "Example"
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
                        <Grid row width={100}>
                            <Grid><p style={{ fontSize: 18, color: "white", paddingTop: 5 }}>{name}</p></Grid>
                        </Grid>
                        <Grid />
                        <Grid width={50} style={{ paddingTop: 5 }}>
                            <Button icon="add" />
                        </Grid>
                    </Grid>
                    <Grid row>
                        LIST OF PROJECTS HERE
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    }
}