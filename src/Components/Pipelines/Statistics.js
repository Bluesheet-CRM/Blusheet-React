import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    margin:"0.5rem"
  },
  avatar: {
    backgroundColor: colors.green[600],
    height: 56,
    width: 56
  },
  differenceIcon: {
    color: colors.green[900]
  },
  differenceValue: {
    color: colors.green[900],
    marginRight: theme.spacing(1)
  }
}));

const Statistics = ({ className,count,name, ...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h2"
              className="stat-text"
            >
              {count || 0}
            </Typography>
            <Typography
              color="textPrimary"
              variant="p"
              className="stat-text"
            >
              {name || null}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

Statistics.propTypes = {
  className: PropTypes.string
};

export default Statistics;
