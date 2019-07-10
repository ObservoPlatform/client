import React, { Component } from "react"
import duix from 'duix';
import { Drawer, List, notification, Icon } from "antd"
import InfiniteScroll from 'react-infinite-scroller';


import Grid from "o-grid"
/**
 * Messenger - Component for Rendering the Messenger Drawer for Conversation
 * @copyright 2019 ImportCore
 * @author Brendan Fuller @ImportProgram
 */
export default class Notification extends Component {
    constructor() {
        super()
        this.unsub = []
        this.state = {
            hasOpened: false,
            openNotifications: false //Is the drawer open?
        }
    }
    componentDidMount() {
        this.unsub[0] = duix.subscribe('all/notifications/open', this._openNotifications.bind(this));
        this.unsub[1] = duix.subscribe('portal/logout', this._onLogout.bind(this));
        this.unsub[2] = duix.subscribe('home_connect', this._onConnect.bind(this));
    }
    _onConnect(socket) {
        this.coreSocket = socket
        let self = this
        this.coreSocket.on("notifications/new", (data) => {
            let title = data.title
            let message = data.message
            let icon = data.icon
            let color = data.color
            notification.open({
                message: title,
                description: message,
                icon: <Icon type={icon} style={{ color }} />,
            })
            //TODO: Update total unread message count to button (when needed)
        })
        this.coreSocket.on("notifications/list", (data) => {
            self.setState({ data })
        })
        this.coreSocket.on("notifications/amount", (amount) => {
            duix.set("all/notifications/amount", amount)
        })
    }
    //Remove all subscriptions when unmounted.
    componentWillUnmount() { for (let e in this.unsub) { this.unsub[e](); } }
    /**
     * openNotifications - Opens the Notifications Drawer
     */
    _openNotifications() {
        //Check if the drawer has already been opened during this session
        this.coreSocket.emit("notifications/list", 1)
        this.setState({ openNotifications: true, hasOpened: true })

    }
    /**
     * onLogout - Event for when the USER logs out of account.
     * 
     *  - Close Drawer AS messages only come in if user is still signed in.
     */
    _onLogout() {
        //Update State
        this.setState({ openNotifications: false })
    }
    /////////////////////
    /**
     * onMessengerClose - Event triggered when the drawer closes
     */
    openNotificationClose() {
        this.setState({ openNotifications: false })
    }
    /////////////////////
    render() {
        return <Drawer
            title="Notifications"
            placement="right"
            closable={true}
            onClose={this.openNotificationClose.bind(this)}
            visible={this.state.openNotifications}
            width={500}
        >
            <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={!this.state.loading && this.state.hasMore}
                useWindow={false}
            >
                <List
                    dataSource={this.state.data}
                    renderItem={item => (
                        <List.Item key={item.id}>
                            <Grid col>
                                <Grid width={50} style={{ paddingTop: 20 }}>
                                    <Icon type={item.icon} style={{ fontSize: 25, color: item.color ? item.color : "black"}} />
                                </Grid>
                                <Grid row>
                                    <Grid style={{ fontWeight: "bold", fontSize: 20 }}>{item.title}</Grid>
                                    <Grid style={{ paddingTop: 5}}>{item.message}</Grid>
                                </Grid>
                            </Grid>
                        </List.Item>
                    )}
                >
                    {this.state.loading && this.state.hasMore && (
                        <div className="demo-loading-container">
                            <Spin />
                        </div>
                    )}
                </List>
            </InfiniteScroll>
        </Drawer>
    }
}