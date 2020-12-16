import React, { useState, useEffect, useContext } from "react";
import { AgGridReact, AgGridColumn } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import axios from "axios";
import "./TableView.css";
import Loader from "react-loaders";
import "react-datepicker/dist/react-datepicker.css";
import { OpportunityContext } from "../../contexts/OpportunityContext";
import { AuthContext } from "../../contexts/AuthContext";
import cookie from "react-cookies";
//material UI
import {
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import LocalOfferRoundedIcon from "@material-ui/icons/LocalOfferRounded";
import BackupIcon from "@material-ui/icons/Backup";

//spinner
let loader = <Loader type="square-spin" />;

export default function TableView() {
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [editValue, setEditValue] = useState([]);
  const [save, setSave] = useState(false);
  const [selected, setSelected] = useState(false);
  const [fields, setFields] = useState({});
  const [fields1, setFields1] = useState({});
  const [filteredValue, setFilteredValue] = useState([]);
  const [delId, setDelId] = useState("");
  const [add, setAdd] = useState(false);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [upload, setUpload] = useState(false);

  const {
    opportunityData,
    setOpportunityData,
    opportunitySkeleton,
  } = useContext(OpportunityContext);
  const { loadingAuth, currentUser, setAuth, auth } = useContext(AuthContext);

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
        window.alert(result.data.data.msg);
        setOpportunityData(result.data.data.opportunities);
        setEditValue([]);
        setLoad(true);
    })
    .catch((err)=>{
      window.alert(err.message);
    })
  }

  async function fetchData() {
    let token = cookie.load("auth_token");
    const payload = {
      token: token,
    };
    const result = await axios({
      method: "post",
      url: `${process.env.REACT_APP_BACKEND_URL}/allOpportunities`,
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
        url: `${process.env.REACT_APP_BACKEND_URL}/getMultipleRecords`,
        data: payload1,
      });
      if (data.data.statusCode === 200) {
        setOpportunityData(data.data.payload.data);
        setFilteredValue(data.data.payload.data);
        setFields(data.data.payload.data[0]);
        let gettingFields = Object.assign({}, data.data.payload.data[0]);
        Object.entries(gettingFields).map((item) => {
          gettingFields[item[0]] = true;
          return null;
        });

        setFields1(gettingFields);
        setLoading(false);
        setLoad(true);
      }
      setLoad(true);
      setLoading(false);
    } else {
      setLoading(false);
      window.alert(result.data.payload.msg);
    }
  }

  useEffect(() => {
    setLoading(true);
    // fetchData();
    const response = opportunityData;
    setFilteredValue(response);
    setFields(response[0]);
    let gettingFields = Object.assign({}, response[0]);
    Object.entries(gettingFields).map((item) => {
      gettingFields[item[0]] = true;
      return null;
    });

    setFields1(gettingFields);
    setLoad(true);
    setLoading(false);
  }, []);

  const [checked, setChecked] = React.useState(true);

  const handleCheck = (event, index) => {
    setChecked(!checked);
    let parent = event.target.parentElement.parentElement.parentElement;
    const columnName = parent.children[1].innerText;
    let newField = Object.assign({}, fields1);
    if (newField[columnName] === false) {
      newField[columnName] = true;
    } else {
      newField[columnName] = false;
    }

    setFields1(newField);
  };

  const handleChange = (e) => {
    let field = e.colDef.field;
    let newArray = editValue;
    let present = false;
    if (newArray.length >= 1) {
      newArray.map((value, index) => {
        if (value.Id === e.data.Id) {
          value[field] = e.newValue;
          present = true;
        }
        return null;
      });
      setEditValue(newArray);
      console.log(editValue,newArray);
    }

    if (present === false) {
      let data = {};
      data.Id = e.data.Id;
      data[field] = e.newValue;
      let array = editValue;
      array.push(data);

      setEditValue(array);
      console.log(editValue,array);
    }

    setSave(true);
  };
  const handleSave = async () => {
    if (currentUser !== null) {
      if (opportunityData.length === 1) {
        const result = await axios({
          method: "post",
          url: `${process.env.REACT_APP_BACKEND_URL}/sa/addOpportunity`,
          data: opportunityData,
          headers: {
            Authorization: `Bearer ${currentUser.ya}`,
            "Content-type": "application/json",
          },
        });
        if (result.statusCode === 200) {
          window.alert(result.data.data.msg);
          setSave(false);
          setLoad(false);
          setEditValue([]);
          fetchOpportunityData();
        } else {
          window.alert(result.data.data.msg);
          setEditValue([{}]);
        }
      } else {
        const result = await axios({
          method: "post",
          url: `${process.env.REACT_APP_BACKEND_URL}/sa/addOpportunity`,
          data: editValue,
          headers: {
            Authorization: `Bearer ${currentUser.ya}`,
            "Content-type": "application/json",
          },
        });
        if (result.data.statusCode === 200) {
          window.alert(result.data.data.msg);
          setSave(false);
          fetchOpportunityData();
          setEditValue([]);
          setLoad(false);
        } else {
          window.alert(result.data.data.msg);
          let newArray = [];
          setEditValue([]);
        }
      }
    } else {
      let token = cookie.load("auth_token");
      //add logic for adding new row
      if (editValue[0].Id === null) {
        const data = {};
        Object.entries(editValue[0]).map((item) => {
          if (item[1] !== null) {
            data[item[0]] = item[1];
          }
          return null;
        });
        data.CloseDate = new Date(data.CloseDate);
        const payload = {
          token: token,
          data: data,
        };

        const result = await axios({
          method: "post",
          url: `${process.env.REACT_APP_BACKEND_URL}/addOpportunity`,
          data: payload,
        });
        if (result.data.statusCode === 200) {
          let resultArray = [];
          resultArray = result.data.payload.data;
          if (resultArray.success !== true) {
            window.alert(resultArray.errors[0].message);
            setEditValue([]);
            setSave(false);
            setLoad(false);
            fetchData();
          }
          setEditValue([]);
          setSave(false);
          setLoad(false);
          setLoading(true);
          fetchData();
        } else {
          window.alert(result.data.payload.data);
        }
      } else {
        const payload = {
          token: token,
          editValue: editValue,
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
              setEditValue([]);
              setSave(false);
              setLoad(false);
              fetchData();
            }
            return null;
          });
          setEditValue([]);
          setSave(false);
          setLoad(false);
          setLoading(true);
          fetchData();
        } else {
          window.alert(result.data.payload.msg);
        }
      }
    }
  };

  const addNewRow = () => {
    let newObject = {};
    Object.entries(opportunityData[0]).map((item) => {
      newObject[item[0]] = null;
      return null;
    });
    setOpportunityData([...opportunityData, newObject]);
    setAdd(true);
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleDelete = async () => {
    if (currentUser !== null) {
      if (delId === null) {
        setOpportunityData(opportunityData.filter((el) => el.Id !== null));
      } else {
        const Id = {
          delId,
        };
        const result = await axios({
          method: "post",
          url: `${process.env.REACT_APP_BACKEND_URL}/sa/deleteOpportunity`,
          headers: {
            Authorization: `Bearer ${currentUser.ya}`,
            "Content-type": "application/json",
          },
          data: Id,
        });
        if (result.data.statusCode === 200) {
          window.alert(result.data.data.msg);
          setOpportunityData(opportunityData.filter((el) => el.Id !== delId));
        } else {
          window.alert(result.data.data.msg);
        }
      }
    } else {
      let token = cookie.load("auth_token");

      if (delId === null) {
        setOpportunityData(opportunityData.filter((el) => el.Id !== null));
      } else {
        const payload = {
          token: token,
        };
        const result = await axios({
          method: "post",
          url: `${process.env.REACT_APP_BACKEND_URL}/delete/${delId}`,
          data: payload,
        });
        if (result.data.statusCode === 200) {
          window.alert("Deleted Successfully");
          setDelId("");
          setOpportunityData(opportunityData.filter((el) => el.Id !== delId));
        } else {
          window.alert(result.data.payload.msg);
        }
      }
    }
  };

  return (
    <div
      style={{
        marginTop: "3rem",
        height: "auto",
        width: "100%",
      }}
    >
      {load && (
        <div id="myGrid" className="ag-theme-alpine">
          {save && (
            <Button
              onClick={handleSave}
              color="primary"
              variant="contained"
              style={{ float: "right", marginLeft: "3vw" }}
            >
              Save
            </Button>
          )}
          {selected && (
            <Button
              onClick={handleDelete}
              color="secondary"
              variant="contained"
              style={{ float: "right", marginLeft: "3vw" }}
            >
              Delete
            </Button>
          )}
          <Button
            style={{ marginBottom: "1rem" }}
            color="primary"
            variant="contained"
            onClick={addNewRow}
          >
            Add New Row
          </Button>
          <Button
            ref={anchorRef}
            style={{ marginLeft: "1rem", marginBottom: "1rem" }}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            variant="contained"
          >
            Fields &nbsp;
            <LocalOfferRoundedIcon style={{ height: "20px", width: "20px" }} />
          </Button>
          <Button
            variant="contained"
            color="secondary"
            style={{ marginLeft: "1rem", marginBottom: "1rem" }}
            onClick={() => setUpload(true)}
          >
            Attach Document &nbsp;
            <BackupIcon style={{ height: "20px", width: "20px" }} />
          </Button>
          <Dialog
            open={upload}
            onClose={() => setUpload(false)}
            aria-labelledby="form-dialog-title"
            style={{ minHeight: "30vh", minWidth: "50vw" }}
          >
            <DialogTitle id="form-dialog-title">Add Attachment</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <input type="file" id="myfile" name="myfile" />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setUpload(false)}
                color="secondary"
                variant="contained"
                size="small"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setUpload(false)}
                color="primary"
                variant="contained"
                size="small"
              >
                Upload
              </Button>
            </DialogActions>
          </Dialog>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
            style={{ zIndex: 999 }}
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
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id="menu-list-grow"
                      onKeyDown={handleListKeyDown}
                      style={{
                        maxHeight: "30vh",
                        overflowY: "auto",
                        maxWidth: "20vw",
                        wordWrap: "break-word",
                      }}
                    >
                      {Object.entries(fields1).map((item, index) => {
                        return (
                          <div style={{ display: "flex" }} key={index}>
                            <Checkbox
                              checked={item[1]}
                              onClick={(e) => handleCheck(e, index)}
                              color="primary"
                              inputProps={{
                                "aria-label": "secondary checkbox",
                              }}
                            />
                            <MenuItem
                              style={{ pointerEvents: "none", floar: "right" }}
                              onClick={handleClose}
                            >
                              {item[0]}
                            </MenuItem>
                          </div>
                        );
                      })}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          <AgGridReact
            defaultColDef={{
              flex: 1,
              minWidth: 200,
              editable: true,
              resizable: true,
            }}
            singleClickEdit={true}
            rowData={opportunityData}
            rowSelection="single"
            onRowSelected={(e) => {
              setSelected(true);
              setDelId(e.data.Id);
            }}
          >
            <AgGridColumn
              field="S.No"
              editable={false}
              width={30}
              checkboxSelection={true}
            ></AgGridColumn>

            {Object.entries(fields1).map((item, index) => {
              if (item[1] === true) {
                if (!item[0].includes("Id")) {
                  if (!item[0].includes("Date")) {
                    return (
                      <AgGridColumn
                        onCellValueChanged={(e) => handleChange(e)}
                        field={item[0]}
                        sortable={true}
                        key={index}
                        filter={true}
                        hide={item[0]}
                        checkboxSelection={false}
                      ></AgGridColumn>
                    );
                  } else {
                    return (
                      <AgGridColumn
                        field={item[0]}
                        onCellValueChanged={(e) => handleChange(e)}
                        sortable={true}
                        filter={true}
                        hide={item[0]}
                        checkboxSelection={false}
                      />
                    );
                  }
                } else {
                  if (item[0] === "Id") {
                    return (
                      <AgGridColumn
                        style={{ height: "200px" }}
                        editable={true}
                        field={item[0]}
                        hide={true}
                      ></AgGridColumn>
                    );
                  } else {
                    return (
                      <AgGridColumn
                        editable={false}
                        field={item[0]}
                        hide={true}
                      ></AgGridColumn>
                    );
                  }
                }
              } else {
                return (
                  <AgGridColumn
                    editable={false}
                    field={item[0]}
                    hide={true}
                  ></AgGridColumn>
                );
              }
            })}
          </AgGridReact>
        </div>
      )}
      {loading && loader}
      <br />
      <br />
      {/* 
      <Chart
        options={chart.options}
        series={chart.series}
        type="bar"
        width={500}
        height={320}
      />
      <Chart
        options={chart1.options}
        series={chart1.series}
        type="line"
        width={500}
        height={320}
      />
      <Chart
        options={chart3.options}
        series={chart3.series}
        type="bar"
        width={500}
        height={320}
      /> */}
    </div>
  );
}
