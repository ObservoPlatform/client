import React, { Component } from "react"

export default class MediaWatch extends Component {
    constructor() {
        super()
        this.state = {
            key: 0
        }
        this.breakpoints = {
            mobileSm: 400,
            mobileMd: 540,
            mobileLg: 767,
            tabletSm: 840,
            tabletMd: 991,
            tabletLg: 1040,
            desktopSm: 1200,
            desktopMd: 1300,
            desktopLg: 1400
        };
        this.mediaQueries = {}
        this.mediaEvents = {}
    }
    componentDidMount() {
        for (let key in this.breakpoints) {

            let q = `(max-width: ${this.breakpoints[key]}px)`

            const query = window.matchMedia(q)
            query.breakpoint = this.breakpoints[key]
            query.name = key

            this.mediaEvents[key] = () => {
                console.log("moving")
                this.dispatchActiveQuery(key);
            }
            query.addListener(this.mediaEvents[key].bind(this));

            this.mediaQueries[key] = query
        }

        this.dispatchActiveQuery(null);
        this.resize = window.addEventListener('resize', function (event) {
            this.dispatchActiveQuery(null)
        });

    }
    componentWillUnmount() {
        for (let query in this.mediaQueries) {
            let q = this.mediaQueries[query]
            q.removeListener(this.mediaEvents[query])
        }
      
    }
    /**
     * DispatchActiveQuery - Dispatches an active media query 
     * @param {String} breakpoint 
     */
    dispatchActiveQuery(breakpoint) {
        let breakpoint_ = null
        let width = window.visualViewport.width || 0
        for (let key in this.breakpoints) {
            let value = this.breakpoints[key]
            if (width > value) {
                if (breakpoint == null) {
                    breakpoint_ = key
                } else {
                    breakpoint_ = breakpoint
                }
            }
        }
        //Check break point of the device, if has none, just select one
        if (breakpoint_ == null && width < 400) {
            breakpoint_ = "mobileSm"
        } else if (breakpoint_ == null) {
            breakpoint_ = "desktopLg"
        }
        console.log(breakpoint_)
        console.log(width)
        //Set the breakpoint
        this.setState({ key: breakpoint_ })

    }
    render() {
        let breakpointFromString = (string) => {
            const breakpoint = this.breakpoints[string];

            if (!breakpoint) {
                throw new Error(`Bad breakpoint variable given: ${string}`);
            }
            return breakpoint;
        }
        let methods = {
            setClass: (classes) => {
                for (let c in classes) {
                    if (c == this.state.key) {
                        return classes[c]
                    }
                }
            },
            greaterThan: (breakpointToCompare) => {
                let currentBreakpointSize = this.breakpoints[this.state.key]
                const comparison = typeof breakpointToCompare === 'string'
                    ? breakpointFromString(breakpointToCompare)
                    : breakpointToCompare;
                if (currentBreakpointSize === null || currentBreakpointSize > comparison) return true;
                return false;

            },
            lessThan: (breakpointToCompare) => {
                let currentBreakpointSize = this.breakpoints[this.state.key]
                const comparison = typeof breakpointToCompare === 'string'
                    ? breakpointFromString(breakpointToCompare)
                    : breakpointToCompare;

                if (currentBreakpointSize !== null && currentBreakpointSize <= comparison) return true;
                return false;

            }
        }
        return this.props.children(methods)
    }
}