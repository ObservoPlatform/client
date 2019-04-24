

/**
 * App Class - Main react component for rendering the App
 */
class AAAA extends Component {
    constructor() {
        super()
        this.unsubscribe = [];
        this.state = {
            state: "CONNECT",
            authKey: null,
            session: null,
            password: null,
            username: null,
            remember: false,

            _projects: null,
        }
    }
    componentDidMount() {
        //We can create a more diverse

        this.unsubscribe[0] = duix.subscribe('session', this.onSessionChange.bind(this));

        this.coreSocket = io.connect(`http://${ip}/core/`)



        this.coreSocket.on("connect", () => {
            this.setState({ state: "ACCOUNT" })
            //This is testing code only. This key will be saved as a cookie and saved for 1 day (unless forced logout)
            //Fast Login
            this.coreSocket.emit("core_validateAuthKey", ({ uuid: "872571a1-0872-4e74-8b90-57df2bb75093", authKey: "7334ad56-7893-4539-ba36-a5eb74d67deb" }))
            /**
             * Authentication of the user.
             */
            this.coreSocket.on("core_validAuthentication", (data) => {
                if (data.session != null) {
                    duix.set('session', data.session);
                    this.coreSocket.emit("core_getProjects")
                    this.setState({ state: "PROJECTS" })
                    //This would need to be a selection screen for the user.
                    //this.coreSocket.emit("core_validateProject", { project: "Bob" })
                }
            })
            this.coreSocket("core_getProjects", (data) => {
                let projects = data.projects

            })
            /**
             * Checks if the project given to the user is valid
             */
            this.coreSocket.on("core_validProject", (data) => {
                this.setState({ state: "VERIFY" })

            })
            /**
             * Downloads the plugins sent from server
             */
            this.coreSocket.on("core_downloadPlugins", (data) => {
                let plugins = data.plugins
                let didDownload = {}

                //Check if all downloads are done by making sure all have a vaild checksum/hash
                let checkDownload = () => {
                    let pass = true
                    for (let p in didDownload) {
                        if (didDownload[p] == null) {
                            pass = false
                        }
                    }
                    if (pass == true) {
                        this.coreSocket.emit("core_finishedDownloads", { plugins: didDownload })
                    }
                }
                //Do we have a list of plugins?
                if (plugins != null) {
                    //Alrighty lets loop them.
                    for (let plugin in plugins) {
                        didDownload[plugins[plugin]] = null
                        let url = `http://${ip}/plugins/${plugins[plugin]}`
                        console.log(url)
                        request(url, function (error, response, body) {
                            console.log(`${url}/${plugins[plugin]}.js`)
                            console.log(body)
                            eval(body)
                        });
                    }
                }
            })
            //TODO: Invaild Project
        })
        //TODO after 10 seconds, tell user if the server is connecting.


    }
    onSessionChange(session) {
        console.log(session)
        this.setState({ session })
    }
    componentWillUnmount() {
        this.coreSocket.close()
        this.unsubscribe[0]();
    }
    /**
     * OnRememberMe - Event for the Remember Me checkbox
     * @param {Event} e 
     */
    onRememberMe(e) {
        console.log(e)
        this.setState({ remember: e.target.checked })
    }
    /**
     * OnUsername 
     * @param {Event} e 
     */
    onUsername(e) {
        this.setState({ username: e.currentTarget.value })
    }
    onPassword(e) {
        this.setState({ password: e.currentTarget.value })
    }
    onAccountSignIn() {
        this.coreSocket.emit("core_validateAccount", { username: this.state.username, password: this.state.password, remember: this.state.remember })
    }
    renderViewer() {
        return <Grid canvas col>
            <Grid width={200} background="gray" row>

            </Grid>
            <Grid background="lightgray" row center>

            </Grid>
        </Grid>
    }

    renderConnect() {
        if (this.state.state == "CONNECT") {
            return <Grid canvas col>
                <Grid background="lightgray" row center v h>
                    <Grid row>
                        <Grid style={{ paddingBottom: 60 }}>
                            <p className="title-aw" style={{ fontWeight: "bold", fontSize: 80, textAlign: "center" }}>Observo</p>
                        </Grid>
                        <Grid height={200} style={{ textAlign: "center" }}>
                            <Icon type="loading" style={{ fontSize: '200px', color: colors.primary }} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        }
        else if (this.state.state == "ACCOUNT") {
            return <Grid canvas col>
                <Grid background="lightgray" row center v h>
                    <Grid row width={400}>
                        <Grid style={{ paddingBottom: 10 }}>
                            <p className="title-aw" style={{ fontWeight: "bold", fontSize: 80, textAlign: "center" }}>Observo</p>
                        </Grid>
                        <Grid row style={{ marginBottom: 250 }}>
                            <Grid height={50}>  <Input onChange={this.onUsername.bind(this)} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} style={{ marginBottom: 15 }} placeholder="Username" /></Grid>
                            <Grid height={50}>  <Input onChange={this.onPassword.bind(this)} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} style={{ marginBottom: 15 }} placeholder="Password" /></Grid>
                            <Grid col >
                                <Grid width={150}><Checkbox checked={this.state.remember} onChange={this.onRememberMe.bind(this)}>Remember Me</Checkbox></Grid>
                                <Grid />
                                <Grid style={{ marginTop: 10 }}>
                                    <Button onClick={this.onAccountSignIn.bind(this)} style={{ background: colors.primary, border: `1px solid ${colors.primary}` }} type="primary" shape="round" icon="login" size="large">Sign In</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        } else if (this.state.state == "PROJECTS") {
            return null
        } else {
            return this.renderViewer()
        }

    }
    render() {
        return this.renderConnect()
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////