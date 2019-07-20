import React, { Component } from "react"
import { Icon, Input, AutoComplete, Spin } from "antd"


const Option = AutoComplete.Option
export default class Search extends Component {
    constructor() {
        super()
        this.searchTimer = null
        this.state = {
            loading: "none",
            data: [],
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
    onChange(value) {
        this.setState({ value })
    }
    onSearch(value) {
        let time = 500
        if (this.props.time) {
            time = this.props.time
        }
        if (this.searchTimer != null) {
            clearTimeout(this.searchTimer)
        }
        this.setState({ loading: "", search: value })
        this.searchTimer = setTimeout(async () => {
            let data = true ? await this.props.onSearch(value) : []
            this.setState({ loading: "none", data })
        }, time)
    }
    /////////////////////////////////////////
    renderSearch(object, key) {
        //Default Search Render Object
        let searchRender = (key, object) => { return [object, <p>Hello World {object}</p>] }
        //If we have a custom render, lets use that
        if (this.props.onRender) {
            searchRender = this.props.onRender
        }
        //Outcome of the render (default or custom)
        let outcome = searchRender(this.state.search, object)
        let text = outcome[0] //Grab the "search" text
        let jsx = outcome[1] //And whatever render is being used

        return <Option key={key} text="">{jsx}</Option>
    }

    render() {
        const { data } = this.state;
        let placeholder = true ? this.props.placeholder : "Search"
        let style = { width: 200, height: 35 }
        return <AutoComplete
            style={{ ...style, ...this.props.style }}

            onSearch={this.onSearch.bind(this)}
            onSelect={this.onSelect.bind(this)}
            onChange={this.onChange.bind(this)}
            dataSource={data.map(this.renderSearch.bind(this))}
            placeholder={placeholder}
            value={this.state.value}
            optionLabelProp="text"
        >

            <Input

                style={{ cursor: "default" }}
                suffix={(
                    <Spin style={{ paddingTop: 0, display: "" }} indicator={<Icon type="loading" style={{ fontSize: 20, display: this.state.loading }} spin />} />
                )}
            />
        </AutoComplete>

    }
}

export let SearchHighlight = (props) => {
    return <a target="_blank" rel="noopener noreferrer">{props.children}</a>
}
//cafebrustella

