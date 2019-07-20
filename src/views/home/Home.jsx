import React, { Component } from "react"
import duix from 'duix';

import Grid from 'o-grid';

//Import the Main Title
import Observo from "../../components/Title"

//Import all the VISUAL STATES
import Fixed from "./Fixed"
import Loading from "./Loading"
import Account from "./Account"
import Portal from "./Portal"


/**
 * Home
 * @author ImportProgram <importprogram.me>
 * @copyright ObservoPlatform 2019
 * 
 * The Home is the default view for Observo, which includes
 *  - FIXED - Some fixed buttons for the Home Screen (logging out) [only showed when logged in]
 *  - ACCOUNT - Login screen basically
 *  - PORTAL - PROJECT and GROUP managing screen
 *  - OBSERVO - Title for the Default Home Screen
 * 
 * 
 * SOCKET:
 *  - NONE
 * DUIX:
 *  - home/style/top #EVENT
 *  - app/logout #EVENT
 */
export default class Home extends Component {
    constructor() {
        super()
        this.unsub = [];
        this.defaultTop = 200 //Default amount of pixels for the padding
        this.state = {
            top: this.defaultTop //Set the top to the defult
        }
    }
    componentDidMount() {
        this.unsub[0] = duix.subscribe('home/style/top', this._setTopSpacing.bind(this));
        this.unsub[1] = duix.subscribe('app/logout', () => {
            this._setTopSpacing(this.defaultTop) //When Logout Occurs, we need to reset the spacing to default
        });
    }
    componentWillUnmount() { for (let e in this.unsub) { this.unsub[e](); } }

    /**
     * setTopPadding 
     * 
     * Sets the padding (via state) which re renders the amount of 
     * pixels the Home screen is showing. This is animated.
     * @param {String} top
     */
    _setTopSpacing(top) {
        this.setState({ top })
    }
    /////////////////////
    render() {
        //Apply the top style to the elements. Check using MediaQuery (found in App passed down by props)
        let top = this.state.top
        if (this.props.media.greaterThan("desktopMd")) {
            top = top - 50
        }
        return <Grid canvas col>
            <Grid  row center h className="home">
                <Fixed media={this.props.media} state={this.props.state} />
                <Grid row width="100%" style={{ transform: `translate3d(0px , ${top}px, 0px)` }} className="area" height={300}>
                    <Observo />
                    <Loading state={this.props.state} />
                    <Account state={this.props.state} />
                    <Portal state={this.props.state} />
                </Grid>
            </Grid>
        </Grid>
    }
} 