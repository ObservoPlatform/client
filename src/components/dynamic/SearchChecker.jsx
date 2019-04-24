import React, { Component } from "react"
import duix from 'duix';
import { Icon, Input, Button, Badge, Menu, Dropdown, Tooltip, Modal, Steps, AutoComplete, Spin } from "antd"

import Grid from 'o-grid';

const Option = AutoComplete.Option
export default class SearchChecker extends Component {
    constructor() {
        super()
        this.searchTimer = null
        this.state = {
            loading: "none",
            valid: null,
            value: ""
        }
    }
    /////////////////////////////////////////
    onSelect(index, value) {
        let item = this.state.data[index]
        if (this.props.onSelect) {
            this.props.onSelect(item)
        }
    }
    onSearch(event) {
        if (this.props.onChange) {
            this.props.onChange(event)
        }
        let value = event.currentTarget.value
        let time = 500
        if (this.props.time) {
            time = this.props.time
        }
        if (this.searchTimer != null) {
            clearTimeout(this.searchTimer)
        }
        if (value == null || value == "") {
            this.setState({valid: null, loading: "none"})
        } else {
            this.setState({ loading: "", search: value })
            this.searchTimer = setTimeout(async () => {
                let valid = false
                if (this.props.onValidate) {
                    valid = true ? await this.props.onValidate(value) : false
                }
                //alert(valid)
                this.setState({ loading: "none", valid })
            }, time)
        }
    }
    render() {
        let style = { height: 35 }
        let suffix = <Icon type="close" style={{ color: "red", fontSize: 20 }} />
        if (this.state.loading == "") {
            suffix = <Spin indicator={<Icon type="loading" style={{ fontSize: 20 }} spin />} />
        } else {
            if (this.state.valid == true) {
                suffix = <Icon type="check" style={{ color: "green", fontSize: 20 }} />
            }
            if (this.state.valid == null) {
                suffix = <p></p>
            }
        }
        let placeholder = "SearchChecker"
        if (this.props.placeholder) {
            placeholder = this.props.placeholder
        }
        return <Input
            value={this.props.value}
            style={{ ...style, ...this.props.style }}
            placeholder={placeholder}
            onChange={this.onSearch.bind(this)}
            style={{ cursor: "default" }}
            suffix={(
                suffix
            )}
        />

    }
}

