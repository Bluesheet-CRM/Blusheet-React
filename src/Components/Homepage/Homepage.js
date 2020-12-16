import React, { useState, useEffect, useContext } from "react";
import {
  makeStyles,
  Grid,
  Paper,
  Button,
  InputBase,
  IconButton,
  Modal,
  TextField,
  MenuItem,
  MenuList,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import AddOpportunity from "../OpportunityNew/AddOpportunity";
import { OpportunityContext } from "../../contexts/OpportunityContext";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import {useNavigate} from "react-router-dom";
import "./Homepage.css";


const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 250,
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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function Homepage() {
  const classes = useStyles();

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
  const [addOpportunity,setAddOpportunity] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [skeleton, setSkeleton] = useState({});
  const [load, setLoad] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [showModal,setShowModal] = useState(false);

  let navigate = useNavigate();

  async function fetchData() {
    setLoading1(true);
    let token = cookie.load("auth_token");
    const payload = {
      token,
    };

    try {
      let result = await axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/allOpportunities`,
        method: "post",
        data: payload,
      });
      if (result) {
        if (result.data.statusCode === 200) {
          const id = [];
          result.data.payload.data.records.map((value, index) => {
            id.push(value.Id);
            return null;
          });
          const payload = {
            token: token,
            id: id,
          };
          try {
            let data = await axios({
              method: "post",
              url: `${process.env.REACT_APP_BACKEND_URL}/getMultipleRecords`,
              data: payload,
            });
            if (data) {
              if (data.data.statusCode === 200) {
                setOpportunityData(data.data.payload.data);
                setLoading1(false);
                setLoad(true);
              } else {
                window.alert(data.data.payload.msg);
              }
            }
          } catch (err) {
            window.alert(err.message);
            setLoading1(false);
            setLoad(true);
          }
        } else {
          if (result.data.payload.msg === "Session expired or invalid") {
            window.alert("Session expired or invalid");
            setLoad(true);
            setLoading1(false);
            const payload = {
              token,
            };
            let data = await axios({
              method: "post",
              url: `${process.env.REACT_APP_BACKEND_URL}/auth/refresh`,
              data: payload,
            });
            if (data.data.statusCode === 200) {
              cookie.save("auth_token", data.data.payload.data, { path: "/" });
              fetchData();
            } else {
              window.alert(data.data.payload.msg);
              setLoading1(false);
            }
          } else {
            setLoad(true);
            setLoading1(false);
          }
        }
      } else {
        window.alert("no data");
        setLoading1(false);
        setLoad(true);
      }
    } catch (err) {
      window.alert(err.message);
      setLoading1(false);
      setLoad(true);
    }
  }

  async function fetchOpportunityData(){
    axios({
      method: "get",
      url: `${process.env.REACT_APP_BACKEND_URL}/pipelines`,
      headers: {
        Authorization: `Bearer ${currentUser.ya}`,
        "Content-type": "application/json",
      },
    })
    .then((result)=>{
      if(result.data.data.msg === "No data found!"){
        window.alert("Your opportunity data seems to empty, add one!");
        setSkeleton(result.data.data.opportunitiesSkeleton);
        setAddOpportunity(true);
        setOpen2(true);
      }
      else{
        window.alert(result.data.data.msg);
        setOpportunityData(result.data.data.opportunities)
      }
    })
    .catch((err)=>{
      window.alert(err.message);
    })
  }

  const { loadingAuth, currentUser,setAuth,auth } = useContext(AuthContext);
  const {opportunitySkeleton,opportunityData,setOpportunityData,setOpportunitySkeleton} = useContext(OpportunityContext);

  useEffect(() => {
    
    if (loadingAuth && currentUser === null) {
      
      let token = cookie.load("auth_token");
      if ((token === null) | (token === undefined)) {
        window.location.href = "/";
      } else {

        fetchData();
      }
    }
    else{
      if(loadingAuth){
        if(currentUser !== null){
          fetchOpportunityData();
        }
        else{
          navigate("/");
        }

      }

    }
  }, [loadingAuth]);


  const [open] = React.useState(false);
  const anchorRef = React.useRef(null);

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

    opportunityData.forEach((element) => {
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
    let token = cookie.load("auth_token");

    const data = [];
    data[0] = {};
    data[0].Id = id;
    data[0].Name = name;
    data[0].StageName = stage;
    data[0].CloseDate = new Date(date);
    data[0].Amount = amount;
    data[0].NextStep = step;

    const payload = {
      token: token,
      editValue: data,
    };

    const result = await axios({
      method: "post",
      url: `${process.env.REACT_APP_BACKEND_URL}/updateMultiple`,
      data: payload,
    });
    if (result.data.statusCode === 200) {
      let resultArray = [];
      resultArray = result.data.payload.data;
      resultArray.map((value, index) => {
        if (value.success !== true) {
          window.alert(value.errors[0].message);
          return null;
        }
        return null;
      });
      setShow(false);
      setOpen1(false);
      setId("");
      setName("");
      setStep("");
      setStage("");
      setDate("");
      setAmount(0);
      window.alert("Saved successfully");
    } else {
      window.alert(result.data.payload.msg);
    }
  };
  return (
    <>
      {loading1 && (
        <Backdrop
          className={classes.backdrop}
          open={loading1}
          onClick={() => setLoading1(false)}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {addOpportunity && (
        <AddOpportunity open={open2} handleClose={setOpen2} fields={skeleton} />
      )}
      <Grid
        container
        justify="space-around"
        className="links-container"
        style={{
          position: "absolute",
          top: 20,
          left: 0,
          color: "#000",
          zIndex: 2,
        }}
      >
        <Grid item xs={12} sm={5}>
          <Grid container justify="flex-start">
            <Grid item xs={3} sm={2} className="links-grid">
              <Link className="nav-links" to="/">
                <h1 className="home-links">Home</h1>
              </Link>
            </Grid>
            <Grid item xs={3} sm={2} className="links-grid">
              <Link class="nav-links" to="/app/tasks">
                <h1 className="home-links">Tasks</h1>
              </Link>
            </Grid>
            <Grid item xs={3} sm={2} className="links-grid">
              <Link className="nav-links" to="/app/notes">
                <h1 className="home-links">Notes</h1>
              </Link>
            </Grid>
            <Grid item xs={3} sm={2} className="links-grid">
              <Link className="nav-links" to="/app/pipelines">
                <h1 className="home-links">Pipelines</h1>
              </Link>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Grid container justify="flex-end" className="search-div">
            <Grid item xs={8} sm={5} style={{ margin: "1rem" }}>
              <Paper component="form" className={classes.root}>
                <InputBase
                  className={classes.input}
                  placeholder="Search"
                  inputProps={{ "aria-label": "search google maps" }}
                  ref={anchorRef}
                  aria-controls={open ? "menu-list-grow" : undefined}
                  aria-haspopup="true"
                  onClick={() => {
                    setShow(false);
                    setOpen1(true);
                  }}
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
            <Grid item xs={2}>
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
      <div className="home-content">
        <h1 class="font-bold">Forget Your Admin Work</h1>
        <br />
        <p class="font-semibold">Update your salesforce lightning fast</p>
        <br />
        <p class="font-semibold">Automate your sales notes taking process</p>
        <br />
        <p class="font-semibold">DESIGNED FOR ACCOUNT EXECUTIVES</p>

        <Modal
          open={open1}
          onClose={() => setOpen1(false)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          id="opportunity-modal"
        >
          <Paper className="instant-modal">
            <TextField
              id="standard-basic"
              label="Search Opportunities"
              value={value1}
              className="search-text"
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
              {value1.length >= 0 &&
                opportunityData.length > 0 &&
                opportunityData
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
      </div>
    </>
  );
}

export default Homepage;
