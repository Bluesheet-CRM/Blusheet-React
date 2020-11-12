import React from 'react';
import {
  Container,
  Grid,
  makeStyles,
  Card,
  CardContent
} from '@material-ui/core';
import Page from '../Page';
import TableView from "./TableView";
import Statistics from "./Statistics";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Pipeline = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
          <Grid container>
              <Grid item xl={3} md={3}>
              <Statistics />
              </Grid>
              <Grid item xl={3} md={3}>
              <Statistics />
              </Grid>
              <Grid item xl={3} md={3}>
              <Statistics />
              </Grid>
              <Grid item xl={3} md={3}>
              <Statistics />
              </Grid>
          </Grid>

        <TableView />
      </Container>
    </Page>
  );
};

export default Pipeline;
