
import React, { Component } from "react"
import duix from 'duix';
import Grid from 'o-grid';
import Search, { SearchHighlight } from "../dynamic/SearchCustom";


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
 * UserSearch - Searches users on the server and returns them via a prop callback (onSelect)
 * 
 * Duix Requirements:
 * account_uuid <-- UUID of the client right now
 */
export default class UserSearch extends Component {
    constructor() {
        super()
        this.unsub = []
    }
    componentDidMount() {
        this.unsub[0] = duix.subscribe('app/connect', this._onConnect.bind(this), { callMeNow: true });
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
    /**
     * onUserSearch - When a search is going to be triggered. 
     * @param {String} search User being search 
     * @return Array (string) of users
     */
    async onUserSearch(search) {
        //Create a promise as we need to get the infomation via a callback
        return new Promise((resolve) => {
            //Create the event handler to listen for the search from the server
            this.coreSocket.once("users/search", (data) => {
                //Grab the UUID of the CLIENT
                let uuid = duix.get("app/account/uuid")
                let items = [] //All of the users

                //Traverse through the data, and only push users that arent this CLIENT
                for (let item in data) {
                    let user = data[item]
                    if (user.uuid != uuid) {
                        items.push(user)
                    }
                }
                //Resolve it
                resolve(items)
            })
            //Before the event above can trigger, we need to send the search to the server.
            this.coreSocket.emit("users/search", { search })
        })
    }
    /**
     * 
     * @param {Search} search 
     * @param {*} value 
     */
    onSearchRender(search, value) {
        //Highlights the search key word
        let highlightSearch = (term) => {
            let words = term.toLowerCase().split(search.toLowerCase())
            let items = []
            for (let key in words) {
                let word = words[key]
                items.push(word)

                if (key != words.length - 1) {
                    items.push(<SearchHighlight>{search}</SearchHighlight>)
                }
            }
            return items
        }
        //Check if no results have been found (no users)
        if (value.none) {
            //If so, lets render some text accordingly
            let render = () => {
                return "No Results Found"
            }
            //Return it back with a name (doesn't matter) and the render callback
            return [value.username, render()]
        } else {
            //If we do have some users to display, lets do it
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

            //Return it back to the SearchCustom
            return [value.username, render()]
        }

    }
    /**
     * onSelect - When a user gets selected from the <Search /> Component
     * @param {Object} item 
     */
    onSelect(item) {
        if (this.props.onSelect) {
            this.props.onSelect(item)
        }
    }
    render() {
        let style = { width: 300 }
        if (this.props.style) {
            style = { ...style, ...this.props.style }
        }
        return <Search
            className="user-search"
            style={style}
            onSearch={this.onUserSearch.bind(this)}
            onRender={this.onSearchRender.bind(this)}
            onSelect={this.onSelect.bind(this)}
            time={300}
        />
    }
}