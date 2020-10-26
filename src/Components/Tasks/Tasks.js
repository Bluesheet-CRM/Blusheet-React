import React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

function Tasks() {
  return (
    <div
      style={{
        width: "100vw",
        height: "auto",
        position: "absolute",
        top: "20vh",
      }}
    >
      <Grid container justify="center">
        <Grid item xs={12} sm={4} md={4} >
          <Card variant="outlined" style={{minHeight:"60vh" ,margin:"2rem"}}>
            <CardContent style={{padding:"2rem"}}> 
                <h3>All your tasks</h3>
                <br />
                <hr />

            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4} md={4} >
          <Card variant="outlined" style={{minHeight:"60vh",margin:"2rem"}}>
            <CardContent></CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Tasks;
