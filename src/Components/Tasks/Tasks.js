import React, { useState, useEffect } from "react";
import LinkIcon from "@material-ui/icons/Link";
import axios from "axios";
import {
  makeStyles,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  MenuItem,
  MenuList,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  Container,
  InputAdornment,
  Box,
  SvgIcon,
} from "@material-ui/core";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import "../Notes/Notes.css";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import LaunchRoundedIcon from "@material-ui/icons/LaunchRounded";
import Statistics from "./Statistics";
import TaskTable from "./TaskTable";
import { Search as SearchIcon } from "react-feather";
const useStylesFacebook = makeStyles((theme) => ({
  root: {
    position: "relative",
    top: 20,
    left: 10,
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  top: {
    color: "#1a90ff",
    animationDuration: "550ms",
    position: "absolute",
    left: 0,
  },
  circle: {
    strokeLinecap: "round",
  },
}));

function Notes(props) {
  const classes = useStylesFacebook();
  const [notesArray, setNotesArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [index, setIndex] = useState(0);
  const [opportunity, setOpportunity] = useState([]);
  const [selected, setSelected] = useState("");
  const [open1, setOpen1] = React.useState(false);
  const [sub, setSub] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const oppRef = React.useRef(null);

  const handleToggle1 = () => {
    setOpen1((prevOpen) => !prevOpen);
  };

  const handleClose1 = (event, index) => {
    if (oppRef.current && oppRef.current.contains(event.target)) {
      return;
    }
    setSelected(opportunity[index].Id);
    setOpen1(false);
  };

  async function fetchData() {
    setLoading(true);
    const result = await axios({
      method: "get",
      url: `${process.env.REACT_APP_BACKEND_URL}/tasks`,
    });
    if (result.data.statusCode === 200) {
      const id = [];
      result.data.payload.data.records.map((value, index) => {
        id.push(value.Id);
        return null;
      });
      console.log(id);

      const data = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_URL}/getMultipleTasks`,
        data: id,
      });
      if (data.data.statusCode === 200) {
        console.log(data.data.payload.data);
        setNotesArray(data.data.payload.data);
        localStorage.setItem(
          "tasks",
          JSON.stringify(data.data.payload.data, 2, null)
        );

        setLoading(false);
        setLoad(true);
      }
      setLoad(true);
      setLoading(false);
    } else {
      setLoading(false);
      window.alert("server error");
    }
  }

  useEffect(() => {
    fetchData();
    const opportunities = JSON.parse(localStorage.getItem("response"));
    setOpportunity(opportunities);
    // const response = JSON.parse(localStorage.getItem("notes"));
    // setNotesArray(response);

    // setLoad(true);
  }, []);

  const handleSave = async () => {
    const payload = {
      Subject: sub,
      Description: desc,
      Status: status,
      ActivityDate: new Date(date),
      WhatId: selected,
    };

    const result = await axios({
      method: "post",
      url: `${process.env.REACT_APP_BACKEND_URL}/addTasks`,
      data: payload,
    });
    if (result.data.statusCode === 200) {
      if (result.data.payload.data.success === true) {
        setSub("");
        setDesc("");
        setDate("");
        setStatus("");
        fetchData();
      }
    } else {
      window.alert("server error");
    }
  };

  const handleDelete = async (id) => {
    if (id === undefined) {
      setNotesArray(notesArray.filter((el) => el.Id !== undefined));
    } else {
      const result = await axios({
        method: "delete",
        url: `${process.env.REACT_APP_BACKEND_URL}/deleteTasks/${id}`,
      });
      if (result.data.statusCode === 200) {
        window.alert("Deleted Successfully");
        setNotesArray(notesArray.filter((el) => el.Id !== id));
      } else {
        window.alert("server Error");
      }
    }
  };

  return (
    <div
      style={{
        width: "85vw",
        marginTop: "5vh",
        overflowX: "auto",
      }}
    >
      <Container maxWidth={false}>
        <Grid container>
          <Grid item xl={3} md={3}>
            <Statistics />
          </Grid>
          <Grid item xl={3} md={3}>
            <Statistics />
          </Grid>
          <Grid item xl={3} md={3}>
            <Statistics />
          </Grid>
          <Grid item xl={3} md={3}>
            <Statistics />
          </Grid>
        </Grid>
        <Box
        display="flex"
        style={{marginTop:"2rem",width:"90%"}}
        justifyContent="flex-end"
      >
        <Button
          color="primary"
          variant="contained"
        >
          Add Task
        </Button>
      </Box>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Search Task"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
        {load && <TaskTable data={notesArray} />}
        {/* {load && (
        <Grid container justify="space-evenly">
          <Grid item sm={5} md={5}>
            <>
              {console.log(index, notesArray)}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginRight: "3rem",
                }}
              >
                <Button
                  style={{ marginBottom: "1rem" }}
                  variant="contained"
                  color="primary"
                >
                  Add &nbsp;
                  <NoteAddIcon style={{ height: "20px", width: "20px" }} />
                </Button>

                <Button
                  style={{ marginBottom: "1rem" }}
                  aria-haspopup="true"
                  variant="contained"
                  color="secondary"
                  ref={oppRef}
                  aria-controls={open1 ? "menu-list-grow" : undefined}
                  onClick={handleToggle1}
                >
                  <LinkIcon style={{ height: "20px", width: "20px" }} />
                  &nbsp; Link to Opportunity
                </Button>
                <Popper
                  open={open1}
                  anchorEl={oppRef.current}
                  role={undefined}
                  transition
                  disablePortal
                  style={{
                    zIndex: 2,
                    marginLeft: "3rem",
                    maxHeight: "40vh",
                    overflowY: "auto",
                    maxwidth: "30vw",
                    wordWrap: "break-word",
                  }}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom"
                            ? "center top"
                            : "center bottom",
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={() => setOpen1(false)}>
                          <MenuList autoFocusItem={open1} id="menu-list-grow">
                            {opportunity.map((value, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  onClick={(e) => handleClose1(e, index)}
                                >
                                  {value.Name}
                                </MenuItem>
                              );
                            })}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>
              <Card variant="outlined">
                <CardContent>
                  <TextField
                    id="outlined-basic"
                    label="Subject"
                    variant="outlined"
                    fullWidth
                    value={sub}
                    onChange={(e) => setSub(e.target.value)}
                  />
                  <br />
                  <br />
                  <TextField
                    id="outlined-basic1"
                    label="Description"
                    variant="outlined"
                    fullWidth
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <br />
                  <br />
                  <TextField
                    id="outlined-basic2"
                    label="Status"
                    variant="outlined"
                    fullWidth
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  <br />
                  <br />
                  <TextField
                    id="outlined-basic3"
                    label="Activity Date"
                    variant="outlined"
                    fullWidth
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <br />
                  <br />
                  <Button
                    style={{ marginBottom: "1rem", marginRight: "1rem" }}
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                  >
                    Save &nbsp;
                  </Button>
                </CardContent>
              </Card>
            </>
          </Grid>
        </Grid> */}
        {/* )} */}
      </Container>
    </div>
  );
}

export default Notes;
