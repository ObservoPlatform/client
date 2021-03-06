import React, { Component } from "react"
import duix from 'duix';
import { Button } from "antd"

import Grid from 'o-grid';
import StepModal from "../../../components/dynamic/StepModal";
import SearchChecker from "../../../components/dynamic/SearchChecker";
import UserSearch from "../../../components/inputs/UserSearch";

//Gets the USERS Icon
let userIcon = (uuid) => {
    //Get the IP of the client (server connected tp)
    let ip = duix.get("app/address")
    let iconSVG = null
    //Is valid?
    if (ip != null) {
        iconSVG = `http://${ip}/users/icons/${uuid}`
    }
    //Fetch icon using REST API
    if (iconSVG != null) {
        return <Grid width={50} className="icon">
            <div className="head-example" >
                <img src={iconSVG} style={{ height: 42, width: 42 }} />
            </div>
        </Grid>
    } else {
        return <Grid width={50} className="icon">
            <div className="head-example">
                ?
         </div>
        </Grid>
    }

}

/**
 * CreateGroup [modal]
 * @author ImportProgram <importprogram.me>
 * @copyright ObservoPlatform 2019
 * 
 * The CreateGroup is the modal which is used to populate information to create a group
 * It has a step system, where defined amount of steps are needed to continue (interactive)
 * 
 * SOCKET:
 *  - users/search #EMIT
 *  - groups/checker #EVENT #EMIT
 *  - groups/create #EMIT
 * 
 * DUIX:
 *  - app/connect #EVENT
 *  - app/account/uuid #GET
 * 
 */
