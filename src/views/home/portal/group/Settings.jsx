import React from "react"
import Grid from "o-grid"
import { Button, Icon, Upload, message } from "antd"
import duix from "duix"
import classnames from "classnames"


let View = (props) => {
    if (props.show) {
        return props.children
    } else {
        return null
    }
}
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

let checkFile = (file) => {
    console.log(file)
    const isJPG = (file.type === 'image/jpeg') || (file.type == "image/png");
    if (!isJPG) {
        message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 0.5;
    if (!isLt2M) {
        message.error('Image must smaller than 1MB!');
    }
    console.log(file)
    return isJPG && isLt2M;
}


export default class GroupSettings extends React.Component {
    constructor() {
        super()
        this.unsub = []
        this.state = {
            panel: "OVERVIEW",
            loading: false,
            name: "Default"
        }
    }
    componentDidMount() {
        this.unsub[0] = duix.subscribe('app/connect', this._onConnect.bind(this));
        this.unsub[1] = duix.subscribe('home/groups/select', this._onGroupSelect.bind(this));
    }
    componentWillUnmount() { for (let e in this.unsub) { this.unsub[e](); } }
    /**
     * onConnect - When the CLIENT connects to the socket server. 
     * @param {Object} client 
     */
    _onConnect(socket) {

    }
    /**
     * onGroupSelect - When a group is select
     * @param {String} uuid - User UUID
     * @param {String} name - Group Name
     */
    _onGroupSelect({ uuid, name }) {
        console.log(name)
        this.setState({ name })
    }
    //////////////////
    /**
     * onpanelSelect - When a panel get selected (sidebar select)
     * @param {*} panel 
     */
    _onPanelSelect(panel) {
        console.log(panel)
        this.setState({ panel })
    }
    /**
     * view - A custom rendering function to show panels based on its props
     * @param {*} name 
     * @param {*} children 
     */
    view(name, children) {
        let show = (this.state.panel == name ? true : false)
        return <View show={show}>{children}</View>
    }
    /**
     * overview_onUploadChange - When the <Upload> component has a change
     * @param {Object} info - All the file info
     */
    overview_onUploadChange(info) {
        //Check if the file is uploading
        if (info.file.status === 'uploading') {
            //Context of the Settings Component
            let self = this
            //Get the Base64 of the file
            getBase64(info.file.originFileObj, (imageUrl) => {
                //Now check the image with the base 64
                let img = new Image()
                //When the image is loaded this event will trigge
                img.onload = function () {
                    //Check if the image is EXACTLY 512x512 (dims)
                    if (this.width == 512 && this.height == 512) {
                        //If so, set the state of the groupIcon to the imageUrl
                        self.setState({
                            overview_groupIcon: imageUrl
                        })
                    //Else give a warning
                    } else {
                        message.warning("Image must be 512x512 In Size")
                    }
                };
                //This will occur before the onload, but just apply the base64 src to this image object
                img.src = imageUrl
            });
        }
    }

    render() {
        //SettingsSection - Section for the panel on view side
        const SettingsSection = (props) => {
            return <Grid style={{ borderBottom: "3px solid gray" }} className="title">
                <p className="text">{props.title}</p>
            </Grid>
        }

        //SettingsGroup - A group component for the sidebar (which panel is selected)
        const SettingsGroup = (props) => {
            //Get all information of the properties
            let icon = props.icon ? props.icon : "close"
            let name = props.name ? props.name : "Default"
            let select = props.select ? true : false
            //Render
            return <Grid onClick={props.onClick} col height={30} className={classnames({ group: true, selected: select })} style={{ padding: "20 10" }}>
                <Grid height={30} style={{ marginTop: 8 }}><Icon style={{ fontSize: '30px' }} type={icon} /></Grid>
                <Grid className="title" style={{ marginLeft: 10 }}>
                    <p style={{ margin: 0, fontSize: "30" }}>{name}</p>
                </Grid>

            </Grid>
        }

        const UploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return <Grid row height={500} width="100%" className="modal-group-settings settings">
            <Grid col height={50} className="header">
                <Grid style={{ marginTop: 12, marginLeft: 16 }}>
                    <p className="ant-modal-title">Group Settings</p>
                </Grid>
                <Grid width={50} style={{ marginTop: 9 }}>
                    <Button icon="close" onClick={this.props.onClose}></Button>
                </Grid>
            </Grid>
            <Grid col className="body">
                <Grid width={200} height="100%" className="sidebar" center h>
                    <SettingsGroup onClick={this._onPanelSelect.bind(this, "OVERVIEW")} select name="Overview" icon="setting" />
                    <SettingsGroup onClick={this._onPanelSelect.bind(this, "USERS")} name="Users" icon="team" />
                </Grid>
                <Grid width={10} background="white" />
                <Grid className="view">
                    {this.view("OVERVIEW", <Grid row>
                        <SettingsSection title="Overview" />
                        <Grid col style={{ margin: 10 }}>
                            <Grid>
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    customRequest={() => {/*blank function for no request*/ }}
                                    beforeUpload={checkFile}
                                    onChange={this.overview_onUploadChange.bind(this)}
                                >
                                    {this.state.overview_groupIcon ? <img style={{ width: 100, height: 100 }} src={this.state.overview_groupIcon} alt="avatar" /> : UploadButton}
                                </Upload>
                            </Grid>
                            <Grid center v>
                                <p style={{ fontSize: 30, fontWeight: "bold" }}>{this.state.name}</p>
                            </Grid>
                        </Grid>
                    </Grid>)}
                    {this.view("USERS", <Grid>
                        B
                    </Grid>)}
                </Grid>
            </Grid>
        </Grid>
    }

}