import React, { useState, useEffect } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Button from "@material-ui/core/Button";
import LinkIcon from "@material-ui/icons/Link";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import axios from "axios";
import BookTwoToneIcon from "@material-ui/icons/BookTwoTone";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import TextField from "@material-ui/core/TextField";
import "./Notes.css";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import LaunchRoundedIcon from "@material-ui/icons/LaunchRounded";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
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
  const [note, setNote] = useState("");
  const [notesArray, setNotesArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [index, setIndex] = useState(0);
  const [add, setAdd] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [opportunity, setOpportunity] = useState([]);
  const [selected, setSelected] = useState("");
  const [open1, setOpen1] = React.useState(false);
  const oppRef = React.useRef(null);

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

  const handleClose1 = (event,index) => {
    if (oppRef.current && oppRef.current.contains(event.target)) {
      return;
    }
    setSelected(opportunity[index].Id)
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
    const result = await axios({
      method: "get",
      url: "http://localhost:8080/notes",
    });
    if (result.data.statusCode === 200) {
      const id = [];
      result.data.payload.data.records.map((value, index) => {
        id.push(value.Id);
      });
      console.log(id);

      const data = await axios({
        method: "post",
        url: "http://localhost:8080/getMultipleNotes",
        data: id,
      });
      if (data.data.statusCode === 200) {
        console.log(data.data.payload.data);
        setNotesArray(data.data.payload.data);
        localStorage.setItem(
          "notes",
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
    // const response = JSON.parse(localStorage.getItem("notes"));
    // setNotesArray(response);
    const opportunities = JSON.parse(localStorage.getItem("response"));
    setOpportunity(opportunities);
    // setLoad(true);
  }, []);

  const handleSave = async () => {
    if (selected === "") {
      window.alert("Choose The Opportunity");
    } else {
      const payload = {
        Title: notesArray[index].Title,
        Body: note,
        ParentId: selected,
      };
      const result = await axios({
        method: "post",
        url: "http://localhost:8080/addNotes",
        data: payload,
      });
      if (result.data.statusCode === 200) {
        if (result.data.payload.data.success === true) {
          fetchData();
        }
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
    console.log(id)
    if ((id === null) | (id === undefined)) {
      setNotesArray(notesArray.filter((el) => el.Id !== null));
    } else {
      const result = await axios({
        method: "delete",
        url: `http://localhost:8080/deleteNotes/${id}`,
      });
      if (result.data.statusCode === 200) {
        window.alert("Deleted Successfully");
        setLoad(false);
        setLoading(true);
        setNotesArray(notesArray.filter((el) => el.Id !== id));
      } else {
        window.alert("server Error");
      }
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "auto",
        position: "absolute",
        top: "20vh",
      }}
    >
      {load && (
        <Grid container justify="space-evenly">
          <Grid item sm={3} md={3}>
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
            <Card style={{ height: "60vh" }} variant="outlined">
              <CardContent style={{ padding: "1rem" }}>
                <h3>All your notes</h3>
                <br />
                <hr />
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
                              onClick={() => handleDelete(value.Id)}
                            />
                          </p>{" "}
                        </MenuItem>
                      );
                    })}
                </MenuList>
                {loading && (
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
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={7} md={7}>
            <>
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <TextField
                  label="Title"
                  id="outlined-size-small"
                  value={notesArray[index].Title}
                  variant="outlined"
                  size="small"
                  disabled
                  style={{
                    width: "20vw",
                    marginRight: "1rem",
                    background: "#fff",
                    height: "2.5rem",
                    borderRadius: "5px",
                  }}
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
                  style={{zIndex:2,marginLeft:"3rem", maxHeight:"40vh", overflowY:"auto",maxwidth:"30vw", wordWrap: "break-word",}}
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
                        <ClickAwayListener onClickAway={()=>setOpen1(false)}>
                          <MenuList
                            autoFocusItem={open1}
                            id="menu-list-grow"
                          >
                            {opportunity.map((value,index)=>{
                              return <MenuItem key={index} onClick={(e)=>handleClose1(e,index)}>
                              {value.Name}
                            </MenuItem>
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
                data={`<p>${notesArray[index].Body}</p>`}
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
