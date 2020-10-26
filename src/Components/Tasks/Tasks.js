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
import "../Notes/Notes.css";
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
  const [sub, setSub] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  async function fetchData() {
    setLoading(true);
    const result = await axios({
      method: "get",
      url: "https://sf-node547.herokuapp.com/tasks",
    });
    if (result.data.statusCode === 200) {
      const id = [];
      result.data.payload.data.records.map((value, index) => {
        id.push(value.Id);
      });
      console.log(id);

      const data = await axios({
        method: "post",
        url: "https://sf-node547.herokuapp.com/getMultipleTasks",
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
        Status : status,
        ActivityDate: new Date(date)
      };
      const result = await axios({
        method: "post",
        url: "https://sf-node547.herokuapp.com/addTasks",
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
        url: `https://sf-node547.herokuapp.com/deleteTasks/${id}`,
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
        width: "100vw",
        height: "auto",
        position: "absolute",
        top: "20vh",
      }}
    >
      {load && (
        <Grid container justify="space-evenly">
          <Grid item sm={3} md={3}>
            <Card
              style={{ height: "60vh", marginTop: "3rem" }}
              variant="outlined"
            >
              <CardContent style={{ padding: "1rem" }}>
                <h3>All your Tasks</h3>
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
                          <p>&nbsp;{value.Subject}</p>
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
              </div>
              <Card variant="outlined">
                <CardContent>
                  <TextField
                    id="outlined-basic"
                    label="Subject"
                    variant="outlined"
                    fullWidth
                    value={sub}
                    onChange={(e)=>setSub(e.target.value)}
                  />
                  <br />
                  <br />
                  <TextField
                    id="outlined-basic1"
                    label="Description"
                    variant="outlined"
                    fullWidth
                    value={desc}
                    onChange={(e)=>setDesc(e.target.value)}
                  />
                  <br />
                  <br />
                  <TextField
                    id="outlined-basic2"
                    label="Status"
                    variant="outlined"
                    fullWidth
                    value={status}
                    onChange={(e)=>setStatus(e.target.value)}
                  />
                  <br />
                  <br />
                  <TextField
                    id="outlined-basic3"
                    label="Activity Date"
                    variant="outlined"
                    fullWidth
                    value={date}
                    onChange={(e)=>setDate(e.target.value)}
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
        </Grid>
      )}
    </div>
  );
}

export default Notes;
