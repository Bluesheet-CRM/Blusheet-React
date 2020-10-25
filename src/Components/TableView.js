import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact, AgGridColumn } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import axios from "axios";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
import CircularProgress from '@material-ui/core/CircularProgress';

import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import "./TableView.css";
import DatePicker from "react-datepicker";
import Button from "@material-ui/core/Button";
import "react-datepicker/dist/react-datepicker.css";
import Checkbox from "@material-ui/core/Checkbox";
import LocalOfferRoundedIcon from "@material-ui/icons/LocalOfferRounded";
import Loader from "react-loaders";
let loader = <Loader type="square-spin" />;
export default function TableView() {
  const [rowData, setRowData] = useState([]);
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

  async function fetchData() {
    const result = await axios({
      method: "get",
      url: "https://sf-node547.herokuapp.com/allAccounts",
    });
    if (result.data.statusCode === 200) {
      const id = [];
      result.data.payload.data.records.map((value, index) => {
        id.push(value.Id);
      });
      console.log(id);

      const data = await axios({
        method: "post",
        url: "https://sf-node547.herokuapp.com/getMultipleRecords",
        data: id,
      });
      if (data.data.statusCode === 200) {
        console.log(data.data.payload.data);
        setRowData(data.data.payload.data);
        localStorage.setItem(
          "response",
          JSON.stringify(data.data.payload.data, 2, null)
        );
        setFilteredValue(data.data.payload.data);
        setFields(data.data.payload.data[0]);
        let gettingFields = Object.assign({}, data.data.payload.data[0]);
        Object.entries(gettingFields).map((item) => {
          gettingFields[item[0]] = true;
        });
        console.log(gettingFields);
        setFields1(gettingFields);
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
    setLoading(true);
    fetchData();
    // const response = JSON.parse(localStorage.getItem("response"));
    // setRowData(response);
    // setFilteredValue(response);
    // setFields(response[0]);
    // let gettingFields = Object.assign({}, response[0]);
    // Object.entries(gettingFields).map((item) => {
    //   gettingFields[item[0]] = true;
    // });
    // console.log(gettingFields);
    // setFields1(gettingFields);
    // setLoad(true);
    // setLoading(false);
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
          console.log(value);
          present = true;
        }
      });
      setEditValue(newArray);
    }

    if (present === false) {
      let data = {};
      data.Id = e.data.Id;
      data[field] = e.newValue;
      let array = editValue;
      array.push(data);
      console.log(array);
      setEditValue(array);
    }

    setSave(true);
  };
  const handleSave = async () => {
    //add logic for adding new row
    if (editValue[0].Id === null) {
      const payload = {};
      Object.entries(editValue[0]).map((item) => {
        if (item[1] !== null) {
          payload[item[0]] = item[1];
        }
      });
      console.log(payload)
      payload.CloseDate = new Date(payload.CloseDate);
      console.log(payload)
      const result = await axios({
        method: "post",
        url: "https://sf-node547.herokuapp.com/addAccount",
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
        window.alert("server error");
      }
    } else {
      const result = await axios({
        method: "post",
        url: "https://sf-node547.herokuapp.com/updateMultiple",
        data: editValue,
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
        });
        setEditValue([]);
        setSave(false);
        setLoad(false);
        setLoading(true);
        fetchData();
      } else {
        window.alert("server error");
      }
    }
  };

  const addNewRow = () => {
    let newObject = {};
    Object.entries(rowData[0]).map((item) => {
      newObject[item[0]] = null;
    });
    setRowData([...rowData, newObject]);
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
    if(delId === null){
      setRowData(rowData.filter((el)=> el.Id !== null));
    }
    else{
    const result = await axios({
      method: "delete",
      url: `https://sf-node547.herokuapp.com/delete/${delId}`,
    });
    if (result.data.statusCode === 200) {
      window.alert("Deleted Successfully");
      setDelId("");
      setRowData(rowData.filter((el)=> el.Id !== delId));
    } else {
      window.alert("server Error");
    }
  }
  };

  return (
    <div style={{ width: "100%", height: "auto",position:"absolute",top:"5vh" }}>
      {load && (
        <div
          id="myGrid"
          style={{
            height: "70vh",
            minWidth: "70vw",
            maxWidth: "80vw",
            marginLeft: "12vw",
            marginTop: "15vh",
          }}
          className="ag-theme-alpine"
        >
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
                          <div style={{ display: "flex" }}>
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
            rowData={rowData}
            rowSelection="single"
            onRowSelected={(e) => {
              setSelected(true);
              setDelId(e.data.Id);
            }}
          >
            <AgGridColumn field="S.No" editable={false} width={30} checkboxSelection={true}></AgGridColumn>

            {Object.entries(fields1).map((item) => {
              if (item[1] === true) {
                if (!item[0].includes("Id")) {
                  if(!item[0].includes("Date")){
                  return (
                    <AgGridColumn
                      onCellValueChanged={(e) => handleChange(e)}
                      field={item[0]}
                      sortable={true}
                      filter={true}
                      hide={item[0]}
                      checkboxSelection={false}
                    ></AgGridColumn>
                  );
                  }
                  else{
                    return <AgGridColumn field={item[0]}
                    onCellValueChanged={(e) => handleChange(e)}
                    sortable={true}
                    filter={true}
                    hide={item[0]}
                    checkboxSelection={false}  />
                  }
                } else {
                  console.log(item[0])
                  if (item[0] === "Id") {
                    return (
                      <AgGridColumn
                        style={{ height: "200px" }}
                        editable={true}
                        field={item[0]}
                      
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

    </div>
  );
}
