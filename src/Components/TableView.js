import React, { useState,useEffect,useMemo } from "react";
import { AgGridReact, AgGridColumn } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import axios from "axios"
import "./TableView.css";
import Loader from 'react-loaders'
let loader = <Loader type="square-spin" />
export default function TableView() {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [loading,setLoading] = useState(false);
  const [load,setLoad] = useState(false);
  const [columns,setColumns] = useState([]);

  useEffect(() => {
        setLoading(true);
         async function fetchData(){
            const result = await axios({
                method:"get",
                url:"https://sf-node547.herokuapp.com/allAccounts"
            })
            if(result.data.statusCode === 200){
                const id = [];
                result.data.payload.data.records.map((value,index)=>{
                    id.push(value.Id)
                })
                console.log(id);

                const data = await axios({
                    method:"post",
                    url:"https://sf-node547.herokuapp.com/getMultipleRecords",
                    data:id
                })
                if(data.data.statusCode === 200){
                    console.log(data.data.payload.data)
                    setRowData(data.data.payload.data);
                    setLoading(false);
                    setLoad(true);
                }
                setLoad(true);
                setLoading(false);
            }
            else{
                setLoading(false);
                window.alert("server error");
            }
            
         }
         fetchData();
    },
    []);


  return (
    <div style={{ width: "100%", height: "200px" }}>
     {load &&  <div
        id="myGrid"
        style={{
          height: "90vh",
          width: "90vw"
        }}
        className="ag-theme-alpine"
      >
        <AgGridReact
          defaultColDef={{
            flex: 1,
            minWidth: 200,
            editable: true
          }}
          singleClickEdit={true}
          rowData={rowData}
        >
          {/* <AgGridColumn field="Id" sortable={true} filter={true}></AgGridColumn>
          <AgGridColumn field="Name" sortable={true} filter={true} ></AgGridColumn>
          <AgGridColumn field="price" sortable={true} filter={true} ></AgGridColumn> */}
            {Object.entries(rowData[0]).map(item =>{
                return <AgGridColumn onCellValueChanged={(e)=> {
                    console.log(e);
                    window.alert(e)}} field={item[0]} sortable={true} filter={true}></AgGridColumn>
            })}
        </AgGridReact>
        </div> }
        {loading && loader}
    </div>
  );
}
