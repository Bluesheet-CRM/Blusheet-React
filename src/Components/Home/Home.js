import React,{useState} from "react";
import { Grid, Card, Container, Divider, Button } from "@material-ui/core";
import WbCloudyIcon from "@material-ui/icons/WbCloudy";
import {Link} from "react-router-dom";

import image from "../../Assets/home.jpg";
function Home() {
  console.log(process.env.REACT_APP_BACKEND_URL);
  
  return (
    <Container>
      <Grid container justify="center" style={{ marginTop: "20vh" }}>
        <Grid item md={6}>
          <h1>Bluesheet</h1>
          <Divider />
          <br />
          <p>
            Bluesheet is the fastest experience to update your Salesforce
            pipeline, take sales notes, and work your daily todos.
          </p>
          <br />
          <Grid container>
            <Grid item md={6}>
              <h3>Integrate with salesforce </h3>
              <br />
              <p style={{ width: "80%" }}>
                For account executives to update salesforce lightning fast and
                automate sales notes taking process.{" "}
              </p>
              <br />
              <br />
              <a href={`${process.env.REACT_APP_BACKEND_URL}/auth/login`}>
              <Button variant="contained" color="primary">
                salesforce &nbsp;
                <WbCloudyIcon />
              </Button>
                </a>
            </Grid>
            <Grid item md={6}>
              <h3>Use our own infrastrcuture</h3>
              <br />
              <p style={{ width: "80%" }}>
                For individuals to automate the sales tracking process and note
                taking in a most efficient way.{" "}
              </p>
              <br />
              <br />
              <Link to="/signup" ><Button variant="contained">Create Account</Button></Link>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6}>
          <img src={image} alt="Bluesheet" />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
