import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact, AgGridColumn } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import axios from "axios";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
import "./TableView.css";
import DatePicker from "react-datepicker";
import Button from "@material-ui/core/Button";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "react-loaders";
let loader = <Loader type="square-spin" />;
export default function TableView() {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [editValue, setEditValue] = useState([]);
  const [save, setSave] = useState(false);
  const [selected,setSelected] = useState(false);
  const [delId,setDelId] = useState("");
  const [add,setAdd] = useState(false);

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
    if(editValue[0].Id === null){
      const payload = {};
      Object.entries(editValue[0]).map((item) => {
        if(item[1] !== null){
          payload[item[0]] = item[1]
        }
      })
      const result = await axios({
        method:"post",
        url:"https://sf-node547.herokuapp.com/addAccount",
        data:payload
      })
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
    else{
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
    setRowData([...rowData,newObject]);
    setAdd(true)
  };



  const handleDelete = async() =>{
      const result = await axios({
        method:"delete",
        url:`https://sf-node547.herokuapp.com/delete/${delId}`
      })
      if(result.data.statusCode === 200){
        window.alert("Deleted Successfully");
        setDelId("");
        setLoad(false);
        setLoading(true);
        fetchData();
      }
      else{
        window.alert("server Error")
      }
  }

  return (
    <div style={{ width: "100%", height: "200px" }}>
      {load && (
        <div
          id="myGrid"
          style={{
            height: "70vh",
            width: "70vw",
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
          
          <AgGridReact
            defaultColDef={{
              flex: 1,
              minWidth: 200,
              editable: true,
              resizable: true 
            }}
            singleClickEdit={true}
            rowData={rowData}
            rowSelection='single'
            onRowSelected={(e)=>{
              setSelected(true);
              setDelId(e.data.Id)
            }}
          >
            {/* <AgGridColumn field="Id" sortable={true} filter={true}></AgGridColumn>
          <AgGridColumn field="Name" sortable={true} filter={true} ></AgGridColumn>
          <AgGridColumn field="price" sortable={true} filter={true} ></AgGridColumn> */}
            {Object.entries(rowData[0]).map((item) => {
              if (!item[0].includes("Id")) {
                return (
                  <AgGridColumn
                    onCellValueChanged={(e) => handleChange(e)}
                    field={item[0]}
                    sortable={true}
                    filter={true}
                    checkboxSelection={false}
                    
                  ></AgGridColumn>
                );
              } else {
                if(item[0] === "Id"){
                  return (
                    <AgGridColumn editable={false} field={item[0]} checkboxSelection={true}  ></AgGridColumn>
                  );
                }
                else{
                  return (
                    <AgGridColumn editable={false} field={item[0]} ></AgGridColumn>
                  );
                }
                
              }
            })}
          </AgGridReact>
        </div>
      )}
      {loading && loader}
    </div>
  );
}