export default class CreateGroup extends Component {
    constructor() {
        super()
        this.unsub = [];
        this.state = {
            current: 1, //Current Step
            steps: [
                { title: "Name", icon: "user" },
                { title: "Invite", icon: "usergroup-add" },
                { title: "Create", icon: "rocket" },
            ],
            stepCreate_isGroup: false,

            stepCreate_invited: {},
            stepCreate_value: "",
            stepCreate_valueTemp: ""
        }
    }
    /**
     * componentDidMount - Component Mounted
     */
    componentDidMount() {
        this.unsub[0] = duix.subscribe('app/connect', this._onConnect.bind(this));
    }
    componentWillUnmount() { for (let e in this.unsub) { this.unsub[e](); } }
    //////////////////////////////////
    /**
     * onConnect - When the CLIENT connects to the socket server. 
     * @param {Object} client 
     */
    _onConnect(client) {
        //Reference the Socket
        this.coreSocket = client
    }
    /////////////////////////////////
    /**
     * onNext - Event for going to the next step
     */
    onNext() {
        if (this.state.steps.length > this.state.current) {
            let current = this.state.current + 1
            this.setState({ current })
        }
    }
    /**
     * onNext - Event for going to the previous step
     */
    onBack() {
        //Check if the state is at least greater than 1 (as 1 is default)
        if (this.state.current > 1) {
            //Find the current step
            let current = this.state.current - 1
            //Update the current step
            this.setState({ current })
            //Check if the current is 1, if so, its not a group
            if (current == 1) {
                this.setState({ stepCreate_isGroup: false })
            }
        }

    }
    ////////////////////////////
    stepCreate() {
        if (this.state.current == 1) {
            return <Grid v center h style={{ margin: 30, marginTop: -30 }}>
                <Grid style={{ textAlign: "center" }}><h1>Name Group</h1></Grid>
                <Grid width={300} height={15}>
                    <SearchChecker
                        value={this.state.stepCreate_value}
                        placeholder="Enter Group Name"
                        onValidate={this.stepCreate_onValidate.bind(this)}
                        onChange={this.stepCreate_groupOnInput.bind(this)}
                        style={{ width: 400 }}
                        time={500} />
                </Grid>
            </Grid>
        }
        return null
    }
    /**
     * STEP CREATE: onValidate - Validates the Group the user has submitted with the server
     * @param {String} search 
     */
    stepCreate_onValidate(search) {
        return new Promise((resolve) => {
            this.coreSocket.once("groups/checker", (data) => {
                if (data.isGroup != undefined) {
                    this.setState({ stepCreate_isGroup: data.isGroup })
                    resolve(data.isGroup)
                }
            })
            this.coreSocket.emit("groups/checker", { search })
        })
    }
    /**
     * STEP CREATE: groupOnInput - When the user inputs, disable the button via isGroup
     * @param {String} search 
     */
    stepCreate_groupOnInput(event) {
        this.setState({ stepCreate_isGroup: false, stepCreate_value: event.currentTarget.value })
    }
    /////////////////
    renderInvited(remove) {
        //Get the invited people to the group
        let items = []

        //Loop all invited (from state)
        for (let key in this.state.stepCreate_invited) {
            //Get the username
            let username = this.state.stepCreate_invited[key]
            //Create a function to remove the user when clicekd
            let removeUser = () => {
                let invited = this.state.stepCreate_invited
                delete invited[key]
                this.setState({ stepCreate_invited: invited })
            }
            //Now push all of the outline for the invited into an array
            let useRemove = <Grid width={50} style={{ padding: 10 }}>
                <Button onClick={removeUser} type="danger" shape="circle" icon="cross" size="small" />
            </Grid>
            if (remove == false) {
                useRemove = null
            }
            items.push(<Grid col height={60}>
                <Grid width={50}>
                    {userIcon(key)}
                </Grid>
                <Grid style={{ paddingTop: 10 }}>
                    {username}
                </Grid>
                {useRemove}
            </Grid>)
        }
        //If the array is empty, display a message
        if (items.length == 0) {
            items.push(<Grid col height={60}>
                <Grid style={{ paddingTop: 10, textAlign: "center" }}>
                    <p style={{ color: "gray" }}> No Users Invited Yet :(</p>
                </Grid>
            </Grid>)
        }
        //Return the array of invited people (or not)
        return items
    }
    stepInvite() {
        if (this.state.current == 2) {
            //Return the main render for the INVITE Step
            return <Grid style={{ margin: 30 }} row>
                <Grid col>
                    <Grid row width={300} style={{ marginRight: 10 }}>
                        <Grid col height={50}>
                            <Grid width={180}><span style={{ fontSize: 24, fontWeight: "bold" }}> Invite Users</span></Grid>
                            <Grid width={180}> Add select users by searching for them!</Grid>
                        </Grid>
                        <UserSearch
                            style={{ width: 300 }}
                            onSelect={this.stepInvite_onSelect.bind(this)}

                        />
                    </Grid>
                    <Grid style={{ borderRight: "3px solid lightgray" }} />
                    <Grid row style={{ marginLeft: 10 }}>
                        <Grid className="scrollY" row height={270} width={320} style={{ overflowY: 'auto', overflow: "overlay" }}>
                            {this.renderInvited(true)}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        }

        return null
    }
    /**
     * STEP INVITE: onSelect When a user gets selected from the <Search /> Component
     * @param {Object} item 
     */
    stepInvite_onSelect(item) {
        let uuid = item.uuid //Get the UUID 
        let username = item.username //Name
        //Check and see if the user isn't already in the list
        if (this.state.stepCreate_invited[uuid] == null && item.none == null) {
            //Add them
            let invited = this.state.stepCreate_invited
            invited[uuid] = username
            this.setState({ stepCreate_invited: invited })
        }
    }
    stepCreate_create() {
        let members = []
        for (let uuid in this.state.stepCreate_invited) {
            members.push(uuid)
        }
        console.log(members)
        this.coreSocket.emit("groups/create", { name: this.state.stepCreate_value, members })
        this.onClose()
    }
    // ???
    stepLaunch() {
        if (this.state.current == 3) {
            //Return the main render for the INVITE Step
            return <Grid style={{ margin: 30 }} row>
                <Grid col>
                    <Grid row style={{ marginRight: 10 }}>
                        <Grid center h v style={{ textAlign: "center" }}><h1>{this.state.stepCreate_value}</h1></Grid>
                        <Grid center h v><Button onClick={this.stepCreate_create.bind(this)} style={{ fontSize: 30, fontWeight: "bold", height: 70 }} type="primary">Create</Button></Grid>
                    </Grid>
                    <Grid width={10} style={{ borderRight: "3px solid lightgray" }} />
                    <Grid row style={{ marginLeft: 10 }} width={150}>

                        <Grid className="scrollY" row height={270} width={150} style={{ overflowY: 'auto', overflow: "overlay" }}>
                            {this.renderInvited(false)}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        }
        return null
    }
    onClose() {
        if (this.props.onClose) {
            this.props.onClose()
        }
        setTimeout(() => {
            this.setState({
                current: 1,

                stepCreate_invited: []
            })
        }, 200)
    }
    //////////////////////////
    render() {
        return <StepModal
            steps={this.state.steps}
            visible={this.props.visible}
            onClose={this.onClose.bind(this)}
            onNext={this.onNext.bind(this)}
            onBack={this.onBack.bind(this)}
            nextDisabled={!this.state.stepCreate_isGroup}
            current={this.state.current}
            title="New Group"
            text={["Cancel", "Next"]}
        >
            {this.stepCreate()}
            {this.stepInvite()}
            {this.stepLaunch()}
        </StepModal>
    }
}
//cafebrustella

