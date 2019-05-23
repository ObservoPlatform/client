import React, { Component } from "react"
import Grid from "o-grid"
import { Colors } from "o-constants"
import duix from "duix"
import { Tooltip } from "antd"
import DocTabs from "../../components/dynamic/Doctabs"
export default class Project extends Component {
    constructor() {
        super()
        this.state = {
            tabs: [{ title: "Example" }, {title: "Hello"}],
            selected: "Example"
        }
    }
    componentDidMount() {

    }
    onDocTabChange(tabs, selected) {
        this.setState({ tabs: tabs, removeTab: null })
    }
    onTabClose(name) {
        console.log("CLOSING")
        console.log(name)
        let closeTab = this.state.closeTab
        closeTab[name] = true
        this.setState({ closeTab })
    }
    onSelected(name) {
        this.setState({ selectedTab: name })
    }
    render() {
        let project = "PROJECT"
        return <Grid canvas col>
            <Grid width={70} background="gray">
                <Grid col height={62} background 
                    className="avatar" style={{paddingLeft: 10, 
                    paddingRight: 10, paddingTop: 10}}>
                    <Grid width={48} className="icon">
                        <Tooltip title={project} placement="left">
                            <div className="base center" style={{background: 'red'}}>
                                <p style={{ color: "#fff", fontSize: 22, paddingTop: 2 }}>A</p>
                            </div>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
            <Grid background={Colors.primary} row>
                <Grid height={50}>
                    <DocTabs key="tabs" tabs={this.state.tabs}
                        selected={this.state.selectedTab}
                        remove={this.state.removeTab}
                        onChange={this.onDocTabChange.bind(this)}
                        onSelect={this.onSelected.bind(this)}
                        onClose={this.onTabClose.bind(this)} />


                </Grid>
                <Grid background="lightgray"></Grid>
            </Grid>

        </Grid>
    }
}