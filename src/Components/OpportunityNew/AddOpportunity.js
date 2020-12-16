import React, { useState,useContext } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Grid,
} from "@material-ui/core";
import OpporunityChoose from "./OpporunityChoose";
import { OpportunityContext } from "../../contexts/OpportunityContext";

function AddOpportunity(props) {
  const [fields, setFields] = useState({});
  const {opportunitySkeleton,setOpportunitySkeleton,setOpportunityData} = useContext(OpportunityContext);
  
  function handleChoose(name) {
    let newfields = Object.assign({}, fields);
    newfields[name] = true;
    setFields(newfields);

  }
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ width: "100%" }}
      >
        <DialogTitle id="alert-dialog-title">
          <h2>Choose your Opportunity Fields</h2>
          <br />
          <h3 style={{color:"blue"}}>Chosen Fields</h3>
          <div >
          {Object.keys(fields).map(function (key) {
                return (<span>{key}, </span>)
          })}
          </div>
          <br />
          <br />
        </DialogTitle>
        <DialogContent>
          
          <DialogContentText id="alert-dialog-description">
            <Grid container>
              {Object.keys(props.fields.opportunitiesSkeleton).map(function (
                key
              ) {
                return (
                  <OpporunityChoose
                    key={key}
                    handleChoose={handleChoose}
                    name={key}
                  />
                );
              })}
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpportunitySkeleton(fields);
            let newArray = [];
            let newSkeleton = {};
            for (const [key, value] of Object.entries(fields)) {
              newSkeleton[key] = `add ${key}`;
            }
            newArray[0] = newSkeleton;
            console.log(newArray);
            setOpportunityData(newArray);
        
            props.handleClose(false);
          }} color="primary" variant="contained">
            Save
          </Button>
          <Button
            onClick={() => props.handleClose(false)}
            color="default"
            variant="contained"
            
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddOpportunity;
