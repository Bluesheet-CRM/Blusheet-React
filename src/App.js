import React, { useState, useEffect } from "react";
import "./App.css";

import TableView from "./Components/TableView.js";
import Grid from "@material-ui/core/Grid";
import Homepage from "./Components/Homepage/Homepage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import DirectionsIcon from "@material-ui/icons/Directions";
import { Link } from "react-router-dom";
import Notes from "./Components/Notes/Notes";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import axios from "axios";
import Tasks from "./Components/Tasks/Tasks";


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
  const [opportunity, setOpportunity] = useState([]);
  const [filterArray, setFilterArray] = useState([]);
  const [open1, setOpen1] = useState(false);
  const [value1, setValue1] = useState("");
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [stage, setStage] = useState("");
  const [amount, setAmount] = useState(0);
  const [step, setStep] = useState("");
  const [selectedValue, setSelectedValue] = useState([]);
  const [id, setId] = useState("");
  const [sendData, setSendData] = useState([]);

  useEffect(() => {
    const opportunities = JSON.parse(localStorage.getItem("response"));
    setOpportunity(opportunities);
    setFilterArray(opportunities);
  }, []);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event, index) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
    setOpen1(true);
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleSelect = (id) => {
    let newArray = sendData;
    newArray["Id"] = id;
    setSendData(newArray);

    opportunity.forEach((element) => {
      if (element.Id === id) {
        setSelectedValue(element);
        setName(element.Name);
        setStep(element.NextStep);
        setDate(element.CloseDate);
        setAmount(element.Amount);
        setStage(element.StageName);
        setId(element.Id);
      }
    });
    setShow(true);
  };

  const handleSave = async () => {
    const payload = [];
    payload[0] = {};
    payload[0].Id = id;
    payload[0].Name = name;
    payload[0].StageName = stage;
    payload[0].CloseDate = new Date(date);
    payload[0].Amount = amount;
    payload[0].NextStep = step;
    console.log(payload);
    const result = await axios({
      method: "post",
      url: "http://localhost:8080/updateMultiple",
      data: payload,
    });
    if (result.data.statusCode === 200) {
      let resultArray = [];
      resultArray = result.data.payload.data;
      resultArray.map((value, index) => {
        if (value.success !== true) {
          window.alert(value.errors[0].message);
        }
      });
      setShow(false);
      setOpen1(false);
      setId("");
      setName("");
      setStep("");
      setStage("");
      setDate("");
      setAmount(0);
    } else {
      window.alert("server error");
    }
  };
  return (
    <>
      <div className="App">
        <div className="bg-image"></div>
        <Grid
          container
          justify="space-around"
          style={{
            position: "absolute",
            top: 20,
            left: 0,
            color: "#000",
            zIndex: 2,
          }}
        >
          <Grid item xs={6} sm={5}>
            <Grid container justify="flex-start">
              <Grid
                item
                xs={6}
                sm={2}
                style={{
                  margin: "1rem",
                  fontSize: "0.7rem",
                  zIndex: 2,
                  cursor: "pointer",
                }}
              >
                <a style={{ textDecoration: "none", color: "#000" }} href="/">
                  <h1>Home</h1>
                </a>
              </Grid>
              <Grid
                item
                xs={6}
                sm={2}
                style={{ margin: "1rem", fontSize: "0.7rem" }}
              >
                <a
                  style={{ textDecoration: "none", color: "#000" }}
                  href="/tasks"
                >
                  <h1>Tasks</h1>
                </a>
              </Grid>
              <Grid
                item
                xs={6}
                sm={2}
                style={{ margin: "1rem", fontSize: "0.7rem" }}
              >
                <a
                  style={{ textDecoration: "none", color: "#000" }}
                  href="/notes"
                >
                  <h1>Notes</h1>
                </a>
              </Grid>
              <Grid
                item
                xs={6}
                sm={2}
                style={{
                  margin: "1rem",
                  fontSize: "0.7rem",
                  cursor: "pointer",
                }}
              >
                <a
                  style={{ textDecoration: "none", color: "#000" }}
                  href="/pipelines"
                >
                  <h1>Pipelines</h1>
                </a>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} sm={5}>
            <Grid container justify="flex-end">
              <Grid item xs={6} sm={5} style={{ margin: "1rem" }}>
                <Paper component="form" className={classes.root}>
                  <InputBase
                    className={classes.input}
                    placeholder="Search"
                    inputProps={{ "aria-label": "search google maps" }}
                    ref={anchorRef}
                    aria-controls={open ? "menu-list-grow" : undefined}
                    aria-haspopup="true"
                    onClick={() => setOpen1(true)}
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
                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: "1rem" }}
                >
                  New
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Router>
          <Route exact path="/" component={Homepage} />
          <Route path="/pipelines" component={TableView} />
          <Route path="/notes" component={Notes} />
          <Route path="/tasks" component={Tasks} />
        </Router>
      </div>
      <Modal
        open={open1}
        onClose={() => setOpen1(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{
          maxHeight: "40vh",
          minWidth: "30vw",
          maxWidth: "50vw",
          marginTop: "5rem",
          marginLeft: "30vw",
        }}
      >
        <Paper style={{ padding: "2rem", minWidth: "30vw", minHeight: "50vh" }}>
          <TextField
            id="standard-basic"
            label="Search Opportunities"
            value={value1}
            style={{ width: "20vw", marginLeft: "10vw" }}
            onChange={(e) => setValue1(e.target.value)}
          />
          <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label="search"
            style={{ marginTop: "0.7rem" }}
          >
            <SearchIcon />
          </IconButton>

          <MenuList className={show ? "hide" : "show"}>
            {value1.length > 0 &&
              filterArray.length > 0 &&
              filterArray
                .filter((el) => el.Name.includes(value1))
                .map((value, index) => {
                  return (
                    <MenuItem
                      key={index}
                      onClick={() => handleSelect(value.Id)}
                    >
                      {value.Name}
                    </MenuItem>
                  );
                })}
          </MenuList>
          <div className={show ? "show" : "hide"} style={{ padding: "1rem" }}>
            <TextField
              variant="outlined"
              label="Opportunity Name"
              value={name}
              style={{ width: "20vw", marginLeft: "10vw" }}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <br />
            <br />
            <TextField
              variant="outlined"
              label="Next Step"
              value={step}
              style={{ width: "20vw", marginLeft: "10vw" }}
              onChange={(e) => {
                setStep(e.target.value);
              }}
            />
            <br />
            <br />
            <TextField
              variant="outlined"
              label="Stage"
              value={stage}
              style={{ width: "20vw", marginLeft: "10vw" }}
              onChange={(e) => {
                setStage(e.target.value);
              }}
            />
            <br />
            <br />
            <TextField
              variant="outlined"
              label="Amount"
              value={amount}
              style={{ width: "20vw", marginLeft: "10vw" }}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
            <br />
            <br />
            <TextField
              variant="outlined"
              label="Closing Date"
              value={date}
              placeholder="YYYY/DD/MM"
              style={{ width: "20vw", marginLeft: "10vw" }}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
            <br />
            <br />
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </Paper>
      </Modal>
    </>
  );
}

export default App;
