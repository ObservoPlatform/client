import React, { Component } from "react"
import duix from 'duix';
import { Drawer, List, notification, Icon, Spin } from "antd"
import InfiniteScroll from 'react-infinite-scroller';
import TimeAgo from "react-timeago"
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
            height: 0,
            lastNotification: "",
            loading: false,
            hasMore: true,
            list: [],
            page: 1,
            openNotifications: false //Is the Notification Drawer open?
        }
    }
    componentDidMount() {
        this.unsub[0] = duix.subscribe('app/connect', this._onConnect.bind(this));
        this.unsub[1] = duix.subscribe('app/logout', this._onLogout.bind(this));
        this.unsub[2] = duix.subscribe('app/notifications/open', this._openNotifications.bind(this));
        let self = this
        let w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0]

        window.addEventListener('resize', function (event) {
            self.setState({ height: (w.innerHeight || e.clientHeight || g.clientHeight) - 50 })
        });
        let height = (w.innerHeight || e.clientHeight || g.clientHeight) - 50
        console.log(height)
        this.setState({ height })
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
        this.coreSocket.on("notifications/push", (data) => {

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
            let messageBase = [{
                title,
                message,
                icon,
                color,
                meta: {
                    created: Date.now()
                }
            }]
            let list = this.state.list
            list = [...messageBase, ...list]
            this.setState({ list })
            //TODO: Update total unread message count to button (when needed)
        })
        //List of notifications is sent to the client
        this.coreSocket.on("notifications/list", (data) => {
            let notifications = data.notifications ? data.notifications : {}
            let page = data.page ? data.page : 0
            let list = this.state.list
            list = [...list, ...notifications]
            let lastNotification = list[list.length - 1]
            let hasMore = notifications.length >= 15
            //console.log(lastNotification)
            if (lastNotification.id != this.state.lastNotification) {
                self.setState({ list, page, loading: false, hasMore, lastNotification: lastNotification.id })
            } else {
                self.setState({ loading: false, hasMore })
            }

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
        this.setState({ openNotifications: true, hasOpened: true })
        //this.coreSocket.emit("notifications/list", null)
    }
    /**
     * onLogout - Event for when the USER logs out of account.
     * 
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
    handleInfiniteOnLoad() {
        if (this.state.loading) {
            return
        }
        if (this.state.hasMore == false) {
            console.log("????")
            return
        }
        this.coreSocket.emit("notifications/list", this.state.lastNotification)
        this.setState({ loading: true })
        console.log("HANDLING INFINITE")
        console.log(this.state.lastNotification)

    }
    /////////////////////
    render() {
        return <Drawer
            title="Notifications"
            placement="right"
            closable={true}
            pageStart={0}
            onClose={this.openNotificationClose.bind(this)}
            visible={this.state.openNotifications}
            width={500}
            bodyStyle={{ height: this.state.height }}

            className="notifications"
        >
            <div className="sidebar" style={{ overflow: "auto", height: "100%" }} ref={(ref) => this.scrollParentRef = ref}>

                <InfiniteScroll
                    threshold={1}
                    initialLoad={true}
                    loadMore={this.handleInfiniteOnLoad.bind(this)}
                    hasMore={!this.state.loading && this.state.hasMore}
                    loader={<div className="loader" key={0}><Spin /></div>}
                    useWindow={false}
                    getScrollParent={() => this.scrollParentRef}

                >

                    <List
                        className="sidebar"
                        dataSource={this.state.list}
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
                                    <Grid>
                                        
                                        <TimeAgo live={this.state.openNotifications} date={item.meta.created} />
                                    </Grid>
                                </Grid>
                            </List.Item>
                        )}
                    > </List>
                </InfiniteScroll>
            </div>
        </Drawer>
    }
}