import React, { useState, useEffect, useContext } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  Button,
  Grid,
  Card,
  CardContent,
  makeStyles,
  CircularProgress,
  TextField,
  MenuItem,
  MenuList,
  Grow,
  Paper,
  Backdrop,
  Popper,
} from "@material-ui/core";
import LinkIcon from "@material-ui/icons/Link";
import axios from "axios";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import "./Notes.css";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import LaunchRoundedIcon from "@material-ui/icons/LaunchRounded";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { OpportunityContext } from "../../contexts/OpportunityContext";
import cookie from "react-cookies";

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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function Notes(props) {
  const classes = useStylesFacebook();
  const [note, setNote] = useState("");
  const [notesArray, setNotesArray] = useState([]);
  const [loading1, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [index, setIndex] = useState(0);
  const [add, setAdd] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [opportunity, setOpportunity] = useState([]);
  const [selected, setSelected] = useState("");
  const [open1, setOpen1] = React.useState(false);
  const oppRef = React.useRef(null);
  const [loading2, setLoading2] = useState(false);

  const { opportunityData } = useContext(
    OpportunityContext
  );

  const anchorRef = React.useRef(null);

  //for adding new note
  const handleToggle = () => {
    setAdd(true);
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  //for displaying opportunities
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

  const prevOpen1 = React.useRef(open1);
  React.useEffect(() => {
    if (prevOpen1.current === true && open1 === false) {
      oppRef.current.focus();
    }

    prevOpen1.current = open1;
  }, [open1]);

  async function fetchData() {
    setLoading(true);
    setLoading2(true);
    let token = cookie.load("auth_token");

    const payload = {
      token: token,
    };
    const result = await axios({
      method: "post",
      url: `${process.env.REACT_APP_BACKEND_URL}/allNotes`,
      data: payload,
    });
    if (result.data.statusCode === 200) {
      const id = [];
      result.data.payload.data.records.map((value, index) => {
        id.push(value.Id);
        return null;
      });

      const payload1 = {
        token: token,
        id: id,
      };

      const data = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_URL}/getMultipleNotes`,
        data: payload1,
      });
      if (data.data.statusCode === 200) {
        setNotesArray(data.data.payload.data);

        setLoading(false);
        setLoading2(false);
        setLoad(true);
      }
      setLoad(true);
      setLoading(false);
      setLoading2(false);
    } else {
      if (result.data.payload.msg === "Session expired or invalid") {
        window.alert("Session expired or invalid");
        setLoad(true);
        setLoading(false);
        setLoading2(false);
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
          setLoading(false);
          setLoading2(false);
        }
      } else {
        setLoad(true);
        setLoading(false);
        setLoading2(false);
      }

      setLoading(false);
      setLoading2(false);
      window.alert(result.data.payload.msg);
    }
  }

  useEffect(() => {
    let token = cookie.load("auth_token");
    if ((token === null) | (token === undefined)) {
      window.location.href = "/";
    } else {
      fetchData();
      setOpportunity(opportunityData);
    }

    onbeforeunload = (e) => "Changes made will not be saved";
  }, []);

  const handleSave = async () => {
    let token = cookie.load("auth_token");
    if (selected === "") {
      window.alert("Choose The Opportunity");
    } else {
      const data = {
        Title: notesArray[index].Title,
        Body: note,
        ParentId: selected,
      };
      const payload = {
        token: token,
        data: data,
      };
      const result = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_URL}/addNotes`,
        data: payload,
      });
      if (result.data.statusCode === 200) {
        if (result.data.payload.data.success === true) {
          fetchData();
        }
      } else {
        window.alert(result.data.payload.msg);
      }
    }
  };

  const handleAdd = () => {
    const addNew = {
      Title: title,
      Body: "<h3>Hello There</h3><br /><p>Start editing </p>",
    };
    let newArray = notesArray;
    newArray.push(addNew);
    setNotesArray(newArray);
    setIndex(notesArray.length - 1);
  };

  const handleDelete = async (id) => {
    let token = cookie.load("auth_token");
    if (id === undefined) {
      setNotesArray(notesArray.filter((el) => el.Id !== undefined));
    } else {
      const payload = {
        token: token,
      };
      const result = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_URL}/deleteNotes/${id}`,
        data: payload,
      });
      if (result.data.statusCode === 200) {
        window.alert("Deleted Successfully");
        setNotesArray(notesArray.filter((el) => el.Id !== id));
      } else {
        window.alert(result.data.payload.msg);
      }
    }
  };

  return (
    <div
      style={{
        width: "90%",
        marginTop: "5vh",
        height: "auto",
      }}
    >
      {loading2 && (
        <Backdrop
          className={classes.backdrop}
          open={loading1}
          onClick={() => setLoading2(false)}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {load && (
        <Grid container justify="space-evenly">
          <Grid item sm={3} md={3} xs={12} className="notes-grid">
            <Button
              style={{ marginBottom: "1rem" }}
              variant="contained"
              color="primary"
              ref={anchorRef}
              aria-controls={open ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
            >
              Add &nbsp;
              <NoteAddIcon style={{ height: "20px", width: "20px" }} />
            </Button>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper style={{ marginLeft: "3rem" }}>
                    <ClickAwayListener onClickAway={handleClose}>
                      <div style={{ padding: "1rem" }}>
                        <TextField
                          id="outlined-basic"
                          value={title}
                          placeholder="Title"
                          onChange={(e) => setTitle(e.target.value)}
                          variant="outlined"
                          size="small"
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAdd}
                        >
                          Add
                        </Button>
                      </div>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            <Card
              style={{ height: "60vh", overflowY: "auto" }}
              variant="outlined"
            >
              <CardContent style={{ padding: "1rem" }}>
                <h3>All your notes</h3>
                <br />
                <hr />
                {loading1 && (
                  <div className={classes.root}>
                    <CircularProgress
                      variant="determinate"
                      className={classes.bottom}
                      size={40}
                      thickness={4}
                      {...props}
                      value={100}
                    />
                    <CircularProgress
                      variant="indeterminate"
                      disableShrink
                      className={classes.top}
                      classes={{
                        circle: classes.circle,
                      }}
                      size={40}
                      thickness={4}
                      {...props}
                    />
                  </div>
                )}
                <MenuList>
                  {load &&
                    notesArray.map((value, index) => {
                      return (
                        <MenuItem
                          key={index}
                          className="allNotes"
                          onClick={() => setIndex(index)}
                        >
                          {" "}
                          <p>&nbsp;{value.Title}</p>
                          <p className="note-icons">
                            <LaunchRoundedIcon
                              onClick={() => setIndex(index)}
                            />{" "}
                            <DeleteRoundedIcon
                              onClick={() => {
                                handleDelete(value.Id);
                              }}
                            />
                          </p>{" "}
                        </MenuItem>
                      );
                    })}
                </MenuList>
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={7} md={7} xs={12} className="notes-grid">
            <>
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <TextField
                  label="Title"
                  id="outlined-size-small"
                  value={
                    notesArray[index] === undefined
                      ? notesArray[0].Title
                      : notesArray[index].Title
                  }
                  variant="outlined"
                  size="small"
                  disabled
                  className="notes-field"
                />
                <Button
                  style={{ marginBottom: "1rem", marginRight: "1rem" }}
                  aria-haspopup="true"
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save &nbsp;
                </Button>
                {add && (
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
                )}
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
                            {opportunityData.map((value, index) => {
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

              <CKEditor
                editor={ClassicEditor}
                data={`<p>${
                  notesArray[index] !== undefined
                    ? notesArray[index].Body
                    : notesArray[0].Body
                }</p>`}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setNote(data);
                }}
              />
            </>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default Notes;
