import React, { Component } from "react"
import duix from 'duix';
import { Icon, Input, Button, Badge, Menu, Dropdown, Tooltip, Modal, Steps } from "antd"

import Grid from 'o-grid';
import StepModal from "../../../components/dynamic/StepModal";
import Search, { SearchHighlight } from "../../../components/dynamic/SearchCustom";
import SearchChecker from "../../../components/dynamic/SearchChecker";



//Gets the USERS Icon
let userIcon = (uuid) => {
    //Get the IP of the client (server connected tp)
    let ip = duix.get("ip")
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
 * Portal - The main area for creating groups, creating/opening projects and some settings.
 * @copyright 2019 ImportCore
 * @author Brendan Fuller @ImportProgram
 */
export default class CreateGroup extends Component {
    constructor() {
        super()
        this.unsub = [];
        this.state = {
            current: 1,
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
    componentDidMount() {
        this.unsub[0] = duix.subscribe('home_connect', this._onConnect.bind(this));

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
    onNext() {
        if (this.state.steps.length > this.state.current) {
            let current = this.state.current + 1
            this.setState({ current })
        }
    }
    onBack() {
        if (this.state.current > 1) {
            let current = this.state.current - 1
            this.setState({ current })
            if (current == 1) {
                this.setState({ stepCreate_isGroup: false })
            }
        }

    }
    ////////////////////////////
    stepCreate() {
        if (this.state.current == 1) {
            return <Grid height={50} center h style={{ margin: 30 }}>
                <Grid style={{ textAlign: "center" }}><h1>Name Group</h1></Grid>
                <Grid width={300}>
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
                        <Search
                            style={{ width: 300 }}
                            onSearch={this.stepInvite_onUserSearch.bind(this)}
                            onRender={this.stepInvite_onSearchRender.bind(this)}
                            onSelect={this.stepInvite_onSelect.bind(this)}
                            time={300}
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
    async stepInvite_onUserSearch(search) {
        return new Promise((resolve) => {
            this.coreSocket.once("users/search", (data) => {
                let uuid = duix.get("account_uuid")
                let items = []
                console.log(data)
                for (let item in data) {
                    let user = data[item]
                    if (user.uuid != uuid) {
                        console.log(user)
                        items.push(user)
                    }
                }

                resolve(items)
            })
            this.coreSocket.emit("users/search", { search })
        })
    }
    stepInvite_onSearchRender(search, value) {

        //Highlights the search key word
        let highlightSearch = (term) => {
            let words = term.toLowerCase().split(search.toLowerCase())
            let items = []
            console.log(words)
            for (let key in words) {
                let word = words[key]
                items.push(word)

                if (key != words.length - 1) {
                    items.push(<SearchHighlight>{search}</SearchHighlight>)
                }
            }
            return items
        }

        if (value.none) {
            let render = () => {
                return "No Results Found"
            }
            return [value.username, render()]
        } else {

            let render = () => {
                return <Grid col>
                    <Grid width={50}>
                        {userIcon(value.uuid)}
                    </Grid>
                    <Grid>
                        {highlightSearch(value.username)}
                    </Grid>
                </Grid>
            }
            return [value.username, render()]
        }

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
        this.coreSocket.emit("group/create", {name: this.state.stepCreate_value, members })
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

