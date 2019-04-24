import React, { Component } from "react" //React itself
import { Icon } from "antd" //Ant Design, simple yet amazing

//Convert to @importcore libraries on NPM
import Grid from 'o-grid';
import { Colors } from "o-constants"

/**
 * 
 */
export default class Loading extends Component {
    render() {
        if (this.props.state == "LOADING") {
            return <Grid height={200} style={{ textAlign: "center" }}>
                <Icon type="loading" style={{ fontSize: '200px', color: Colors.primary }} />
            </Grid>
        }
        return null
    }
}