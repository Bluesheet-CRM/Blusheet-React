import React, { useContext, useEffect, useState } from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";
import Page from "../Page";
import TableView from "./TableView";
import Statistics from "./Statistics";
import { OpportunityContext } from "../../contexts/OpportunityContext";
import {AuthContext} from "../../contexts/AuthContext";
import cookie from "react-cookies";
import  "./TableView.css";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    maxHeight: "100%",
  },
}));

const Pipeline = () => {
  const classes = useStyles();
  const { opportunityData,opportunitySkeleton,setOpportunityData } = useContext(OpportunityContext);
  const { loadingAuth, currentUser,setAuth,auth } = useContext(AuthContext);
  const [closed, setClosed] = useState(0);
  const [won, setWon] = useState(0);
  const [month, setMonth] = useState(0);

  useEffect(() => {
    let token = cookie.load("auth_token");
    if(loadingAuth && currentUser === null){
    if (((token === null) | (token === undefined)) && !auth ) {
      window.location.href = "/";
    } else {
      let temp1 = 0;
      let temp2 = 0;
      let temp3 = 0;
      for (let i = 0; i < opportunityData.length; i++) {
        if (opportunityData[i].StageName === "Closed Lost") {
          temp1++;
        }
        if (opportunityData[i].StageName === "Closed Won") {
          temp2++;
        }
        if (
          new Date(opportunityData[i].CloseDate).getMonth() ===
          new Date().getMonth
        ) {
          temp3++;
        }
      }
      setClosed(temp1);
      setWon(temp2);
      setMonth(temp3);
    }
  }

    onbeforeunload = (e) => "Changes made will not be saved";
  },[loadingAuth]);


  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        <Grid container spacing={1}>
          <Grid item xl={3} md={3} xs={6} >
            <Statistics
            className="statistics-card"
              count={opportunityData.length}
              name="Total Opportunities"
            />
          </Grid>
          <Grid item xl={3} md={3} xs={6}>
            <Statistics count={closed} name="No of Closed Lost" className="statistics-card" />
          </Grid>
          <Grid item xl={3} md={3} xs={6}>
            <Statistics count={won} name="No of Closed Won" className="statistics-card"/>
          </Grid>
          <Grid item xl={3} md={3} xs={6}>
            <Statistics count={month} name="Closing this month" className="statistics-card" />
          </Grid>
        </Grid>

        <TableView />
      </Container>
    </Page>
  );
};

export default Pipeline;
