import React, { Component } from "react"
import duix from 'duix';

import Grid from 'o-grid';

import Observo from "../../components/Title"

//Import all the VISUAL STATES
import Fixed from "./Fixed"
import Loading from "./Loading"
import Account from "./Account"
import Portal from "./Portal"
import Messenger from "./Messenger"

/**
 * Home - The Home Screen is where all signin, group management and project selection occurs.
 * 
 * @copyright 2019 ImportCore
 * @author Brendan Fuller @ImportProgram
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
        this.unsub[0] = duix.subscribe('home_setTop', this._setTopSpacing.bind(this));

        this.unsub[1] = duix.subscribe('portal_logout', () => {
            this._setTopSpacing(this.defaultTop)
        });
    }
    componentWillUnmount() { for (let e in this.unsub) { this.unsub[e](); } }
    /////////////////////
    /**
    * setTopPadding - Sets the padding (via state) which re renders the amount of pixels
    *                 the Home screen is showing. This is animated.
    * @param {String} top
    */
    _setTopSpacing(top) {
        this.setState({ top })
    }
    /////////////////////
    render() {
        let top = this.state.top
        if (this.props.media.greaterThan("desktopMd")) {
            top = top - 50
        }
        return <Grid canvas col>
            <Grid background="gray" row center v style={{ overflowY: "" }} className="home">
                <Fixed media={this.props.media} state={this.props.state} />
                <Grid row width="100%" style={{ transform: `translate3d(0px , ${top}px, 0px)` }} className="area">
                    <Observo />
                    <Loading state={this.props.state} />
                    <Account state={this.props.state} />
                    <Portal state={this.props.state} />
                    <Messenger state={this.props.state} />
                </Grid>
            </Grid>
        </Grid>
    }
} 