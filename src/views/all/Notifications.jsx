import React, { Component } from "react"
import duix from 'duix';
import { Drawer, List, notification, Icon } from "antd"
import InfiniteScroll from 'react-infinite-scroller';


import Grid from "o-grid"
/**
 * Notifications
 * @author ImportProgram <importprogram.me>
 * @copyright ObservoPlatform 2019
 * 
 * Notifications are used for sending reminders/general notices
 * to the user. This is used as a way to tell the user something
 * has happened (either in a good way). Some notifications are store 
 * (mostly all, but some are not).
 * 
 * The stored notifications will appear in the Notification Drawer (render here)
 * 
 * TODO: Work on the infinite scroll
 * 
 * SOCKET:
 *  - notifications/amount #EVENT
 *  - notifications/new #EVENT
 *  - notifications/list #EVENT
 * DUIX:
 *  - app/connect #EVENT
 *  - app/logout #EVENT 
 *  - app/notifications/open #EVENT
 *  - app/notifications/amount #SET
 */
export default class Notification extends Component {
    constructor() {
        super()
        this.unsub = []
        this.state = {
            openNotifications: false //Is the Notification Drawer open?
        }
    }
    componentDidMount() {
        this.unsub[0] = duix.subscribe('app/connect', this._onConnect.bind(this));
        this.unsub[1] = duix.subscribe('app/logout', this._onLogout.bind(this));
        this.unsub[2] = duix.subscribe('app/notifications/open', this._openNotifications.bind(this));
    }
    /**
     * onConnect - When the CLIENT connects to the socket server.
     * @param {Object} client
     */
    _onConnect(socket) {
        //Reference the Socket
        this.coreSocket = socket
        let self = this
        //When a new notification arrvies
        this.coreSocket.on("notifications/new", (data) => {
            alert("NEW")
            //Grab the data from the server. Also give some default values if no value is passed down
            let title = data.title ? data.title : "Notification"
            let message = data.message ? data.message : "Message"
            let icon = data.icon ? data.icon : "bell"
            let color = data.color ? data.color : "black"

            //Now open the notification
            notification.open({
                message: title,
                description: message,
                icon: <Icon type={icon} style={{ color }} />,
            })
            //TODO: Update total unread message count to button (when needed)
        })
        //List of notifications is sent to the client
        this.coreSocket.on("notifications/list", (data) => {
            self.setState({ data })
        })
        //Amount of notifications (unread) the user has
        this.coreSocket.on("notifications/amount", (amount) => {
            duix.set("app/notifications/amount", amount)
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
                                    <Icon type={item.icon} style={{ fontSize: 25, color: item.color ? item.color : "black" }} />
                                </Grid>
                                <Grid row>
                                    <Grid style={{ fontWeight: "bold", fontSize: 20 }}>{item.title}</Grid>
                                    <Grid style={{ paddingTop: 5 }}>{item.message}</Grid>
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