import React, { useState, useEffect } from "react";
import { Button,
  TextField,
  ClickAwayListener,
  Paper,
  MenuList,
  MenuItem,
  Popper,
  Card,
  Grid,
  Grow,
  CardContent
} from "@material-ui/core";
import axios from "axios";
import LinkIcon from "@material-ui/icons/Link";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import LaunchRoundedIcon from "@material-ui/icons/LaunchRounded";

function Mail() {
  const [toAddress, setToAddress] = useState("");

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [open1, setOpen1] = useState(false);
  const [opportunity, setOpportunity] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [messageArray, setMessageArray] = useState([]);
  const oppRef = React.useRef(null);
  const [index, setIndex] = useState(0);

  async function fetchData() {
    setLoading(true);
    const result = await axios({
      method: "get",
      url: "http://localhost:8080/email",
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
        url: "http://localhost:8080/mutipleEmailMessage",
        data: id,
      });
      if (data.data.statusCode === 200) {
        console.log(data.data.payload.data);
        setMessageArray(data.data.payload.data);

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
  const handleSubmit = async () => {
    const payload = {
      inputs: [
        {
          emailAddresses: `${toAddress}`,
          emailSubject: `${subject}`,
          emailBody: `${content}`,
          senderType: "CurrentUser",
        },
      ],
    };

    const result = await axios({
      method: "post",
      url: "http://localhost:8080/sendEmail",
      data: payload,
    });
    if (result.data.statusCode === 200) {
      const emailMessage = {
        TextBody: `${content}\n\n_____________________________________________________________________\nPowered by Salesforce\nhttp://www.salesforce.com/`,
        HtmlBody: `<html>\n<head>\n\t<title></title>\n</head>\n<body style=\"height: auto; min-height: auto;\">${content}<br />\n<br />\n_____________________________________________________________________<br />\nPowered by Salesforce<br />\nhttp://www.salesforce.com/</body>\n</html>`,
        Headers: null,
        Subject: `${subject}`,
        FromName: "santhosh kumar",
        FromAddress: "sandymech290023@gmail.com",
        ValidatedFromAddress: "sandymech290023@gmail.com",
        ToAddress: `${toAddress}`,
        CcAddress: null,
        BccAddress: "sandymech290023@gmail.com",
        Incoming: false,
        RelatedToId: `${selected}`,
        status: "3",
      };

      const result1 = await axios({
        method: "post",
        url: "http://localhost:8080/addEmail",
        data: emailMessage,
      });
      if (result1.data.statusCode === 200) {
        console.log(result1.data);
      } else {
        window.alert(result1.data.payload.data);
      }
    }
  };

  const handleDelete = async (id) => {
    if (id === undefined) {
      setMessageArray(messageArray.filter((el) => el.Id !== undefined));
    } else {
      const result = await axios({
        method: "delete",
        url: `http://localhost:8080/deleteEmailMessage/${id}`,
      });
      if (result.data.statusCode === 200) {
        window.alert("Deleted Successfully");
        setMessageArray(messageArray.filter((el) => el.Id !== id));
      } else {
        window.alert("server Error");
      }
    }
  };
  return (
    <div
      style={{
        width: "90%",
        marginTop:"5vh"
      }}
    >
      <Grid container justify="space-evenly">
        <Grid item xl={3} md={3}>
          <Card style={{ height: "60vh" }} variant="outlined">
            <CardContent style={{ padding: "1rem" }}>
              <h3>All your Emails</h3>
              <br />
              <hr />
              <MenuList>
                {load &&
                  messageArray.map((value, index) => {
                    return (
                      <MenuItem
                        key={index}
                        className="allNotes"
                        onClick={() => setIndex(index)}
                      >
                        {" "}
                        <p>&nbsp;{value.Subject}</p>
                        <p className="note-icons">
                          <LaunchRoundedIcon onClick={() => setIndex(index)} />{" "}
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

        <Grid item xl={7} md={7}>
          <div style={{ marginLeft: "15vw" }}>
            <h4>Send Email</h4>
            <br />
            <TextField
              fullwidth
              id="outlined-basic"
              label="To Address"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              variant="outlined"
              style={{ width: "40vw" }}
            />
            <br />
            <br />
            <TextField
              fullwidth
              id="outlined-basic"
              label="Subject"
              variant="outlined"
              style={{ width: "40vw" }}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <br />
            <br />
            <TextField
              style={{ width: "40vw" }}
              id="outlined-multiline-static"
              label="Content"
              multiline
              rows={8}
              variant="outlined"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <br />
            <br />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Send Mail
            </Button>

            <Button
              style={{ margin: "1rem" }}
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
          </div>
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
                    placement === "bottom" ? "center top" : "center bottom",
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
        </Grid>
      </Grid>
    </div>
  );
}

export default Mail;
