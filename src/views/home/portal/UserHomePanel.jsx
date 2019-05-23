
import React, { Component } from "react"
import duix from "duix"
import { Icon, Input, Button, Badge, Menu, Dropdown, Tooltip, Modal } from "antd"
import Grid from "o-grid"

export default class UserHomePanel extends Component {
    constructor() {
        super()
    }
    render() {
        let iconSVG = null
        let ip = duix.get("ip")
        if (ip != null) {
            iconSVG = `http://${ip}/users/icons/${this.props.uuid}`
        }
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <Badge status="success" /> Online
                </Menu.Item>
                <Menu.Item key="1">
                    <Badge status="warning" /> Away
                </Menu.Item>
                <Menu.Item key="1">
                    <Badge status="error" /> Do Not Disturb
                </Menu.Item>
            </Menu>
        );
        return <Grid col>
            <Grid col style={{ overflow: "hidden", borderRadius: 10 }} width={700} height={500} background="#a8a8a8">
                <Grid row>
                    <Grid col height={62} className="avatar" background="#191919">
                        <Grid width={50} className="icon" style={{ margin: 3 }}>
                            <Dropdown overlay={menu} trigger={['contextMenu']}>
                                <Badge status="success" >
                                    <div className="head-example" style={{ background: "cyan" }}>
                                        <img src={iconSVG} style={{ height: 42, width: 42 }} />
                                    </div>
                                </Badge>
                            </Dropdown>
                        </Grid>
                        <Grid row width={100} style={{paddingLeft: 4}} >
                            <Grid><p style={{ fontSize: 18, color: "white", paddingTop: 8 }}>{this.props.username}</p></Grid>
                        </Grid>
                    </Grid>
                    <Grid row>

                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    }
}