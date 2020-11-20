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
  CircularProgress 
} from "@material-ui/core";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import {showNotification} from "../Notification/Notification";
import AddOpportunity from "../OpportunityNew/AddOpportunity"
import { AuthContext } from "../../contexts/AuthContext";
import { OpportunityContext } from "../../contexts/OpportunityContext";
import {Link} from "react-router-dom";
import cookie from 'react-cookies'

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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
}));

function Homepage() {
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
  const [addOpportunity,setAddOpportunity] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [skeleton,setSkeleton] = useState({});
  const [load, setLoad] = useState(false);
  const [loading1, setLoading1] = useState(false);




  const { currentUser, loading } = useContext(AuthContext);
  const {opportunitySkeleton,salesforceUser,opportunityData,setOpportunityData} = useContext(OpportunityContext);
  console.log(opportunitySkeleton,salesforceUser)

  async function fetchData(){
    setLoading1(true);
      let token = cookie.load('access_token');
      let url = cookie.load('instance_url');
      const payload = {
        url,
        token
      }
      console.log(payload)
      try{
      let result = await axios({
        url:`${process.env.REACT_APP_BACKEND_URL}/allOpportunities`,
        method:"post",
        data:payload
      })
      if(result){
        if (result.data.statusCode === 200) {
          const id = [];
          result.data.payload.data.records.map((value, index) => {
            id.push(value.Id);
            return null;
          });
          const payload = {
            url: url,
            token: token,
            id:id
          }
          try{
          let data = await axios({
            method: "post",
            url: `${process.env.REACT_APP_BACKEND_URL}/getMultipleRecords`,
            data: payload,
          })
          if(data){
            if (data.data.statusCode === 200) {
              setOpportunityData(data.data.payload.data);
              setLoading1(false);
              setLoad(true);
            }
            else{
              window.alert("Server error")
            }
          }
        }catch(err){
          window.alert(err.message)
          setLoading1(false);
          setLoad(true);
        };
          
        }
        setLoad(true);
        setLoading1(false);
      }
      else{
        window.alert("no data");
      }
    }catch(err){
      window.alert(err.message)
      setLoading1(false);
      setLoad(true);
    };
  }
  useEffect(() => {

    if (false) {
      axios({
        method: "get",
        url: "http://localhost:8080/pipelines",
        headers: {
          Authorization: `Bearer ${currentUser.ya}`,
          "Content-type": "application/json",
        },
      })
        .then((result) => {
          showNotification("No Opportunities",result.data.data.msg,"success");
          setSkeleton(result.data.data.opportunitiesSkeleton);
          setOpen2(true);
          setAddOpportunity(true);
          
          setTimeout(()=>{
            showNotification("Add Opporunties","Choose required fields from our best recommendation","info");

          },2000)
        })
        .catch((err) => {
          window.alert(err.message);
        });
    }
    else{
      fetchData();
    }
  }, []);

  

  const [open, setOpen] = React.useState(false);
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

    let token = cookie.load('access_token');
    let url = cookie.load('instance_url');

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
      url:url,
      editValue:data
    }


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
    } else {
      window.alert("server error");
    }
  };
  return (
    <>
    {loading1 && <Backdrop className={classes.backdrop}  open={loading1} onClick={()=>setLoading1(false)}>
        <CircularProgress color="inherit" />
      </Backdrop>}
    {addOpportunity && <AddOpportunity open={open2} handleClose={setOpen2} fields={skeleton} />}
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
              <Link style={{ textDecoration: "none", color: "#000" }} to="/">
                <h1>Home</h1>
              </Link>
            </Grid>
            <Grid
              item
              xs={6}
              sm={2}
              style={{ margin: "1rem", fontSize: "0.7rem" }}
            >
              <Link
                style={{ textDecoration: "none", color: "#000" }}
                to="/app/tasks"
              >
                <h1>Tasks</h1>
              </Link>
            </Grid>
            <Grid
              item
              xs={6}
              sm={2}
              style={{ margin: "1rem", fontSize: "0.7rem" }}
            >
              <Link
                style={{ textDecoration: "none", color: "#000" }}
                to="/app/notes"
              >
                <h1>Notes</h1>
              </Link>
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
              <Link
                style={{ textDecoration: "none", color: "#000" }}
                to="/app/pipelines"
              >
                <h1>Pipelines</h1>
              </Link>
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
      <div
        style={{
          position: "absolute",
          top: "30vh",
          left: "22vw",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "3rem" }}>Forget Your Admin Work</h1>
        <br />
        <p style={{ fontSize: "2rem" }}>
          Update your salesforce lightning fast
        </p>
        <br />
        <p style={{ fontSize: "2rem" }}>
          Automate your sales notes taking process
        </p>
        <br />
        <p style={{ fontSize: "2.5rem" }}>DESIGNED FOR ACCOUNT EXECUTIVES</p>

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
          <Paper
            style={{ padding: "2rem", minWidth: "30vw", minHeight: "50vh" }}
          >
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
