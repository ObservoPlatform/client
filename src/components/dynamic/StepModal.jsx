import React, { Component } from "react"
import duix from 'duix';
import { Icon, Input, Button, Badge, Menu, Dropdown, Tooltip, Modal, Steps } from "antd"

import Grid from 'o-grid';
/*


 <Step status="process" title="Create" icon={<Icon type="user" />} />
            <Step status="wait" title="Invite Users" icon={<Icon type="usergroup-add" />} />
            <Step status="wait" title="Preferences" icon={<Icon type="setting" />} />
            <Step status="wait" title="Launch" icon={<Icon type="rocket" />} />*/

/**
 * Stepper - Easy to use stepper component for Icon based examples
 * 
 * 
 * 
 * Usage: <Stepper steps={...} current={1} /> 
 * 
 *
 * //Steps
 * @props steps: [{ title: "Create", icon: "user" },
            { title: "Invite Users", icon: "usergroup-add" },
            { title: "Preferences", icon: "setting" },
            { title: "Launch", icon: "rocket" }]
 */
class Stepper extends Component {
    constructor() {
        super();
        this.state = {
            steps: [],
            current: 1,
            error: false
        }
    }
    /**
     * componentDidMount - Set the state when it mounts
     */
    componentDidMount() {
        this.setState({
            steps: this.props.steps,
            current: this.props.current
        })
    }
    componentDidUpdate(prevProps) {
        if (prevProps.steps !== this.props.steps
            || prevProps.current !== this.props.current
            || prevProps.error !== this.props.error) {
            this.setState({
                steps: this.props.steps,
                current: this.props.current
            });
        }
    }
    renderSteps() {
        const Step = Steps.Step;
        let items = []
        let active = false
        let loop = 1
        for (let step in this.state.steps) {
            let _active = false
            if (loop == this.state.current) {
                if (active == false) {
                    active = true
                }
                _active = true
            }
            let status;
            if (active == false && _active == false) {
                status = "finish"
            } else if (active == true && _active == true) {
                if (this.props.error) {
                    status = "error"
                } else {
                    status = "process"
                }
            } else {
                status = "wait"
            }
            //Get the title and the icon
            let title = ""
            let icon = ""
            if (this.state.steps[step].title != null) {
                title = this.state.steps[step].title
            }
            if (this.state.steps[step].icon != null) {
                icon = this.state.steps[step].icon
            }
            items.push(<Step status={status} title={title} icon={<Icon type={icon} />} />)
            loop++
        }
        return items
    }
    render() {
        return <Steps>
            {this.renderSteps()}
        </Steps>

    }
}




/**
 * Portal - The main area for creating groups, creating/opening projects and some settings.
 * @copyright 2019 ImportCore
 * @author Brendan Fuller @ImportProgram
 */
export default class StepModal extends Component {
    constructor() {
        super()
    }
    onClose() {
        if (this.props.onClose) {
            this.props.onClose()
        }
    }
    onNext() {
        if (this.props.onNext) {
            this.props.onNext()
        }
    }
    onBack() {
        if (this.props.onBack) {
            this.props.onBack()
        }
    }
    render() {
        let steps = [
            { title: "Create", icon: "user" },
            { title: "Invite Users", icon: "usergroup-add" },
            { title: "Preferences", icon: "setting" },
            { title: "Launch", icon: "rocket" },
        ]
        if (this.props.steps) {
            steps = this.props.steps
        }
        let title = "Default StepModal"
        if (this.props.title) {
            title = this.props.title
        }
        let current = 1
        if (this.props.current) {
            current = this.props.current
        }
        let nextDisabled = false
        if (this.props.nextDisabled) {
            nextDisabled = this.props.nextDisabled
        }
        if (current == steps.length) {
            nextDisabled = true
        }
        let backDisabled = false
        if (current == 1) {
            backDisabled = true
        }
        return <Modal
            title={title}
            bodyStyle	={{ padding: 0 }}
            visible={this.props.visible}
            closable={false}
            width={700}
            height={500}
            footer={[

                <Grid col>
                    <Grid width={50}>
                        <Button key="submit" disabled={backDisabled} onClick={this.onBack.bind(this)}>
                            Back
                        </Button>
                    </Grid>
                    <Grid style={{ marginLeft: 20 }} width={50}>
                        <Button key="submit" type="primary" disabled={nextDisabled} onClick={this.onNext.bind(this)}>
                            Next
                        </Button>
                    </Grid>
                    <Grid> <Button key="back" type="danger" onClick={this.onClose.bind(this)}>Cancel</Button> </Grid>
                </Grid >

            ]}
        >
            <Grid row height={400} >
                <Grid height={70} width="100%" background="lightgray" style={{ padding: 30, paddingTop: 15, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }} >
                    <Grid background="lightgray">  <Stepper steps={steps} current={current} error={this.props.error} /></Grid>
                </Grid>
   
                {this.props.children}
            </Grid>
        </Modal>
    }
}
//cafebrustella