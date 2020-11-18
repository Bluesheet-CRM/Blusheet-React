import React, { useState, useEffect } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import axios from "axios";
import { Button, MenuItem, MenuList,ClickAwayListener,Grow,Paper,Popper } from "@material-ui/core";
import LinkIcon from "@material-ui/icons/Link";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "./Products.css";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [fields, setFields] = useState({});
  const [fields1, setFields1] = useState({});
  const [filteredValue, setFilteredValue] = useState([]);
  const [listData, setListData] = useState([]);
  const [add, setAdd] = useState(true);
  const [editValue, setEditValue] = useState([]);
  const [rowData, setRowData] = useState([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxter", price: 72000 },
  ]);
  const oppRef = React.useRef(null);
  const [opportunity, setOpportunity] = useState([]);
  const [selected, setSelected] = useState("");
  const [open1, setOpen1] = React.useState(false);

  const addNewRow = () => {
    let newObject = {};
    Object.entries(rowData[0]).map((item) => {
      newObject[item[0]] = null;
      return null;
    });
    setRowData([...rowData, newObject]);
    setAdd(true);
  };

  async function fetchData() {
    const result = await axios({
      method: "get",
      url: `${process.env.REACT_APP_BACKEND_URL}/products`,
    });
    if (result.data.statusCode === 200) {
      console.log(result.data.payload);
      const id = [];
      result.data.payload.data.records.map((value, index) => {
        id.push(value.Id);
        return null;
      });

      const data = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_URL}/getMultipleProducts`,
        data: id,
      });
      if (data.data.statusCode === 200) {
        console.log(data.data.payload);
        setRowData(data.data.payload.data);
        localStorage.setItem(
          "products",
          JSON.stringify(data.data.payload.data, 2, null)
        );
        setFilteredValue(data.data.payload.data);
        let newArray = [];
        data.data.payload.data.map((value) => {
          newArray.push(value.Name);
          return null;
        });
        setListData(newArray);
        setFields(data.data.payload.data[0]);
        let gettingFields = Object.assign({}, data.data.payload.data[0]);

        Object.entries(gettingFields).map((item) => {
          if (
            (item[0] === "Name") |
            (item[0] === "Quantity") |
            (item[0] === "ListPrice") |
            (item[0] === "ServiceDate") |
            (item[0] === "Description")
          ) {
            gettingFields[item[0]] = true;
            return null;
          }
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
    fetchData();
    const opportunities = JSON.parse(localStorage.getItem("response"));
    setOpportunity(opportunities);
  }, []);

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
    console.log("new", newArray);
  };

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

  const handleSave = async () => {
    console.log(editValue, selected);
    let newArray = editValue;
    newArray[0]["OpportunityId"] = selected;
    for (let i = 0; i < rowData.length; i++) {
      if (rowData[i].Name === newArray[0].Name) {
        newArray[0]["ListPrice"] = rowData[i].ListPrice;
        break;
      }
    }
    delete newArray[0].Id;
    console.log(newArray);
    window.alert("sdsd");
    const result = await axios({
      method: "post",
      url: `${process.env.REACT_APP_BACKEND_URL}/addProducts`,
      data: newArray,
    });
    if (result.data.statusCode === 200) {
      if (result.data.payload.data.success === true) {
        fetchData();
      }
    } else {
      window.alert("server error");
    }
  };

  let priceValueGetter = (params) => {
    for (let i = 0; i < rowData.length; i++) {
      if (rowData[i].Name === params.data.Name) {
        return rowData[i].ListPrice;
      }
    }
    return 0;
  };

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        position: "absolute",
        top: "5vh",
      }}
    >
      <div
        className="ag-theme-alpine"
        style={{
          height: "70vh",
          minWidth: "70vw",
          maxWidth: "80vw",
          marginLeft: "12vw",
          marginTop: "15vh",
        }}
      >
        <Button
          style={{ marginBottom: "1rem", marginRight: "1rem" }}
          color="primary"
          variant="contained"
          onClick={addNewRow}
        >
          Add Product
        </Button>
        <Button
          style={{ marginBottom: "1rem", marginRight: "1rem" }}
          aria-haspopup="true"
          variant="contained"
          color="primary"
          onClick={handleSave}
        >
          Save &nbsp;
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
                  if (item[0].includes("Name")) {
                    return (
                      <AgGridColumn
                        field={item[0]}
                        sortable={true}
                        filter={true}
                        hide={item[0]}
                        checkboxSelection={false}
                        cellEditor="agSelectCellEditor"
                        onCellValueChanged={(e) => handleChange(e)}
                        cellEditorParams={{ values: listData }}
                      ></AgGridColumn>
                    );
                  } else {
                    if (item[0].includes("ListPrice")) {
                      return (
                        <AgGridColumn
                          field={item[0]}
                          sortable={true}
                          filter={true}
                          hide={item[0]}
                          valueGetter={priceValueGetter}
                          onCellValueChanged={(e) => handleChange(e)}
                          checkboxSelection={false}
                          editable={false}
                        ></AgGridColumn>
                      );
                    } else {
                      return (
                        <AgGridColumn
                          field={item[0]}
                          sortable={true}
                          filter={true}
                          hide={item[0]}
                          onCellValueChanged={(e) => handleChange(e)}
                          checkboxSelection={false}
                        ></AgGridColumn>
                      );
                    }
                  }
                } else {
                  return (
                    <AgGridColumn
                      field={item[0]}
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
    </div>
  );
};

export default App;
