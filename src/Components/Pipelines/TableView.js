import React, { useState, useEffect } from "react";
import { AgGridReact, AgGridColumn } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import axios from "axios";
import "./TableView.css";
import Loader from "react-loaders";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  Grid
} from "@material-ui/core";
import LocalOfferRoundedIcon from "@material-ui/icons/LocalOfferRounded";
import BackupIcon from "@material-ui/icons/Backup";
import Chart from "react-apexcharts";

//spinner
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
  const [upload, setUpload] = useState(false);
  const [chart, setChart] = useState({
    series: [
      {
        name: "PRODUCT A",
        data: [44, 55, 41, 67, 22, 43, 21, 49],
      },
      {
        name: "PRODUCT B",
        data: [13, 23, 20, 8, 13, 27, 33, 12],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        stackType: "100%",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      xaxis: {
        categories: [
          "2011 Q1",
          "2011 Q2",
          "2011 Q3",
          "2011 Q4",
          "2012 Q1",
          "2012 Q2",
          "2012 Q3",
          "2012 Q4",
        ],
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "right",
        offsetX: 0,
        offsetY: 50,
      },
    },
  });
  const [chart1, setChart1] = useState({
    series: [
      {
        name: "Website Blog",
        type: "column",
        data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
      },
      {
        name: "Social Media",
        type: "line",
        data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: [0, 4],
      },
      title: {
        text: "Traffic Sources",
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: [
        "01 Jan 2001",
        "02 Jan 2001",
        "03 Jan 2001",
        "04 Jan 2001",
        "05 Jan 2001",
        "06 Jan 2001",
        "07 Jan 2001",
        "08 Jan 2001",
        "09 Jan 2001",
        "10 Jan 2001",
        "11 Jan 2001",
        "12 Jan 2001",
      ],
      xaxis: {
        type: "datetime",
      },
      yaxis: [
        {
          title: {
            text: "Website Blog",
          },
        },
        {
          opposite: true,
          title: {
            text: "Social Media",
          },
        },
      ],
    },
  });
  const [chart3, setChart3] = useState({
    series: [
      {
        data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [
          "South Korea",
          "Canada",
          "United Kingdom",
          "Netherlands",
          "Italy",
          "France",
          "Japan",
          "United States",
          "China",
          "Germany",
        ],
      },
    },
  });

  async function fetchData() {
    const result = await axios({
      method: "get",
      url: `${process.env.REACT_APP_BACKEND_URL}/allAccounts`,
    });
    if (result.data.statusCode === 200) {
      const id = [];
      result.data.payload.data.records.map((value, index) => {
        id.push(value.Id);
        return null;
      });

      const data = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_URL}/getMultipleRecords`,
        data: id,
      });
      if (data.data.statusCode === 200) {
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
          return null;
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
    // fetchData();
    const response = JSON.parse(localStorage.getItem("response"));
    setRowData(response);
    setFilteredValue(response);
    setFields(response[0]);
    let gettingFields = Object.assign({}, response[0]);
    Object.entries(gettingFields).map((item) => {
      gettingFields[item[0]] = true;
      return null;
    });
    console.log(gettingFields);
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
          console.log(value);
          present = true;
        }
        return null;
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
        return null;
      });
      console.log(payload);
      payload.CloseDate = new Date(payload.CloseDate);
      console.log(payload);
      const result = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_URL}/addAccount`,
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
      console.log(editValue);
      const result = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_URL}/updateMultiple`,
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
          return null;
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
      return null;
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
    if (delId === null) {
      setRowData(rowData.filter((el) => el.Id !== null));
    } else {
      const result = await axios({
        method: "delete",
        url: `${process.env.REACT_APP_BACKEND_URL}/delete/${delId}`,
      });
      if (result.data.statusCode === 200) {
        window.alert("Deleted Successfully");
        setDelId("");
        setRowData(rowData.filter((el) => el.Id !== delId));
      } else {
        window.alert("server Error");
      }
    }
  };

  return (
    <div
      style={{
        marginTop:"3rem",
        height: "auto",
        width:"100%"
      }}
    >   
      {load && (
        <div
          id="myGrid"
          style={{
            height: "65vh",
            width:"95%",
            marginLeft:"2rem"
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
            <AgGridColumn
              field="S.No"
              editable={false}
              width={30}
              checkboxSelection={true}
            ></AgGridColumn>

            {Object.entries(fields1).map((item) => {
              if (item[1] === true) {
                if (!item[0].includes("Id")) {
                  if (!item[0].includes("Date")) {
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
