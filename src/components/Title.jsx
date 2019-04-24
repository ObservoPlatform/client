import React, { Component } from "react" //React itself


import Grid from 'o-grid'; 

/**
 * Title (Logo) - The big logo for Observo
 * 
 */
const Title = () => {
    return <Grid height={150} style={{ paddingBottom: 10 }}>
        <p className="title-aw" style={{ fontWeight: "bold", fontSize: 80, textAlign: "center" }}>Observo<sub style={{ fontSize: 12 }}>v3.0</sub></p>
    </Grid>
}
export default Title