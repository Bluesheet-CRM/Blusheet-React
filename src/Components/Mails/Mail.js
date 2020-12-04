import React, { useState, useEffect,useContext } from "react";
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
  CardContent,
  Backdrop,
  CircularProgress,
  makeStyles
} from "@material-ui/core";
import axios from "axios";
import LinkIcon from "@material-ui/icons/Link";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import LaunchRoundedIcon from "@material-ui/icons/LaunchRounded";
import { OpportunityContext } from "../../contexts/OpportunityContext";

import "./Mail.css";
import cookie from 'react-cookies';
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
}));
function Mail() {
  const classes = useStyles();
  const [toAddress, setToAddress] = useState("");

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [open1, setOpen1] = useState(false);
  const [opportunity, setOpportunity] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [load, setLoad] = useState(false);
  const [messageArray, setMessageArray] = useState([]);
  const oppRef = React.useRef(null);
  const [ setIndex] = useState(0);

  
  const {opportunityData} = useContext(OpportunityContext);



  async function fetchData() {
    setLoading1(true);
    let token = cookie.load('auth_token');

      const payload = {
        token: token,
      }

    const result = await axios({
      method: "post",
      url: `${process.env.REACT_APP_BACKEND_URL}/email`,
      data:payload
    });
    if (result.data.statusCode === 200) {
      const id = [];
      result.data.payload.data.records.map((value, index) => {
        id.push(value.Id);
        return null;
      });


      const payload1 = {
        token: token,
        id: id
      }

      const data = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_URL}/mutipleEmailMessage`,
        data: payload1,
      });
      if (data.data.statusCode === 200) {

        setMessageArray(data.data.payload.data);


        setLoad(true);
        setLoading1(false);
      }
      setLoad(true);
    } else {
      setLoading1(false);
      window.alert(result.data.payload.msg);
    }
  }
  useEffect(() => {

    let token = cookie.load('auth_token');
    if(token === null | token === undefined){
        window.location.href="/";
    }
    else{
      fetchData();
      setOpportunity(opportunityData);
    }

    onbeforeunload = e => "Changes made will not be saved";
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
    let token = cookie.load('auth_token');

    
    const data = {
      inputs: [
        {
          "emailAddresses": `${toAddress}`,
          "emailSubject": `${subject}`,
          "emailBody": `${content}`,
          "senderType": "CurrentUser",
        },
      ],
    };
    
    const payload = {
      token: token,
      data:data
    }


    const result = await axios({
      method: "post",
      url: `${process.env.REACT_APP_BACKEND_URL}/sendEmail`,
      data: payload,
      headers:{
        'Content-Type': 'application/json'
      }
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

      const payload1 = {
        token: token,
        emailMessage: emailMessage
      }

      const result1 = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_URL}/addEmail`,
        data: payload1,
      });
      if (result1.data.statusCode === 200) {
        fetchData();
      } else {
        window.alert(result1.data.payload.msg);
      }
    }
  };

  const handleDelete = async (id) => {

    let token = cookie.load('auth_token');

    if (id === undefined) {
      setMessageArray(messageArray.filter((el) => el.Id !== undefined));
    } else {
      const payload = {
        token: token,
      }
      const result = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_URL}/deleteEmailMessage/${id}`,
        data: payload
      });
      if (result.data.statusCode === 200) {
        window.alert("Deleted Successfully");
        setMessageArray(messageArray.filter((el) => el.Id !== id));
      } else {
        window.alert(result.data.payload.msg);
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
          {loading1 && <Backdrop className={classes.backdrop}  open={loading1} onClick={()=>setLoading1(false)}>
        <CircularProgress color="inherit" />
      </Backdrop>}
      <Grid container justify="center">
        <Grid item xl={4} md={4} xs={12}>
          <Card className="mail-title" variant="outlined">
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

        <Grid item xl={7} md={7} xs={12}>
          <div style={{ marginLeft: "5vw" }}>
            <h4>Send Email</h4>
            <br />
            <TextField
              fullwidth
              id="outlined-basic"
              label="To Address"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              variant="outlined"
              className="mail-text"
            />
            <br />
            <br />
            <TextField
              fullwidth
              id="outlined-basic"
              label="Subject"
              variant="outlined"
              className="mail-text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <br />
            <br />
            <TextField
              className="mail-text"
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
              className="link-btn"
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
