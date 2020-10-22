import React, { useState, useEffect } from "react";
import "./App.css";

import TableView from "./Components/TableView.js";
import Grid from "@material-ui/core/Grid";
import Homepage from "./Components/Homepage/Homepage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button"
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import DirectionsIcon from "@material-ui/icons/Directions";
import {Link} from "react-router-dom"
import Notes from "./Components/Notes/Notes";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 200,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

function App() {
  const classes = useStyles();
  const [text, setText] = useState("Hello world");

  return (
    <>
    <div className="App">
      <div className="bg-image"></div>
      <Grid container justify="space-around" style={{position:"absolute",top:20,left:0,color:"#000",zIndex:2 }}>
        <Grid item xs={6} sm={5}>
          <Grid container justify="flex-start" >

            <Grid
              item
              xs={6}
              sm={2}
              style={{ margin: "1rem", fontSize: "0.7rem",zIndex:2,cursor:"pointer"}}
            >
              <a style={{textDecoration:"none",color:"#000"}} href="/" ><h1>Home</h1></a>
            </Grid>
            <Grid
              item
              xs={6}
              sm={2}
              style={{ margin: "1rem", fontSize: "0.7rem" }}
            >
              <h1>Tasks</h1>
            </Grid>
            <Grid
              item
              xs={6}
              sm={2}
              style={{ margin: "1rem", fontSize: "0.7rem" }}
            >
            <a style={{textDecoration:"none",color:"#000"}} href="/notes"><h1>Notes</h1></a>
            </Grid>
            <Grid
              item
              xs={6}
              sm={2}
              style={{ margin: "1rem", fontSize: "0.7rem",cursor:"pointer"}}
            >
              <a style={{textDecoration:"none",color:"#000"}} href="/pipelines"><h1>Pipelines</h1></a>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} sm={5}>
          <Grid container justify="flex-end">
            <Grid item xs={6} sm={4} style={{ margin: "1rem" }}>
              <Paper component="form" className={classes.root}>
                <InputBase
                  className={classes.input}
                  placeholder="Search"
                  inputProps={{ "aria-label": "search google maps" }}
                />
                <IconButton
                  type="submit"
                  className={classes.iconButton}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Grid>
            <Grid item sc={2}>
              <Button variant="contained" color="primary" style={{ margin: "1rem" }} >New</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Router>
        <Route exact path="/" component={Homepage} />
        <Route path="/pipelines" component={TableView} />
        <Route path="/notes" component={Notes} />
      </Router>
      </div>
    </>
  );
}

export default App;
